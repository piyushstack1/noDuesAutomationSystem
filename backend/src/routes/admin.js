import express from 'express';
const router = express.Router();

import { 
    noDuesRequest, 
    getAllStudents, 
    getStudentById,
    forwardRequest,
    finalApproval
} from '../controllers/adminController.js';

// Admin routes for managing no-dues requests
router.get('/requests', noDuesRequest);
router.get('/students', getAllStudents); 
router.get('/students/:studentId', getStudentById);
router.post('/requests/:requestId/forward', forwardRequest);
router.post('/requests/:requestId/approve', finalApproval); 


export default router;