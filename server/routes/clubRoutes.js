import express, {Router} from 'express'
import cors from 'cors'
import { test, registerUser, loginUser, getProfile, getLogout } from '../controllers/clubControllers.js'

// middleware
const r = Router()
r.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173',
    }));

r.get('/', test);
r.post('/register', registerUser);
r.post('/login', loginUser);
r.get('/profile', getProfile);
r.get('/logout', getLogout);

export default r