import Producto from '../models/Producto.js';
import { v2 as cloudinary } from 'cloudinary';

// 1️⃣ OBTENER TODOS LOS PRODUCTOS
export const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al traer productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// 2️⃣ CREAR UN NUEVO PRODUCTO CON STOCK POR TALLE
export const crearProducto = async (req, res) => {
  try {
    // Desestructuramos los campos del req.body que envía el FormData
    const { nombre, descripcion, precio, stockS, stockM, stockL, stockXL } = req.body;

    // Validamos que Multer haya interceptado el archivo binario en memoria
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'Por favor, selecciona una imagen válida para el producto.' });
    }

    // Subida directa del buffer a Cloudinary usando Streams de Node
    const subirACloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'tienda_club' }, 
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url); 
          }
        );
        stream.end(req.file.buffer);
      });
    };

    // Esperamos la URL final que nos devuelve la nube
    const imagenUrl = await subirACloudinary();

    // Creamos el documento en MongoDB parseando cada stock a número de forma segura
    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio: Number(precio),
      imagen: imagenUrl,
      stock: {
        S: Number(stockS || 0),
        M: Number(stockM || 0),
        L: Number(stockL || 0),
        XL: Number(stockXL || 0)
      }
    });

    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);

  } catch (error) {
    console.error('Error al crear producto con talle:', error);
    res.status(500).json({ error: 'Error interno en el servidor al guardar el producto' });
  }
};

// 3️⃣ PROCESAR LA COMPRA Y DESCONTAR STOCK DINÁMICAMENTE
// 🛒 PROCESAR LA COMPRA Y DESCONTAR STOCK (Versión flexible)
export const procesarCompra = async (req, res) => {
  try {
    const { carrito } = req.body; 

    if (!carrito || carrito.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    console.log('--- Nueva Petición de Compra Recibida ---');
    console.log('Contenido del carrito recibido:', carrito);

    for (const item of carrito) {
      const producto = await Producto.findById(item._id);
      
      if (!producto) {
        return res.status(404).json({ error: `El producto ${item.nombre} ya no existe en el catálogo.` });
      }

      // 🔔 CONTROL TOTAL: Buscamos el talle en cualquiera de las dos propiedades posibles
      const talle = item.talleSeleccionado || item.talleElegido; 
      const cantidad = Number(item.cantidad || 1);

      console.log(`Procesando Producto: ${item.nombre} | Talle detectado: ${talle} | Cantidad: ${cantidad}`);

      // Verificamos que tengamos un talle string limpio ('S', 'M', 'L', 'XL')
      if (!talle || producto.stock[talle] === undefined) {
        return res.status(400).json({ 
          error: `El talle "${talle}" para el producto ${producto.nombre} no es válido o llegó vacío.` 
        });
      }

      // Validamos si hay stock suficiente
      if (producto.stock[talle] < cantidad) {
        return res.status(400).json({ 
          error: `Stock insuficiente del talle ${talle} para ${producto.nombre}. Disponibles: ${producto.stock[talle]}` 
        });
      }

      // Descuento atómico en la base de datos
      await Producto.findByIdAndUpdate(item._id, {
        $inc: { [`stock.${talle}`]: -cantidad }
      });
    }

    res.status(200).json({ mensaje: '¡Compra procesada y stock actualizado con éxito!' });

  } catch (error) {
    console.error('Error crítico al procesar el descuento de stock:', error);
    res.status(500).json({ error: 'Error interno en el servidor al procesar la compra' });
  }
};

// 4️⃣ ELIMINAR UN PRODUCTO DEL CATÁLOGO
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoEliminado = await Producto.findByIdAndDelete(id);

    if (!productoEliminado) {
      return res.status(404).json({ error: 'El producto no existe o ya fue eliminado.' });
    }

    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno al intentar eliminar el producto' });
  }
};

// 5️⃣ EDITAR UN PRODUCTO EXISTENTE
export const editarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stockS, stockM, stockL, stockXL } = req.body;

    // Buscamos el producto primero
    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ error: 'El producto no existe.' });
    }

    // Si subieron una nueva imagen (req.file existe gracias a Multer), la procesamos
    let imagenUrl = producto.imagen; // Por defecto dejamos la que ya tenía
    if (req.file && req.file.buffer) {
      const subirACloudinary = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'tienda_club' }, 
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url); 
            }
          );
          stream.end(req.file.buffer);
        });
      };
      imagenUrl = await subirACloudinary();
    }

    // Actualizamos el documento con los nuevos datos estructurados
    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      {
        nombre,
        descripcion,
        precio: Number(precio),
        imagen: imagenUrl,
        stock: {
          S: Number(stockS !== undefined ? stockS : producto.stock.S),
          M: Number(stockM !== undefined ? stockM : producto.stock.M),
          L: Number(stockL !== undefined ? stockL : producto.stock.L),
          XL: Number(stockXL !== undefined ? stockXL : producto.stock.XL)
        }
      },
      { new: true } // Para que devuelva el producto ya modificado
    );

    res.status(200).json(productoActualizado);
  } catch (error) {
    console.error('Error al editar producto:', error);
    res.status(500).json({ error: 'Error interno al intentar editar el producto' });
  }
};