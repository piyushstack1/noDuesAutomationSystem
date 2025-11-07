import express from 'express';
import upload from '../middleware/upload.js';
import {
    submitNoDuesForm,
    getFormDetails,
    getApprovalStatus,
    getQueries,
    resolveQuery,
    getProgressTracker,
    getFinalStatus,
    getRequestHistory,
} from '../controllers/studentController.js';

const router = express.Router();


// No Dues Form Routes
router.post('/noduesform', 
    upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'documents', maxCount: 10 }
    ]), 
    submitNoDuesForm
);
router.get('/noduesform/:studentId', getFormDetails);

// Status and Tracking Routes
router.get('/approvalstatus/:studentId', getApprovalStatus);
router.get('/queries/:studentId', getQueries);
router.post('/resolveQuery/:studentId/:approvingUnitId', resolveQuery);
router.get('/tracker/:studentId', getProgressTracker);
router.get('/finalStatus/:studentId', getFinalStatus);

// History Route
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