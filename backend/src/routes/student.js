import express from 'express';
import {
    submitNoDuesForm,
    getFormDetails,
    getApprovalStatus,
    getQueries,
    resolveQuery,
    getProgressTracker,
    getFinalStatus,
    getRequestHistory,
    loginStudent,
    registerStudent
} from '../controllers/studentController.js';

const router = express.Router();

// Auth Routes
router.post('/register', registerStudent);
router.post('/login', loginStudent);

// No Dues Form Routes
router.post('/noduesform', submitNoDuesForm);
router.get('/noduesform/:studentId', getFormDetails);

// Status and Tracking Routes
router.get('/approvalstatus/:studentId', getApprovalStatus);
router.get('/queries/:studentId', getQueries);
router.post('/resolveQuery/:studentId/:approvingUnitId', resolveQuery);
router.get('/tracker/:studentId', getProgressTracker);
router.get('/finalStatus/:studentId', getFinalStatus);

// History Route (Optional)
router.get('/history/:studentId', getRequestHistory);


router.get('/noduesform/:studentId', getFormDetails);

// Status and Tracking Routes
router.get('/approvalstatus/:studentId', getApprovalStatus);
router.get('/queries/:studentId', getQueries);
router.post('/resolveQuery/:studentId/:approvingUnitId', resolveQuery);
router.get('/tracker/:studentId', getProgressTracker);
router.get('/finalStatus/:studentId', getFinalStatus);

// History Route (Optional)
router.get('/history/:studentId', getRequestHistory);



export default router;