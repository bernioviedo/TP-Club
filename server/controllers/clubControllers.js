import User from '../models/users.js';
import { hashPassword, comparePassword } from '../helpers/auth.js';
import pkg from 'jsonwebtoken';

const { sign, verify } = pkg

const test = (req, res) => {
    res.json({ message: 'Test is working' });
};


//endpoint de registro
const registerUser =  async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        //chequeo si ingresaron nombre
        if (!name) {
            return res.json({ error: 'Es obligatorio ingresar un nombre' });
        }

        //chequeo si la contraseña esta bien
        if (!password || password.length < 6) {
            return res.json({ error: 'La contraseña es necesaria y debe ser de al menos 6 caracteres' });
        };
        //chequeo el mail
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({ error: 'Este email ya esta registrado' });
        }
        if (!email) {
            return res.json({ error: 'Es obligatorio ingresar un email' });
        }

        //hasheo la contraseña
        const hashedPassword = await hashPassword(password);

        //creo el usuario en la BD
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            userType: 'user', 
        });

        return res.json(user);
    } catch (error) {
        console.log(error);
    }    
};

//endpoint de login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //compruebo si el usuario existe
        const user = await User.findOne({ email });
         if (!user) {
         return res.json({ error: 'Usuario o contraseña incorrectos' });
        }
        //compruebo si la contraseña es correcta
        const match = await comparePassword(password, user.password);
        if (match){
            sign({ email:user.email, id:user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                const userData = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    userType: user.userType,
                };
                res.cookie('token', token).json(userData);
            });
        }
        if (!match) {
            return res.json({ error: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.log(error);
    }
     };

     //mantengo la sesión iniciada
const getProfile = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.json(null);

    verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) return res.status(401).json(null);

      // buscar usuario en la BD usando el id del token y excluir la contraseña
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.json(null);

      res.json(user);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// hago logout
const getLogout = (req, res) => {
    res.clearCookie('token').json({ 
        success: true, 
        message: 'Logout exitoso' 
    });
};

//hago fetch de users
const fetchUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

//hago delete de user
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Usuario eliminado' });
        } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

//hago edit de user
const editUser = async (req, res) => {
    try {
        const { name, userType } = req.body; 
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, userType },
            { new: true }
        ).select('-password'); 
        res.json(updatedUser);
    }
        catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};



export { 
    test,
    registerUser,
    loginUser,
    getProfile,
    getLogout,
    fetchUsers,
    deleteUser,
    editUser,
};