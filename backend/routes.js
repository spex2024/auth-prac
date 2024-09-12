import express from 'express';
import User from './model.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import {sendMail, verifyEmail} from "./controller.js";

const router = express.Router();

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Create the user
        const user = await User.create({ username, email, password });

        // Generate the verification code
        const verificationCode = generateVerificationCode();

        // Send the verification email
        await sendMail({
            to: email,
            subject: 'Your Verification Code',
            html: `<h1>Hello, ${username}</h1><p>Your verification code is <strong>${verificationCode}</strong>.</p>`,
        });

        // Respond after sending the email successfully
        return res.status(200).json({ message: 'Verification code sent successfully!' });

    } catch (error) {
        // Check if it's a user creation error or email sending error
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Failed to send verification code', error: error.message });
        }
        return res.status(400).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set JWT in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // 1 hour
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
         await verifyEmail({
             email,
             subject: 'Login Success',
             html: `<h1>Hello, ${user.username}</h1><p>Login Successful</p>`,
         })
        return res.json({ message: 'Logged in successfully' });

    } catch (error) {
        if (!res.headersSent) {
            return res.status(400).json({ message: error.message });
        }
    }
});

// Logout
router.post('/logout', (req, res) => {
    // Clear the JWT cookie
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0),
    });
    return res.json({ message: 'Logged out successfully' });
});

export default router;
