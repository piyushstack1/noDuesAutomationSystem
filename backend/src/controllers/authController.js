import prisma from "../../prisma/index.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 



// Student Authentication
export const studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const student = await prisma.student.findUnique({
            where: { email }
        });
        
        if (!student) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare hashed password
        const validPassword = await bcrypt.compare(password, student.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: student.student_id, email: student.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Remove password from response
        const { password: _, ...studentData } = student;
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            student:{
                student_id : student.student_id,
                name: student.name,
                email: student.email,
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

export const studentRegister = async (req, res) => {
    try {
        const { student_id, name, email, password, confirmPassword } = req.body;

        if (!student_id || !name || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Check for existing email or student ID
        const existingStudent = await prisma.student.findFirst({
            where: {
                OR: [
                    { email }, { student_id }
                ]
            }
        });

        if (existingStudent) {
            return res.status(400).json({ error: 'Student already exists' });
        }

        // hash password with bcrypt
        const hashedPassword = bcrypt.hashSync(password, 10);

        // generate jwt token

        const token = jwt.sign({ email, student_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Create new student
        
        const student = await prisma.student.create({
            data: {
                student_id,
                name,
                email,
                password : hashedPassword,
            }
        });
        
        res.status(201).json({ success : true,message: 'Student registered successfully',token : token });
    } catch (error) {
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'Email or Student ID already exists' });
        } else {
            res.status(500).json({ error: 'Failed to register student' });
        }
    }
};