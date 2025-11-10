import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const mediaSchema = new Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    url_imagen: { type: String, required: true },
    cloudinary_id: { type: String, required: true }, 
    fecha_creacion: { type: Date, default: Date.now },
    autor: { type: String, required: true },
    tipo: {
     type: String,
     required: [true, 'El tipo es obligatorio (carousel o gallery)'], // Mensaje de error
     enum: ['carousel', 'gallery'] // Solo permite estos dos valores
    }
});

const MediaModel = model('Media', mediaSchema);

export default MediaModel;