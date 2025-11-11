import prisma from "../prisma/index.js";

// Get all no-dues requests for the unit that are currently not approved
export const noDuesRequest = async(req,res)=>{
    try{
        const { unitType } = req.params; 

        const approvalFieldMap = {
            DEPARTMENT: 'department_approval',
            HOSTEL: 'hostel_approval',
            LIBRARY: 'library_approval',
            ACCOUNTS: 'accounts_approval',
            SPORTS: 'sports_approval',
            PROCTOR: 'proctor_approval',
            NCC: 'ncc_approval'
        };

        const approvalField = approvalFieldMap[unitType];

        if (!approvalField) {
            return res.status(400).json({ 
                message: "Invalid unit type",
                validTypes: Object.keys(approvalFieldMap)
            });
        }

        
        const requests = await prisma.noDuesRequest.findMany({
            where: {
                [approvalField]: false,
                status: {
                    in: ['PENDING', 'PROGRESS']
                }
            },
            include: {
                student: {
                    select: {
                        student_id: true,
                        name: true,
                        email: true,
                        department: true,
                        branch: true,
                        cgpa: true,
                        mobile_no: true,
                        profile_picture: true
                    }
                },
                tracks: {
                    where: {
                        unit_type: unitType
                    }
                },
                queries: {
                    where: {
                        approving_unit: unitType,
                        status: {
                            in: ['PENDING', 'PROGRESS']
                        }
                    }
                }
            },
            orderBy: {
                submitted_at: 'asc'
            }
        });

        res.status(200).json({
            message: "noDues requests retrieved successfully",
            unitType,
            count: requests.length,
            requests
        });

    }catch(e){
        console.error("Error fetching no-dues requests:", e);
        res.status(500).json({
            message: "Error fetching no-dues requests",
            error: e.message
        });
    }
}

// Get detailed student information for a specific no-dues request
export const getStudentDetails = async(req,res)=>{
    try{
        const { studentId } = req.params;

        const studentDetails = await prisma.student.findUnique({
            where: {
                student_id: studentId
            },
            include: {
                request: {
                    include: {
                        tracks: true,
                        queries: true,
                        admin: {
                            select: {
                                admin_id: true,
                                name: true,
                                email: true
                            }
                        },
                        final: true
                    }
                },
                department_rel: true,
                hostel: true
            }
        });

        if (!studentDetails) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (!studentDetails.request) {
            return res.status(404).json({
                message: "No no-dues request found for this student"
            });
        }

        // Calculate approval status
        const approvalStatus = {
            department: studentDetails.request.department_approval,
            hostel: studentDetails.request.hostel_approval,
            library: studentDetails.request.library_approval,
            accounts: studentDetails.request.accounts_approval,
            sports: studentDetails.request.sports_approval,
            proctor: studentDetails.request.proctor_approval,
            ncc: studentDetails.request.ncc_approval
        };

        const allApproved = Object.values(approvalStatus).every(status => status === true);

        res.status(200).json({
            message: "Student details retrieved successfully",
            student: {
                student_id: studentDetails.student_id,
                name: studentDetails.name,
                email: studentDetails.email,
                course: studentDetails.course,
                department: studentDetails.department,
                branch: studentDetails.branch,
                degree: studentDetails.degree,
                cgpa: studentDetails.cgpa,
                mobile_no: studentDetails.mobile_no,
                aadhar_passport: studentDetails.aadhar_passport,
                address: studentDetails.address,
                bank_account_no: studentDetails.bank_account_no,
                ifsc_code: studentDetails.ifsc_code,
                is_hosteler: studentDetails.is_hosteler,
                room_no: studentDetails.room_no,
                profile_picture: studentDetails.profile_picture,
                admission_date: studentDetails.admission_date,
                passing_date: studentDetails.passing_date,
                documents: studentDetails.documents
            },
            noDuesRequest: {
                request_id: studentDetails.request.request_id,
                status: studentDetails.request.status,
                submitted_at: studentDetails.request.submitted_at,
                completed_at: studentDetails.request.completed_at,
                last_updated_at: studentDetails.request.last_updated_at,
                reason: studentDetails.request.reason,
                remarks: studentDetails.request.remarks,
                approvalStatus,
                allApproved,
                admin: studentDetails.request.admin
            },
            departmentInfo: studentDetails.department_rel,
            hostelInfo: studentDetails.hostel,
            tracks: studentDetails.request.tracks,
            queries: studentDetails.request.queries,
            finalApproval: studentDetails.request.final
        });

    }catch(e){
        console.error("Error fetching student details:", e);
        res.status(500).json({
            message: "Error fetching student details",
            error: e.message
        });
    }
}