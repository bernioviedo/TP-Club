import 'dotenv/config';
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import clubRoutes from './routes/clubRoutes.js'
//import mediaRoutes from './routes/mediaRoutes.js';
const app = express();


//database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('DB connected'))
.catch((err) => console.log('DB not connected', err));

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//rutas
app.use('/', clubRoutes);
//app.use('/', mediaRoutes);

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));