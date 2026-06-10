import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ContextUser } from '../../context/contextUser';
import './Cuotas.css';

export default function Cuotas() {
  const { user } = useContext(ContextUser);
  const [cuotas, setCuotas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cuotasAPagar, setCuotasAPagar] = useState([]); // Guarda los IDs de las cuotas a abonar
  
  // ⚙️ NUEVO: Estado para el formulario de generación del Admin
  const [formGenerar, setFormGenerar] = useState({
    mes: '',
    anio: '',
    monto: ''
  });

  // Estado para el formulario de la tarjeta
  const [tarjeta, setTarjeta] = useState({
    numero: '',
    nombre: '',
    vencimiento: '',
    cvc: ''
  });

  const isAdmin = user?.userType === 'admin';
  const isSocio = user?.userType === 'socio';

  // Cargar cuotas de la API
  const fetchCuotas = async () => {
    try {
      const { data } = await axios.get('/cuotas');
      setCuotas(data);
    } catch (err) {
      console.error(err);
      toast.error('No se pudieron cargar las cuotas');
    }
  };

  useEffect(() => {
    if (user) fetchCuotas();
  }, [user]);

  // Filtrar cuotas pendientes del socio
  const cuotasPendientes = cuotas.filter(c => c.estado === 'pendiente');

  // ⚙️ NUEVO: Función para que el Admin envíe la generación al Backend
  const handleGenerarCuotas = async (e) => {
    e.preventDefault();
    if (!formGenerar.mes || !formGenerar.anio || !formGenerar.monto) {
      return toast.error('Por favor, completa todos los campos del período');
    }

    try {
      await axios.post('/cuotas/generar', formGenerar);
      toast.success('¡Cuotas del mes generadas correctamente!');
      setFormGenerar({ mes: '', anio: '', monto: '' }); // Limpiar formulario de creación
      fetchCuotas(); // Recargar la tabla para ver las nuevas cuotas
    } catch (err) {
      console.error(err);
      toast.error('Ocurrió un error al generar las cuotas');
    }
  };

  // Abrir modal para una sola cuota
  const abrirModalIndividual = (id) => {
    setCuotasAPagar([id]);
    setIsModalOpen(true);
  };

  // Abrir modal para todas las cuotas pendientes
  const abrirModalTodas = () => {
    const ids = cuotasPendientes.map(c => c._id);
    setCuotasAPagar(ids);
    setIsModalOpen(true);
  };

  // Manejar cambios en el formulario de la tarjeta
  const handleChangeTarjeta = (e) => {
    const { name, value } = e.target;
    
    if (name === 'numero' || name === 'cvc') {
      const soloNumeros = value.replace(/\D/g, '');
      setTarjeta({ ...tarjeta, [name]: soloNumeros });
    } else if (name === 'vencimiento') {
      const formatoFecha = value.replace(/[^0-9/]/g, '');
      setTarjeta({ ...tarjeta, [name]: formatoFecha });
    } else {
      setTarjeta({ ...tarjeta, [name]: value });
    }
  };

  // Enviar el pago simulado al backend
  const handleProcesarPago = async (e) => {
    e.preventDefault();

    if (!tarjeta.numero || !tarjeta.nombre || !tarjeta.vencimiento || !tarjeta.cvc) {
      return toast.error('Por favor, completa todos los datos de la tarjeta');
    }

    if (!/^\d{15,16}$/.test(tarjeta.numero)) {
      return toast.error('El número de tarjeta debe tener exactamente 15 o 16 dígitos');
    }

    if (!/^\d{3,4}$/.test(tarjeta.cvc)) {
      return toast.error('El código CVC debe tener 3 o 4 dígitos');
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(tarjeta.vencimiento)) {
      return toast.error('El formato de vencimiento debe ser MM/AA (Ej: 07/28)');
    }

    const [mesVencimiento, anioVencimiento] = tarjeta.vencimiento.split('/').map(Number);
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const anioActualCorto = Number(fechaActual.getFullYear().toString().slice(-2));

    if (anioVencimiento < anioActualCorto) {
      return toast.error('La tarjeta ingresada está vencida');
    }

    if (anioVencimiento === anioActualCorto && mesVencimiento < mesActual) {
      return toast.error('La tarjeta venció en un mes anterior de este año');
    }

    try {
      const promesasPagos = cuotasAPagar.map(id => 
        axios.put(`/cuotas/pagar/${id}`, { metodo_pago: 'tarjeta' })
      );

      await Promise.all(promesasPagos);
      
      toast.success(cuotasAPagar.length > 1 ? '¡Todas las cuotas pagadas con éxito!' : '¡Cuota pagada con éxito!');
      setIsModalOpen(false);
      setTarjeta({ numero: '', nombre: '', vencimiento: '', cvc: '' });
      fetchCuotas();
    } catch (err) {
      console.error(err);
      toast.error('Ocurrió un error al procesar el pago');
    }
  };

  return (
    <div className="cuotas-container">
      <h1>{isAdmin ? 'Gestión de Cuotas - Club Atlético La Gacela' : 'Estado de Cuotas'}</h1>

      {/* ⚙️ PANEL DE ADMIN RESTAURADO: Solo visible para administradores */}
      {isAdmin && (
        <div className="admin-box" style={{ background: '#222', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #d4af37' }}>
          <h2 style={{ color: '#d4af37', marginTop: 0, fontSize: '18px' }}>Generar Cuotas del Mes</h2>
          <form onSubmit={handleGenerarCuotas} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input 
              type="number" placeholder="Mes (1-12)" min="1" max="12"
              value={formGenerar.mes} 
              onChange={e => setFormGenerar({...formGenerar, mes: e.target.value})} 
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#333', color: '#fff', flex: 1 }}
              required 
            />
            <input 
              type="number" placeholder="Año (Ej: 2026)" min="2026"
              value={formGenerar.anio} 
              onChange={e => setFormGenerar({...formGenerar, anio: e.target.value})} 
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#333', color: '#fff', flex: 1 }}
              required 
            />
            <input 
              type="number" placeholder="Monto ($)" min="1"
              value={formGenerar.monto} 
              onChange={e => setFormGenerar({...formGenerar, monto: e.target.value})} 
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#333', color: '#fff', flex: 1 }}
              required 
            />
            <button type="submit" className="btn-confirmar-pago" style={{ marginTop: 0, height: '41px' }}>
              Generar Cuotas
            </button>
          </form>
        </div>
      )}

      {isSocio && cuotasPendientes.length > 1 && (
        <button className="btn-pagar-todas" onClick={abrirModalTodas}>
          Pagar Todas las Cuotas Pendientes (${cuotasPendientes.reduce((acc, c) => acc + c.monto, 0)})
        </button>
      )}

      <div className="cuotas-list">
        {cuotas.length === 0 ? (
          <p>No hay cuotas registradas en este período.</p>
        ) : (
          <table className="cuotas-table">
            <thead>
              <tr>
                {isAdmin && <th>Socio</th>}
                <th>Período</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((cuota) => (
                <tr key={cuota._id}>
                  {isAdmin && <td>{cuota.socio?.name || 'Socio Desconocido'}</td>}
                  <td>{cuota.mes}/{cuota.anio}</td>
                  <td>${cuota.monto}</td>
                  <td>
                    <span className={`badge ${cuota.estado}`}>
                      {cuota.estado.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {cuota.estado === 'pendiente' && isSocio && (
                      <button className="btn-pagar-individual" onClick={() => abrirModalIndividual(cuota._id)}>
                        Pagar
                      </button>
                    )}
                    {cuota.estado === 'pagado' && (
                      <span className="txt-pagado">Pagado el {new Date(cuota.fecha_pago).toLocaleDateString()}</span>
                    )}
                    {isAdmin && cuota.estado === 'pendiente' && (
                      <span className="txt-espera">Esperando pago</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Formulario de Pago Seguro</h2>
            <p className="modal-subtitle">Estás por pagar {cuotasAPagar.length} cuota(s)</p>
            
            <form onSubmit={handleProcesarPago} className="tarjeta-form">
              <div className="form-group">
                <label>Número de Tarjeta</label>
                <input 
                  type="text" name="numero" placeholder="4540123456789101" 
                  maxLength="16" value={tarjeta.numero} onChange={handleChangeTarjeta} required 
                />
              </div>

              <div className="form-group">
                <label>Nombre del Titular</label>
                <input 
                  type="text" name="nombre" placeholder="JUAN PEREZ" 
                  value={tarjeta.nombre} onChange={handleChangeTarjeta} required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Vencimiento</label>
                  <input 
                    type="text" name="vencimiento" placeholder="MM/AA" 
                    maxLength="5" value={tarjeta.vencimiento} onChange={handleChangeTarjeta} required 
                  />
                </div>
                <div className="form-group">
                  <label>CVC / Cód. Seguridad</label>
                  <input 
                    type="password" name="cvc" placeholder="123" 
                    maxLength="4" value={tarjeta.cvc} onChange={handleChangeTarjeta} required 
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirmar-pago">
                  Confirmar y Pagar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}