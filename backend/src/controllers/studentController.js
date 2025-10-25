import prisma from "../../prisma/index.js";

// Submit No Dues Form with complete student details
export const submitNoDuesForm = async (req, res) => {
    try {
        const {
            student_id,
            studentName,
            scholarNo,
            department,
            branch,
            degree,
            course,
            mobileNo,
            email,
            hostelNo,
            roomNo,
            cgpa,
            aadharPassport,
            address,
            bankAccountNo,
            ifscCode,
            isHosteler,
            reason
        } = req.body;

        // Get uploaded files
        const profilePicture = req.files?.profilePicture?.[0];
        const documents = req.files?.documents || [];

        // Validate required fields
        if (!student_id || !studentName || !email || !course) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Step 1: Find the Admin
        const admin = await prisma.admin.findFirst();

        if (!admin) {
            return res.status(500).json({ error: "Admin not found in the system" });
        }

        // Step 2: Check if student exists, if not create
        let student = await prisma.student.findUnique({
            where: { student_id }
        });

        if (!student) {
            // Validate department exists if provided
            if (department) {
                const deptExists = await prisma.department.findUnique({
                    where: { department_code: department }
                });
                if (!deptExists) {
                    return res.status(400).json({ 
                        error: `Department with code '${department}' not found. Please select a valid department.` 
                    });
                }
            }

            // Validate hostel exists if student is a hosteler
            if (isHosteler === 'true' && hostelNo) {
                const hostelExists = await prisma.hostel.findUnique({
                    where: { hostel_no: hostelNo }
                });
                if (!hostelExists) {
                    return res.status(400).json({ 
                        error: `Hostel '${hostelNo}' not found. Please enter a valid hostel number.` 
                    });
                }
            }

            // Create student with all form data
            student = await prisma.student.create({
                data: {
                    student_id,
                    name: studentName,
                    email,
                    password: "defaultPassword123", // TODO: Implement proper password handling
                    course,
                    admission_date: new Date(),
                    department_code: department || null,
                    hostel_no: (isHosteler === 'true' && hostelNo) ? hostelNo : null,
                    // Additional form fields
                    scholar_no: scholarNo,
                    branch: branch || null,
                    degree: degree || null,
                    mobile_no: mobileNo || null,
                    room_no: roomNo || null,
                    cgpa: cgpa ? parseFloat(cgpa) : null,
                    aadhar_passport: aadharPassport || null,
                    address: address || null,
                    bank_account_no: bankAccountNo || null,
                    ifsc_code: ifscCode || null,
                    is_hosteler: isHosteler === 'true',
                    profile_picture: profilePicture ? profilePicture.filename : null,
                    documents: documents.length > 0 ? documents.map(doc => ({
                        filename: doc.filename,
                        originalname: doc.originalname,
                        size: doc.size,
                        mimetype: doc.mimetype
                    })) : null
                }
            });
        } else {
            // Update existing student with new form data if needed
            student = await prisma.student.update({
                where: { student_id },
                data: {
                    name: studentName,
                    email,
                    course,
                    department_code: department || null,
                    hostel_no: (isHosteler === 'true' && hostelNo) ? hostelNo : null,
                    // Update additional form fields
                    scholar_no: scholarNo,
                    branch: branch || null,
                    degree: degree || null,
                    mobile_no: mobileNo || null,
                    room_no: roomNo || null,
                    cgpa: cgpa ? parseFloat(cgpa) : null,
                    aadhar_passport: aadharPassport || null,
                    address: address || null,
                    bank_account_no: bankAccountNo || null,
                    ifsc_code: ifscCode || null,
                    is_hosteler: isHosteler === 'true',
                    profile_picture: profilePicture ? profilePicture.filename : null,
                    documents: documents.length > 0 ? documents.map(doc => ({
                        filename: doc.filename,
                        originalname: doc.originalname,
                        size: doc.size,
                        mimetype: doc.mimetype
                    })) : student.documents // keep existing if no new documents
                }
            });
        }

        // Step 3: Check if student already has an active request
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

        // Step 4: Create new request with tracks
        const request = await prisma.noDuesRequest.create({
            data: {
                student: { connect: { student_id } },
                admin: { connect: { admin_id: admin.admin_id } },
                reason: reason || null,
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
            include: { 
                tracks: true,
                student: {
                    include: {
                        department: true,
                        hostel: true
                    }
                }
            }
        });

        // Step 5: Success response
        res.status(201).json({
            message: "No dues form submitted successfully",
            request,
            studentDetails: {
                student_id,
                name: studentName,
                email,
                course,
                department,
                hostel: isHosteler === 'true' ? hostelNo : null,
                scholar_no: scholarNo,
                cgpa: cgpa ? parseFloat(cgpa) : null
            },
            uploadedFiles: {
                profilePicture: profilePicture?.filename,
                documents: documents.map(d => d.filename)
            }
        });

    } catch (error) {
        console.error("Error in submitNoDuesForm:", error);
        res.status(500).json({ 
            error: "Failed to submit no dues form",
            details: error.message 
        });
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