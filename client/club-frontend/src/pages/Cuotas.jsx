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
    setTarjeta({ ...tarjeta, [e.target.name]: e.target.value });
  };

  // Enviar el pago simulado al backend
  const handleProcesarPago = async (e) => {
    e.preventDefault();

    // Validacion de tarjeta
    if (!tarjeta.numero || !tarjeta.nombre || !tarjeta.vencimiento || !tarjeta.cvc) {
      return toast.error('Por favor, completa todos los datos de la tarjeta');
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
      <h1>Estado de Cuotas</h1>

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
                  {isAdmin && <td>{cuota.socio?.name}</td>}
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
                  type="text" name="numero" placeholder="4540 1234 5678 9101" 
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
                    maxLength="3" value={tarjeta.cvc} onChange={handleChangeTarjeta} required 
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