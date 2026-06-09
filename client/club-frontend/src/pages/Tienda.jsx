import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Edit2, Save, X, ShoppingCart } from 'lucide-react';
import { ContextUser } from '../../context/contextUser';
import { useCart } from '../../context/CartContext';
import './Tienda.css';

export default function Tienda() {
  const context = useContext(ContextUser);
  const user = context?.user || null;
  const isAdmin = user?.userType === 'admin';

  const { addToCart, cart, removeFromCart, totalPrice, clearCart } = useCart();
  
  const [productos, setProductos] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Estado para saber qué talle seleccionó el usuario común en cada tarjeta
  const [tallesSeleccionados, setTallesSeleccionados] = useState({});

  // Estados para la edición en línea de un producto existente (Admin)
  const [editingId, setEditingId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editStockS, setEditStockS] = useState(0);
  const [editStockM, setEditStockM] = useState(0);
  const [editStockL, setEditStockL] = useState(0);
  const [editStockXL, setEditStockXL] = useState(0);

  // Estado para el formulario de nuevo producto (Admin)
  const [formProducto, setFormProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: null,
    stockS: 0,
    stockM: 0,
    stockL: 0,
    stockXL: 0
  });

  // Cargar productos del catálogo
  const fetchProductos = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/productos');
      setProductos(data);
    } catch (err) {
      toast.error('No se pudo cargar el catálogo de mercadería');
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // ➕ GUARDAR NUEVO PRODUCTO (ADMIN)
  const handleCrearProducto = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    if (!formProducto.nombre || !formProducto.descripcion || !formProducto.precio || !formProducto.imagen) {
      return toast.error('Por favor, completa los campos principales e imagen');
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('nombre', formProducto.nombre);
    formData.append('descripcion', formProducto.descripcion);
    formData.append('precio', formProducto.precio);
    formData.append('imagen', formProducto.imagen); 
    formData.append('stockS', formProducto.stockS || 0);
    formData.append('stockM', formProducto.stockM || 0);
    formData.append('stockL', formProducto.stockL || 0);
    formData.append('stockXL', formProducto.stockXL || 0);

    try {
      await axios.post('http://localhost:8000/productos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      toast.success('¡Producto agregado correctamente!');
      setFormProducto({ nombre: '', descripcion: '', precio: '', imagen: null, stockS: 0, stockM: 0, stockL: 0, stockXL: 0 });
      setIsAddingProduct(false);
      fetchProductos();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar el producto');
    } finally {
      setIsUploading(false);
    }
  };

  // 📝 ACTIVAR MODO EDICIÓN EN LA TARJETA (ADMIN)
  const startEdit = (prod) => {
    if (!isAdmin) return;
    setEditingId(prod._id);
    setEditNombre(prod.nombre);
    setEditDescripcion(prod.descripcion);
    setEditPrecio(prod.precio);
    setEditStockS(prod.stock?.S || 0);
    setEditStockM(prod.stock?.M || 0);
    setEditStockL(prod.stock?.L || 0);
    setEditStockXL(prod.stock?.XL || 0);
  };

  // 💾 GUARDAR EDICIÓN (ADMIN)
  const saveEdit = async (id) => {
    if (!isAdmin) return;
    
    const formData = new FormData();
    formData.append('nombre', editNombre);
    formData.append('descripcion', editDescripcion);
    formData.append('precio', editPrecio);
    formData.append('stockS', editStockS);
    formData.append('stockM', editStockM);
    formData.append('stockL', editStockL);
    formData.append('stockXL', editStockXL);

    try {
      await axios.put(`http://localhost:8000/productos/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      setEditingId(null);
      toast.success('¡Producto actualizado con éxito!');
      fetchProductos();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Error al guardar los cambios');
    }
  };

  // 🗑️ ELIMINAR PRODUCTO (ADMIN)
  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm('¿Estás seguro de eliminar este producto del catálogo?')) return;

    try {
      await axios.delete(`http://localhost:8000/productos/${id}`, {
        withCredentials: true
      });
      toast.success('Producto eliminado correctamente');
      fetchProductos();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al eliminar el producto');
    }
  };

  // 🛒 ENVIAR COMPRA REAL Y RESTAR STOCK
  const handleFinalizarCompra = async () => {
    if (cart.length === 0) return;
    try {
      const pedido = cart.map(item => ({
        _id: item._id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        talleSeleccionado: item.talleElegido 
      }));

      // 🔔 CLAVE: Le agregamos withCredentials para que viaje la cookie de sesión
      await axios.post('http://localhost:8000/productos/comprar', { carrito: pedido }, {
        withCredentials: true
      });
      
      toast.success('¡Compra realizada con éxito! Stock descontado.');
      clearCart();
      setIsCartOpen(false);
      fetchProductos(); 
    } catch (err) {
      console.error('Error al enviar la compra:', err);
      toast.error(err.response?.data?.error || 'Error al procesar la compra');
    }
  };

  // Sumador de unidades totales por tarjeta
  const calcularStockTotal = (stockObj) => {
    return (stockObj?.S || 0) + (stockObj?.M || 0) + (stockObj?.L || 0) + (stockObj?.XL || 0);
  };

  if (context === undefined) {
    return <div className="loading-state">Cargando sesión...</div>;
  }

  return (
    <div className="tienda-container">
      <div className="tienda-header">
        <div>
          <h1>Tienda Oficial</h1>
          <p className="tienda-subtitle">Indumentaria y accesorios de C.A. La Gacela</p>
        </div>
        <button className="btn-ver-carrito" onClick={() => setIsCartOpen(!isCartOpen)}>
          <ShoppingCart size={18} /> Mi Carrito ({cart.reduce((acc, item) => acc + item.cantidad, 0)})
        </button>
      </div>

      {isAdmin && !isAddingProduct && (
        <button onClick={() => setIsAddingProduct(true)} className="btn-add-toggle">
          <Plus size={18} /> Agregar Nuevo Producto
        </button>
      )}

      {/* PANEL DE CARGA DE PRODUCTOS (ADMIN) */}
      {isAdmin && isAddingProduct && (
        <div className="tienda-admin-box">
          <h2>Panel: Cargar Producto con Talles</h2>
          <form onSubmit={handleCrearProducto} className="tienda-admin-form">
            <input type="text" placeholder="Nombre (ej: Camiseta Titular)" onChange={e => setFormProducto({...formProducto, nombre: e.target.value})} required />
            <input type="text" placeholder="Descripción" onChange={e => setFormProducto({...formProducto, descripcion: e.target.value})} required />
            <input type="number" placeholder="Precio ($)" onChange={e => setFormProducto({...formProducto, precio: e.target.value})} required />
            <input type="file" accept="image/*" onChange={e => setFormProducto({...formProducto, imagen: e.target.files[0]})} required />
            
            <div className="stock-talles-inputs">
              <h3>Definir Unidades por Talle:</h3>
              <label>Talle S: <input type="number" min="0" value={formProducto.stockS} onChange={e => setFormProducto({...formProducto, stockS: parseInt(e.target.value) || 0})} /></label>
              <label>Talle M: <input type="number" min="0" value={formProducto.stockM} onChange={e => setFormProducto({...formProducto, stockM: parseInt(e.target.value) || 0})} /></label>
              <label>Talle L: <input type="number" min="0" value={formProducto.stockL} onChange={e => setFormProducto({...formProducto, stockL: parseInt(e.target.value) || 0})} /></label>
              <label>Talle XL: <input type="number" min="0" value={formProducto.stockXL} onChange={e => setFormProducto({...formProducto, stockXL: parseInt(e.target.value) || 0})} /></label>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-save" disabled={isUploading}>{isUploading ? 'Subiendo...' : 'Guardar'}</button>
              <button type="button" onClick={() => setIsAddingProduct(false)} className="btn-cancel">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="tienda-layout">
        {/* GRILLA DE ARTÍCULOS */}
        <div className="productos-grid">
          {productos.map((prod) => {
            const stockTotal = calcularStockTotal(prod.stock);
            const talleElegido = tallesSeleccionados[prod._id];

            return (
              <div key={prod._id} className="producto-card">
                <div className="producto-image-wrapper">
                  <img src={prod.imagen} alt={prod.nombre} className="producto-img" />
                  
                  {isAdmin && editingId !== prod._id && (
                    <div className="producto-overlay">
                      <button onClick={() => startEdit(prod)} className="btn-icon">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(prod._id)} className="btn-icon delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="producto-info">
                  {isAdmin && editingId === prod._id ? (
                    /* PANEL INTERNO DE EDICIÓN RÁPIDA (ADMIN) */
                    <div className="producto-edit-form">
                      <input type="text" value={editNombre} onChange={e => setEditNombre(e.target.value)} placeholder="Nombre" />
                      <input type="text" value={editDescripcion} onChange={e => setEditDescripcion(e.target.value)} placeholder="Descripción" />
                      <input type="number" value={editPrecio} onChange={e => setEditPrecio(e.target.value)} placeholder="Precio" />
                      
                      <div className="edit-talles-grid">
                        <label>S: <input type="number" value={editStockS} onChange={e => setEditStockS(parseInt(e.target.value) || 0)} /></label>
                        <label>M: <input type="number" value={editStockM} onChange={e => setEditStockM(parseInt(e.target.value) || 0)} /></label>
                        <label>L: <input type="number" value={editStockL} onChange={e => setEditStockL(parseInt(e.target.value) || 0)} /></label>
                        <label>XL: <input type="number" value={editStockXL} onChange={e => setEditStockXL(parseInt(e.target.value) || 0)} /></label>
                      </div>

                      <div className="edit-form-buttons">
                        <button onClick={() => saveEdit(prod._id)} className="btn-small-save"><Save size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="btn-small-cancel"><X size={14} /></button>
                      </div>
                    </div>
                  ) : (
                    /* VISTA PÚBLICA NORMAL */
                    <>
                      <h3>{prod.nombre}</h3>
                      <p>{prod.descripcion}</p>
                      
                      <div className="selector-talles">
                        <h4>Seleccionar Talle:</h4>
                        <div className="talles-row">
                          {['S', 'M', 'L', 'XL'].map((talle) => {
                            const stockTalle = prod.stock?.[talle] || 0;
                            const sinStock = stockTalle <= 0;

                            return (
                              <button
                                key={talle}
                                type="button"
                                disabled={sinStock}
                                className={`btn-talle ${talleElegido === talle ? 'activo' : ''} ${sinStock ? 'sin-stock' : ''}`}
                                onClick={() => setTallesSeleccionados({ ...tallesSeleccionados, [prod._id]: talle })}
                              >
                                {talle} ({stockTalle})
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="producto-meta">
                        <span className="producto-precio">${prod.precio}</span>
                      </div>

                      <button 
                        className={`btn-add-cart ${stockTotal <= 0 || !talleElegido ? 'deshabilitado' : ''}`}
                        onClick={() => {
                          if (!talleElegido) return toast.error('Selecciona un talle primero');
                          
                          // Pasamos talleElegido y talleSeleccionado para que no haya desvíos de variables
                          addToCart({ 
                            ...prod, 
                            talleElegido: talleElegido,
                            talleSeleccionado: talleElegido 
                          }); 
                          toast.success(`${prod.nombre} (Talle ${talleElegido}) añadido`);
                        }}
                        disabled={stockTotal <= 0}
                      >
                        {stockTotal <= 0 ? 'Agotado' : talleElegido ? `Añadir Talle ${talleElegido}` : 'Elegí un Talle'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* SIDEBAR DEL CARRITO */}
        {isCartOpen && (
          <div className="carrito-sidebar">
            <h2>Tu Pedido</h2>
            {cart.length === 0 ? (
              <p className="cart-empty">El carrito está vacío.</p>
            ) : (
              <>
                <div className="cart-items-list">
                  {cart.map((item, idx) => (
                    <div key={idx} className="cart-item">
                      <img src={item.imagen} alt={item.nombre} className="cart-item-thumb" />
                      <div className="cart-item-details">
                        <h4>{item.nombre}</h4>
                        <p>Talle: <strong>{item.talleElegido}</strong></p>
                        <p>{item.cantidad} x ${item.precio}</p>
                      </div>
                      <button className="btn-remove-item" onClick={() => removeFromCart(item._id)}>❌</button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <h3>Total: ${totalPrice}</h3>
                  <button className="btn-checkout" onClick={handleFinalizarCompra}>
                    Confirmar Compra Real
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}