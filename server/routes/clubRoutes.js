import express, {Router} from 'express'
import cors from 'cors'
import { test, registerUser, loginUser, getProfile, getLogout, fetchUsers, deleteUser, editUser, } from '../controllers/clubControllers.js'
import { upload, createNews, fetchNews, fetchOneNew, deleteNew } from '../controllers/newsControllers.js'

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
r.post('/news', upload.single('image'), createNews);
r.get('/news', fetchNews);
r.get('/news/:id', fetchOneNew);
r.delete('/news/:id', deleteNew);

export default r