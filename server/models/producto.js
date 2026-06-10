import { Schema, model } from 'mongoose';

const productoSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  imagen: { type: String, required: true }, // Aquí se guardará la URL que nos devuelve Cloudinary
  
  // CAMBIO CLAVE: Estructura de stock discriminada por variantes de talle
  stock: {
    S: { type: Number, required: true, default: 0 },
    M: { type: Number, required: true, default: 0 },
    L: { type: Number, required: true, default: 0 },
    XL: { type: Number, required: true, default: 0 }
  }
}, { timestamps: true });

export default model('Producto', productoSchema);