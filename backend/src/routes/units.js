import express from 'express';
const router = express.Router();
import { noDuesRequest, getStudentDetails } from '../controllers/unitController.js';


router.get("/requests/:unitType",noDuesRequest);
router.get("/student/:studentId", getStudentDetails);




export default router;