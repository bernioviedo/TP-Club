import { Router } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import Media from '../models/media.js';

// Configuración de multer ROUTE
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Formato de imagen no válido'));
  }
});

// Controladores
const createMedia = async (req, res) => {
  try {
    const nuevaMedia = new Media({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      texto: req.body.texto,
      url_imagen: req.file ? `/uploads/${req.file.filename}` : '',
      tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [],
      autor: req.body.autor
    });
    const mediaGuardada = await nuevaMedia.save();
    res.status(201).json(mediaGuardada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ fecha_creacion: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMedia = async (req, res) => {
  try {
    const update = {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      texto: req.body.texto,
      tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [],
      autor: req.body.autor
    };
    if (req.file) update.url_imagen = `/uploads/${req.file.filename}`;

    const mediaActualizada = await Media.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(mediaActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMedia = async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Media eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware
const r = Router();
r.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);

// Rutas
r.post('/', upload.single('imagen'), (req, res, next) => {
  console.log('Archivo recibido:', req.file);
  next();
}, createMedia);
r.get('/', getAllMedia);
r.put('/:id', upload.single('imagen'), updateMedia);
r.delete('/:id', deleteMedia);

export default r;