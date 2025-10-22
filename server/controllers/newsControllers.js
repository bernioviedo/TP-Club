import News from '../models/news.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import pkg from 'jsonwebtoken';
const { verify } = pkg;
import User from '../models/users.js';

// comprobar que las env de Cloudinary están cargadas
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary env missing:',
    {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET
    }
  );
}

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

//configuracion de multer (para manejo de archivos)
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

const test = (req, res) => {
    res.json({ message: 'Test is working' });
};

//creo noticia
const createNews = async (req, res) => {
    try {
        const { title, content } = req.body;

        const file = req.file;

        // valido datos
        if (!title || !content || !file ) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

    // obtener token desde cookies y verificar
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    // verifico token
    verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });

    // obtengo user para comprobar rol
    const authorUser = await User.findById(decoded.id).select('userType');
    if (!authorUser) return res.status(401).json({ error: 'Usuario no encontrado' });

    // chequeo que sea admin
    if (authorUser.userType !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
    }
    try {
        // para subir a cloudinary
        const uploadToCloudinary = () => new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "noticias_club" }, 
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        }
                    );
                stream.end(file.buffer);
                });

                const uploadResult = await uploadToCloudinary();
        // creo noticia en la bd
        const news = await News.create({ 
            title,
            content,
            image: uploadResult.secure_url,
            imagePublicId: uploadResult.public_id,
            author:decoded.id,
            createdAt: new Date(),    
        });
        return res.status(201).json(news);
    } catch (error) {
        console.log("Error subiendo a Cloudinary o creando noticia:", error);
        return res.status(500).json({ error: 'Error al subir la imagen o crear la noticia' });
    }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

//hago fetch de noticias
const fetchNews = async (req, res) => {
    try {
        const news = await News.find();
        res.json(news);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

//hago fetch de noticia por id
const fetchOneNew = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        res.json(news);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

//hago delete de noticia
const deleteNew = async (req, res) => {
    try {
        const deletedNews = await News.findByIdAndDelete(req.params.id);
        if (!deletedNews) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }
        // eliminar imagen de Cloudinary
        if (deletedNews.imagePublicId) { try {
            await cloudinary.uploader.destroy(deletedNews.imagePublicId);
        } catch (cloudinaryError) {
            console.log("Error eliminando imagen de Cloudinary:", cloudinaryError);
        }
    }
        res.json({ message: 'Noticia eliminada' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export {
    test,
    createNews,
    fetchNews,
    fetchOneNew,
    deleteNew
};