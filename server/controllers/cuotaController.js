import Cuota from '../models/cuota.js';
import User from '../models/users.js';
import pkg from 'jsonwebtoken';
const { verify } = pkg;

// =========================================================================
// 1. OBTENER CUOTAS (Socio ve las suyas, Admin ve todas)
// =========================================================================
export const getCuotas = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'No autorizado: Inicie sesión' });

    verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Token inválido o expirado' });

      let query = {};

      if (decoded.userType === 'admin') {
        query = {}; 
      } else if (decoded.userType === 'socio') {
        query.socio = decoded.id; 
      } else {
        return res.status(403).json({ error: 'Acceso denegado: Sección exclusiva para socios activos' });
      }

      const cuotas = await Cuota.find(query)
        .populate('socio', 'name email')
        .sort({ anio: -1, mes: -1 });

      return res.json(cuotas);
    });

  } catch (error) {
    console.error('❌ Error al obtener cuotas:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// =========================================================================
// 2. GENERAR CUOTAS MENSUALES (Solo Administradores)
// =========================================================================
export const generarCuotasMensuales = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Token inválido' });

      if (decoded.userType !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado: Operación exclusiva de administradores' });
      }

      const { mes, anio, monto } = req.body;
      const socios = await User.find({ userType: 'socio' }); 

      const promesasCuotas = socios.map(socio => {
        return Cuota.create({
          socio: socio._id,
          mes: Number(mes),
          anio: Number(anio),
          monto: Number(monto),
          estado: 'pendiente'
        }).catch(errorSchema => {
          if (errorSchema.code !== 11000) throw errorSchema; 
        });
      });

      await Promise.all(promesasCuotas);
      return res.status(201).json({ message: `Cuotas del período ${mes}/${anio} establecidas con éxito.` });
    });

  } catch (error) {
    console.error('❌ Error al generar cuotas:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// =========================================================================
// 3. REGISTRAR PAGO DE CUOTA (Socio paga la suya propia / Admin registra)
// =========================================================================
export const registrarPago = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Token inválido' });

      const { id } = req.params;
      const { metodo_pago } = req.body; // El frontend envía 'tarjeta'

      // 🔍 1. Buscar la cuota primero para validar a quién le pertenece
      const cuotaABuscar = await Cuota.findById(id);
      if (!cuotaABuscar) return res.status(404).json({ error: 'La cuota que intenta abonar no existe' });

      // 🔒 2. VALIDACIÓN DE SEGURIDAD EXTREMA:
      // Si el que quiere pagar NO es admin, obligatoriamente el id del token debe coincidir con el dueño de la cuota
      if (decoded.userType !== 'admin' && cuotaABuscar.socio.toString() !== decoded.id) {
        return res.status(403).json({ error: 'Acceso denegado: No puedes registrar el pago de otra persona' });
      }

      // 3. Modificar el estado de la cuota
      const cuotaActualizada = await Cuota.findByIdAndUpdate(
        id,
        {
          estado: 'pagado',
          fecha_pago: new Date(),
          metodo_pago: metodo_pago || 'tarjeta'
        },
        { new: true }
      ).populate('socio', 'name email');

      return res.json(cuotaActualizada);
    });

  } catch (error) {
    console.error('❌ Error al registrar pago:', error);
    res.status(500).json({ error: 'Server error' });
  }
};