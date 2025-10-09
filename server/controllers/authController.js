import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ error: 'Todos los campos son requeridos' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ error: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.json({
            success: true,
            message: 'Usuario registrado exitosamente'
        });

    } catch (error) {
        console.log('Error:', error);
        return res.json({ error: 'Error al registrar usuario' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ error: 'Todos los campos son requeridos' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: 'Email o contraseña incorrectos' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ error: 'Email o contraseña incorrectos' });
        }

        return res.json({
            success: true,
            message: 'Login exitoso',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log('Error:', error);
        return res.json({ error: 'Error al iniciar sesión' });
    }
};