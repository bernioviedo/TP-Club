import Media from '../models/media.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Comprobar que las env de Cloudinary están cargadas
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary env missing:', {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET
  });
}

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Configuración de multer (para manejo de archivos)
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
});

// Test
const test = (req, res) => {
  res.json({ message: 'Media test is working' });
};

// Crear media
const createMedia = async (req, res) => {
  try {
    const { titulo, descripcion, autor } = req.body;
    const file = req.file;

    // Validar datos
    if (!titulo || !descripcion || !file) {
      return res.status(400).json({ error: 'Título, descripción e imagen son obligatorios' });
    }

    try {
      // Función para subir a Cloudinary
      const uploadToCloudinary = () => new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "la-gacela-fc" }, 
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
      console.log('Imagen subida a Cloudinary:', uploadResult.secure_url);

      // Crear media en la BD
      const media = await Media.create({ 
        titulo,
        descripcion,
        url_imagen: uploadResult.secure_url,
        cloudinary_id: uploadResult.public_id,
        autor: autor || 'Administrador',
        fecha_creacion: new Date()
      });

      console.log('Media guardada en MongoDB');
      return res.status(201).json(media);

    } catch (error) {
      console.error('Error subiendo a Cloudinary o creando media:', error);
      return res.status(500).json({ error: 'Error al subir la imagen o crear la media' });
    }

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Obtener todas las medias
const getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ fecha_creacion: -1 });
    res.json(media);
  } catch (error) {
    console.error('❌ Error al obtener media:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Obtener una media por ID
const getOneMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Media no encontrada' });
    }
    res.json(media);
  } catch (error) {
    console.error('❌ Error al obtener media:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Actualizar media
const updateMedia = async (req, res) => {
  try {
    const { titulo, descripcion, autor } = req.body;
    const file = req.file;

    const updateData = {
      titulo,
      descripcion,
      autor
    };

    // Si hay nueva imagen, subir a Cloudinary
    if (file) {
      // Buscar media actual para eliminar imagen anterior
      const mediaActual = await Media.findById(req.params.id);
      
      if (mediaActual && mediaActual.cloudinary_id) {
        try {
          await cloudinary.uploader.destroy(mediaActual.cloudinary_id);
          console.log('🗑️ Imagen anterior eliminada de Cloudinary');
        } catch (cloudinaryError) {
          console.error('Error eliminando imagen anterior:', cloudinaryError);
        }
      }

      // Subir nueva imagen
      const uploadToCloudinary = () => new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "la-gacela-fc" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(file.buffer);
      });

      const uploadResult = await uploadToCloudinary();
      updateData.url_imagen = uploadResult.secure_url;
      updateData.cloudinary_id = uploadResult.public_id;
      console.log('Nueva imagen subida');
    }

    const mediaActualizada = await Media.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!mediaActualizada) {
      return res.status(404).json({ error: 'Media no encontrada' });
    }

    res.json(mediaActualizada);
  } catch (error) {
    console.error('❌ Error al actualizar media:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Eliminar media
const deleteMedia = async (req, res) => {
  try {
    const deletedMedia = await Media.findByIdAndDelete(req.params.id);
    
    if (!deletedMedia) {
      return res.status(404).json({ message: 'Media no encontrada' });
    }

    // Eliminar imagen de Cloudinary
    if (deletedMedia.cloudinary_id) {
      try {
        await cloudinary.uploader.destroy(deletedMedia.cloudinary_id);
        console.log('Imagen eliminada de Cloudinary');
      } catch (cloudinaryError) {
        console.error('❌ Error eliminando imagen de Cloudinary:', cloudinaryError);
      }
    }

    res.json({ message: 'Media eliminada correctamente' });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export {
  test,
  createMedia,
  getAllMedia,
  getOneMedia,
  updateMedia,
  deleteMedia,
};