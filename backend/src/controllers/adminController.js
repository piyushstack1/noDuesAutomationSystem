import prisma from '../prisma/index.js';

// Get all no-dues requests with detailed status for admin dashboard
export const noDuesRequest = async (req, res) => {
    try {
        const { month, year } = req.query;

        // If no month/year provided use current month
        const today = new Date();
        const filterMonth = month ? parseInt(month) - 1 : today.getMonth(); // 0-based month
        const filterYear = year ? parseInt(year) : today.getFullYear();

        const startDate = new Date(filterYear, filterMonth, 1);
        const endDate = new Date(filterYear, filterMonth + 1, 0); // Last day of month

        const requests = await prisma.noDuesRequest.findMany({
            where: {
                submitted_at: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                student: {
                    include: {
                        department: true,
                        hostel: true
                    }
                },
                tracks: {
                    include: {
                        queries: {
                            where: {
                                status: 'Pending'
                            }
                        }
                    }
                },
                final: true
            },
            orderBy: {
                submitted_at: 'desc'
            }
        });

        // Transform the data to include computed status and progress
        const transformedRequests = requests.map(request => {
            const totalTracks = request.tracks.length;
            const approvedTracks = request.tracks.filter(track => track.status === 'Approved').length;
            const pendingQueries = request.tracks.reduce((total, track) => total + track.queries.length, 0);

            let currentStatus = request.status;
            if (request.final?.final_status) {
                currentStatus = request.final.final_status;
            } else if (pendingQueries > 0) {
                currentStatus = 'Queries Pending';
            }

            return {
                request_id: request.request_id,
                submitted_at: request.submitted_at,
                student: {
                    student_id: request.student.student_id,
                    name: request.student.name,
                    email: request.student.email,
                    department: request.student.department?.department_name || 'Not Assigned',
                    hostel: request.student.is_hosteler
                        ? request.student.hostel?.hostel_name || 'Hostel Not Assigned'
                        : 'Day Scholar',
                    studentType: request.student.is_hosteler ? 'Hosteler' : 'Day Scholar'
                },
                status: currentStatus,
                progress: {
                    totalUnits: totalTracks,
                    approvedUnits: approvedTracks,
                    progressPercentage: Math.round((approvedTracks / totalTracks) * 100),
                    pendingQueries: pendingQueries
                },
                tracks: request.tracks.map(track => ({
                    unit_type: track.unit_type,
                    status: track.status,
                    pending_queries: track.queries.length
                }))
            };
        });

        // Add month/year info to response
        res.status(200).json({
            success: true,
            data: transformedRequests,
            total: transformedRequests.length,
            timeFrame: {
                month: filterMonth + 1,
                year: filterYear,
                monthName: new Date(filterYear, filterMonth).toLocaleString('default', { month: 'long' }),
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            }
        });
    } catch (error) {
        console.error('Error in noDuesRequest:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch no dues requests',
            message: error.message
        });
    }
}

// Get all students 
export const getAllStudents = async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            include: {
                department: true,
                hostel: true,
                NoDuesRequest: {
                    where: {
                        status: {
                            not: 'CANCELLED'
                        }
                    },
                    orderBy: {
                        submitted_at: 'desc'
                    },
                    take: 1
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        const studentData = students.map(student => ({
            student_id: student.student_id,
            name: student.name,
            email: student.email,
            mobile_no: student.mobile_no || 'Not Provided',
            department: student.department?.department_name || 'Not Assigned',
            course: student.course || 'Not Provided',
            degree: student.degree || 'Not Provided',
            cgpa: student.cgpa || 'Not Provided',
            residenceStatus: {
                type: student.is_hosteler ? 'Hosteler' : 'Day Scholar',
                hostel: student.is_hosteler ? student.hostel?.hostel_name || 'Not Assigned' : null,
                roomNo: student.is_hosteler ? student.room_no || 'Not Assigned' : null
            },
            latestRequest: student.NoDuesRequest[0] ? {
                status: student.NoDuesRequest[0].status,
                submitted_at: student.NoDuesRequest[0].submitted_at
            } : null,
            bankDetails: {
                accountNo: student.bank_account_no || 'Not Provided',
                ifscCode: student.ifsc_code || 'Not Provided'
            },
            documents: student.documents || [],
            profilePicture: student.profile_picture || null
        }));

        const stats = {
            total: transformedStudents.length,
            hostelers: transformedStudents.filter(s => s.residenceStatus.type === 'Hosteler').length,
            dayScholars: transformedStudents.filter(s => s.residenceStatus.type === 'Day Scholar').length,
            withActiveRequests: transformedStudents.filter(s => s.latestRequest &&
                ['PENDING', 'IN_PROGRESS'].includes(s.latestRequest.status)).length
        };

        res.status(200).json({
            success: true,
            data: studentData,
            stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in getAllStudents:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch students',
            message: error.message
        });
    }
}

// Forward no-dues request to respective units
export const forwardRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        if (!requestId) {
            return res.status(400).json({
                success: false,
                error: 'Request ID is required'
            });
        }

        const request = await prisma.noDuesRequest.findUnique({
            where: { request_id: parseInt(requestId) },
            include: {
                student: true,
                tracks: true
            }
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Request not found'
            });
        }

        if (request.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                error: 'Reques already forwarded'
            });
        }

        //required units
        let requiredUnits = [
            { type: "DEPARTMENT", step: 1 },
            { type: "LIBRARY", step: 2 },
            { type: "ACCOUNTS", step: 3 },
            { type: "SPORTS", step: 4 },
            { type: "PROCTOR", step: 5 }
        ];

        // Add HOSTEL unit if student is a hosteler
        if (request.student.is_hosteler) {
            requiredUnits.splice(1, 0, { type: "HOSTEL", step: 2 });
            for (let i = 2; i < requiredUnits.length; i++) {
                requiredUnits[i].step++;
            }
        }

        // add NCC unit if degreeType is BTECH or BARCH
        if (['BTECH', 'BARCH'].includes(request.student.degree.toUpperCase())) {
            requiredUnits.push({
                type: "NCC",
                step: requiredUnits.length + 1
            });
        }

        // Creating tracks and updating request status
        const updatedRequest = await prisma.$transaction(async (prisma) => {
            // Create tracks for each unit
            const tracks = await prisma.track.createMany({
                data: requiredUnits.map(unit => ({
                    request_id: request.request_id,
                    unit_type: unit.type,
                    step_number: unit.step,
                    status: 'PENDING',
                    remarks: `Forwarded to ${unit.type} for approval`
                }))
            });

            // Update request status to PROGRESS
            const updatedRequest = await prisma.noDuesRequest.update({
                where: { request_id: parseInt(requestId) },
                data: {
                    status: 'PROGRESS',
                    last_updated_at: new Date()
                },
                include: {
                    student: true,
                    tracks: true
                }
            });

            return updatedRequest;
        });

        res.status(200).json({
            success: true,
            message: 'Request forwarded to units successfully',
            data: {
                request_id: updatedRequest.request_id,
                status: updatedRequest.status,
                student: {
                    student_id: updatedRequest.student.student_id,
                    name: updatedRequest.student.name
                },
                tracks: updatedRequest.tracks.map(track => ({
                    unit_type: track.unit_type,
                    step_number: track.step_number,
                    status: track.status
                }))
            }
        });

    } catch (error) {
        console.error('Error in forwardRequest:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to forward request',
            message: error.message
        });
    }
};

// get student by id

export const getStudentById = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            return res.status(400).json({ success: false, error: 'Student ID is required' });
        }
        const student = await prisma.student.findUnique({
            where: { student_id: studentId },
            include: {
                department: true,
                hostel: true,
                NoDuesRequest: {
                    orderBy: {
                        submitted_at: 'desc'
                    },
                    take: 1
                }
            }
        });
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        const studentData = {
            student_id: student.student_id,
            name: student.name,
            email: student.email,
            mobile_no: student.mobile_no || 'Not Provided',
            department: student.department?.department_name || 'Not Assigned',
            course: student.course || 'Not Provided',
            degree: student.degree || 'Not Provided',
            cgpa: student.cgpa || 'Not Provided',
            residenceStatus: {
                type: student.is_hosteler ? 'Hosteler' : 'Day Scholar',
                hostel: student.is_hosteler ? student.hostel?.hostel_name || 'Not Assigned' : null,
                roomNo: student.is_hosteler ? student.room_no || 'Not Assigned' : null
            },
            latestRequest: student.NoDuesRequest[0] ? {
                status: student.NoDuesRequest[0].status,
                submitted_at: student.NoDuesRequest[0].submitted_at
            } : null,
            bankDetails: {
                accountNo: student.bank_account_no || 'Not Provided',
                ifscCode: student.ifsc_code || 'Not Provided'
            },
            documents: student.documents || [],
            profilePicture: student.profile_picture || null
        };
        res.status(200).json({ success: true, data: studentData });
    } catch (error) {
        console.error('Error in getStudentById:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch student', message: error.message });
    }
}

// Final approval of no-dues request by admin
export const finalApproval = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { adminId, remarks } = req.body;

        const request = await prisma.noDuesRequest.findUnique({
            where: { request_id: parseInt(requestId) },
            include: {
                tracks: true,
                student: true,
                final: true
            }
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Request not found'
            });
        }

        if (request.final) {
            return res.status(400).json({
                success: false,
                error: 'Final approval already given for this request'
            });
        }

        const allTracksApproved = request.tracks.every(track => track.status === 'APPROVED');
        if (!allTracksApproved) {
            return res.status(400).json({
                success: false,
                error: 'All units must approve before final approval'
            });
        }

        // Create final approval and update request status in a transaction
        const finalApproval = await prisma.$transaction(async (prisma) => {
            const approval = await prisma.finalApproval.create({
                data: {
                    admin_id: adminId,
                    request_id: parseInt(requestId),
                    final_status: 'APPROVED',
                    issued_at: new Date()
                }
            });

            // Update request status
            const updatedRequest = await prisma.noDuesRequest.update({
                where: { request_id: parseInt(requestId) },
                data: {
                    status: 'APPROVED',
                    completed_at: new Date(),
                    remarks: remarks || 'Final approval granted',
                    last_updated_at: new Date()
                },
                include: {
                    student: true,
                    tracks: true,
                    final: true
                }
            });

            return { approval, request: updatedRequest };
        });

        res.status(200).json({
            success: true,
            message: 'Final approval granted successfully',
            data: {
                request_id: finalApproval.request.request_id,
                student: {
                    student_id: finalApproval.request.student.student_id,
                    name: finalApproval.request.student.name
                },
                status: 'APPROVED',
                approved_at: finalApproval.approval.issued_at,
                remarks: finalApproval.request.remarks
            }
        });

    } catch (error) {
        console.error('Error in finalApproval:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process final approval',
            message: error.message
        });
    }
};