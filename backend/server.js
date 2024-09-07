import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import authRoutes from './routes.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
}));
app.use(cors({
    origin: process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : ['https://main.d1uttamemr9hsi.amplifyapp.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use('/api/auth', authRoutes);
//
// // Protected route example
// app.get('/api/protected', authMiddleware, (req, res) => {
//     res.json({ message: 'This is a protected route', user: req.user });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
