import 'dotenv/config';
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import clubRoutes from './routes/clubRoutes.js'
import cors from 'cors'

const app = express();


//database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('DB connected'))
.catch((err) => console.log('DB not connected', err));

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173',
    }));

//rutas
app.use('/', clubRoutes);

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));