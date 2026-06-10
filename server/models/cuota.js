import mongoose from 'mongoose';

const CuotaSchema = new mongoose.Schema({
  socio: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mes: { type: Number, required: true, min: 1, max: 12 },
  anio: { type: Number, required: true },
  monto: { type: Number, required: true },
  estado: { type: String, enum: ['pendiente', 'pagado', 'vencido'], default: 'pendiente', required: true },
  fecha_pago: { type: Date },
  metodo_pago: { type: String, enum: ['efectivo', 'transferencia', 'tarjeta'], default: 'efectivo' }
}, { timestamps: true });

CuotaSchema.index({ socio: 1, mes: 1, anio: 1 }, { unique: true });

export default mongoose.model('Cuota', CuotaSchema);