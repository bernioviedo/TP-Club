import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('✅ DB connected'))
    .catch((err) => console.log('❌ DB not connected', err));

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/', authRoutes);

const port = 8000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));