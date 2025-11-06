import express from 'express';
const router = express.Router();
import {
    studentLogin,
    studentRegister     
} from '../controllers/authController.js';



// student auth routes
router.post('/student/register', studentRegister);
router.post('/student/login', studentLogin);

export default router;