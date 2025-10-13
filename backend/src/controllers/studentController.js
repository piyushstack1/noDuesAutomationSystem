import prisma from '../../../prisma/index.js';

// Submit No Dues Form
import prisma from "../../../prisma/index.js";

// Submit No Dues Form
export const submitNoDuesForm = async (req, res) => {
    try {
        const { student_id } = req.body;

        // Step 1: Find the single Admin (Administrative Dept.)
        const admin = await prisma.admin.findFirst({
            where: { role: "ADMIN" }   // <-- change condition as per your schema
        });

        if (!admin) {
            return res.status(500).json({ error: "Admin not found in the system" });
        }

        // Step 2: Check if student already has an active request
        const existingRequest = await prisma.noDuesRequest.findFirst({
            where: {
                student_id,
                NOT: {
                    OR: [
                        { status: "Rejected" },
                        { status: "Completed" }
                    ]
                }
            }
        });

        if (existingRequest) {
            return res.status(400).json({ error: "Active request already exists" });
        }

        // Step 3: Create new request with tracks
        const request = await prisma.noDuesRequest.create({
            data: {
                student: { connect: { student_id } },
                admin: { connect: { admin_id: admin.admin_id } }, // auto-linked admin dept
                tracks: {
                    create: [
                        { unit_type: "Department", step_number: 1 },
                        { unit_type: "Hostel", step_number: 2 },
                        { unit_type: "Library", step_number: 3 },
                        { unit_type: "Accounts", step_number: 4 },
                        { unit_type: "Sports", step_number: 5 },
                        { unit_type: "Proctor", step_number: 6 }
                    ]
                }
            },
            include: { tracks: true }
        });

        // Step 4: Success response
        res.status(201).json({
            message: "No dues form submitted successfully",
            request
        });

    } catch (error) {
        console.error("Error in submitNoDuesForm:", error);
        res.status(500).json({ error: "Failed to submit no dues form" });
    }
};

// Get Submitted Form Details
export const getFormDetails = async (req, res) => {
    try {
        const { studentId } = req.params;

        const formDetails = await prisma.noDuesRequest.findFirst({
            where: { student_id: studentId },
            include: {
                student: {
                    include: {
                        department: true,
                        hostel: true
                    }
                },
                tracks: {
                    include: {
                        queries: true
                    }
                },
                final: true
            },
            orderBy: {
                submitted_at: 'desc'
            }
        });

        if (!formDetails) {
            return res.status(404).json({ error: 'No dues form not found' });
        }

        res.json(formDetails);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch form details' });
    }
};

// Get Approval Status
export const getApprovalStatus = async (req, res) => {
    try {
        const { studentId } = req.params;

        const tracks = await prisma.track.findMany({
            where: {
                request: {
                    student_id: studentId,
                    status: {
                        not: 'Completed'
                    }
                }
            },
            select: {
                unit_type: true,
                status: true,
                queries: {
                    where: {
                        status: 'Pending'
                    }
                }
            }
        });

        const statuses = tracks.map(track => ({
            unit: track.unit_type,
            status: track.queries.length > 0 ? 'QueryRaised' : track.status
        }));

        res.json(statuses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch approval status' });
    }
};

// Get Queries List
export const getQueries = async (req, res) => {
    try {
        const { studentId } = req.params;

        const queries = await prisma.query.findMany({
            where: {
                student_id: studentId,
                status: 'Pending'
            },
            select: {
                query_id: true,
                approving_unit: true,
                remarks: true,
                created_at: true,
                status: true
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        res.json(queries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch queries' });
    }
};

// Resolve Query
export const resolveQuery = async (req, res) => {
    try {
        const { studentId, approvingUnitId } = req.params;
        const { queryId, response } = req.body;

        const updatedQuery = await prisma.query.update({
            where: {
                query_id: parseInt(queryId),
                student_id: studentId,
                approving_unit: approvingUnitId
            },
            data: {
                status: 'Resolved',
                resolved_at: new Date(),
                remarks: response
            }
        });

        res.json({ message: 'Query resolved successfully', query: updatedQuery });
    } catch (error) {
        res.status(500).json({ error: 'Failed to resolve query' });
    }
};

// Get Progress Tracker
export const getProgressTracker = async (req, res) => {
    try {
        const { studentId } = req.params;

        const tracks = await prisma.track.findMany({
            where: {
                request: {
                    student_id: studentId,
                    status: 'In-Progress'
                }
            }
        });

        const totalUnits = tracks.length;
        const approvedUnits = tracks.filter(track => track.status === 'Approved').length;
        const progressPercentage = totalUnits > 0 ? Math.round((approvedUnits / totalUnits) * 100) : 0;

        res.json({
            totalUnits,
            approvedUnits,
            progressPercentage,
            remainingUnits: totalUnits - approvedUnits
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch progress tracker' });
    }
};

// Get Final Status
export const getFinalStatus = async (req, res) => {
    try {
        const { studentId } = req.params;

        const request = await prisma.noDuesRequest.findFirst({
            where: { student_id: studentId },
            include: {
                final: true,
                tracks: true
            },
            orderBy: {
                submitted_at: 'desc'
            }
        });

        if (!request) {
            return res.status(404).json({ error: 'No request found' });
        }

        let status = 'Pending';
        if (request.final) {
            status = request.final.final_status;
        } else if (request.tracks.every(track => track.status === 'Approved')) {
            status = 'Ready for Collection';
        } else if (request.tracks.some(track => track.status === 'Approved')) {
            status = 'In-Progress';
        }

        res.json({ status });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch final status' });
    }
};

// Get Request History (Optional)
export const getRequestHistory = async (req, res) => {
    try {
        const { studentId } = req.params;

        const history = await prisma.noDuesRequest.findMany({
            where: { student_id: studentId },
            include: {
                tracks: {
                    select: {
                        unit_type: true,
                        status: true,
                        updated_at: true
                    }
                },
                final: {
                    select: {
                        final_status: true,
                        issued_at: true
                    }
                }
            },
            orderBy: {
                submitted_at: 'desc'
            }
        });

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch request history' });
    }
};

// Student Authentication
export const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const student = await prisma.student.findUnique({
            where: { email },
            include: {
                department: true,
                hostel: true
            }
        });
        
        if (!student || student.password !== password) { // Note: In production, use proper password hashing
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        res.json({ message: 'Login successful', student });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

export const registerStudent = async (req, res) => {
    try {
        const { student_id, name, email, password, course, admission_date, department_code, hostel_no } = req.body;
        
        const student = await prisma.student.create({
            data: {
                student_id,
                name,
                email,
                password, // Note: In production, hash the password
                course,
                admission_date: new Date(admission_date),
                department_code,
                hostel_no
            }
        });
        
        res.status(201).json({ message: 'Student registered successfully', student });
    } catch (error) {
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'Email or Student ID already exists' });
        } else {
            res.status(500).json({ error: 'Failed to register student' });
        }
    }
};