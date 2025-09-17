const User = require('../models/users');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');

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
            jwt.sign({ email:user.email, id:user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(user);
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
     const getProfile = (req, res) => {
        const {token} = req.cookies;
        if(token){
            jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
                if (err) throw err;
                res.json(user);
            });
        }
        else{
            res.json(null);
        }
        };

        // hago logout
        const getLogout = (req, res) => {
            res.clearCookie('token').json({ 
                success: true, 
                message: 'Logout exitoso' 
            });
        };
module.exports = { 
    test,
    registerUser,
    loginUser,
    getProfile,
    getLogout,
 };