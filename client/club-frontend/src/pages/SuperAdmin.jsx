import { useContext } from "react"
import { ContextUser } from "../../context/contextUser" 
import '../App.css'
//import { set } from "mongoose";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import './SuperAdmin.css';

export default function SuperAdmin() {
  
  const {user} = useContext(ContextUser)
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //edit dialog 
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", userType: "" });

  //edit funcionalidad
  const openEditDialog = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name, userType: user.userType });
  };

  const closeEditDialog = () => {
    setEditUser(null);
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
 const handleEditSave = async () => {
    if (!editUser) return;
    try {
      const response = await axios.put(`/superadmin/users/${editUser._id}`, editForm, { withCredentials: true });
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === editUser._id ? response.data : u))
      );
      closeEditDialog();
    } catch (err) {
      alert(
        `Error editando al usuario: ${err.response?.data?.error || err.message}`
      );
    }
  };

  //fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get('http://localhost:8000/superadmin/users', { withCredentials: true });
        console.log('superadmin users response:', data); 
      const usersArray = Array.isArray(data) ? data : (data?.users ?? []);
      setUsers(usersArray);
      } catch (err) {
              console.error(err);
      setError(err.message || 'Error');
      toast.error('Error al cargar los usuarios');
      }
      finally {
        setLoading(false);
      }
  };
  fetchUsers();
  }, []); 

  //delete funcionalidad
const handleDelete = async (id) => {
    if (!window.confirm("Estas seguro de eliminar este usuario?")) return;
    try {
      await axios.delete(`/superadmin/users/${id}`, { withCredentials: true });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (err) {
      alert(
        `Error eliminando al usuario: ${err.response?.data?.error || err.message}`
      );
    }
  };

    // si está cargando
  if (user === undefined) return null;

  // no autenticado o sin permiso
  if (!user || user.userType !== 'superadmin') return <Navigate to="/" replace />;

  return (
    <div className='main-content mb-5'>
      <div className="userslist">
        <h1>Administración de usuarios</h1>
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : error ? ( 
          <p>Error cargando usuarios: {error}</p>
        ) : (
          <table className="table">
            <thead> 
              <tr>
                <th>Nombre</th>
                <th>Email</th>  
                <th>Tipo de usuario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.userType}</td>
                  <td>
                    <button onClick={() => openEditDialog(user)}>Editar</button>
                    {user.userType !== 'superadmin' && (
                      <button onClick={() => handleDelete(user._id)}>Eliminar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
          {editUser && ( 
            <>
            <div className="dialog-backdrop" onClick={closeEditDialog} />
            <div className="dialog">
              <h2>Editar usuario</h2>
              <label>Nombre:</label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditFormChange}
              />
              {editUser.userType !== 'superadmin' && (
              <>              
              <label>Tipo de usuario:</label>
              <select
                name="userType"
                value={editForm.userType}
                onChange={handleEditFormChange}
              >
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
              </select> 
              </>
              )}

              <div className="dialog-actions">
                <button onClick={handleEditSave}>Guardar</button>
                <button onClick={closeEditDialog}>Cancelar</button>
              </div>
            </div>
            </>
          )}
        </div>
        </div>
      )
}
 