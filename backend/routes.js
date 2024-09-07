import express from 'express';
import User from './model.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();
// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ username, email, password });
        res.status(201).json({ message: 'User registered', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
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
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000,  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', });
        res.json({ message: 'Logged in successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    // Clear the JWT cookie
    res.cookie('token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', expires: new Date(0) });
    res.json({ message: 'Logged out successfully' });
});

export default router;
