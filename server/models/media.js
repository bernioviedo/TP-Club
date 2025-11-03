import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const mediaSchema = new Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  url_imagen: { type: String, required: true },
  cloudinary_id: { type: String, required: true }, 
  fecha_creacion: { type: Date, default: Date.now },
  autor: { type: String, required: true }
});

const MediaModel = model('Media', mediaSchema);

export default MediaModel;