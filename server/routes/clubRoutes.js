import express, {Router} from 'express'
import cors from 'cors'
import { test, registerUser, loginUser, getProfile, getLogout, fetchUsers, deleteUser, editUser, createNews } from '../controllers/clubControllers.js'

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
r.get('/superadmin/users', fetchUsers);
r.delete('/superadmin/users/:id', deleteUser);
r.put('/superadmin/users/:id', editUser);
r.post('/news', createNews);

export default r