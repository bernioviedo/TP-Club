import { Link } from 'react-router-dom'
import './Navbar.css'
import { useContext, useState } from 'react'
import { ContextUser } from '../../../context/contextUser'
import { useCart } from "../../../context/CartContext";

export default function Navbar({navStyle, ulStyle, children}) {
  const { user, setUser } = useContext(ContextUser);
const { totalItems } = useCart();

  const [isDeportesOpen, setIsDeportesOpen] = useState(false);

  // manejo logout
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/logout', {
        credentials: 'include'
      });
      
      const data = await response.json()
      
      if (data.success) {
        setUser(null)
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error en logout:', error)
    }
  }

  return (
    <nav className={navStyle}>
      <ul className={ulStyle}>
        {/* Enlaces públicos y para todos los roles */}
        {(!user || user.userType === 'user' || user.userType === 'admin' || user.userType === 'socio') && (
          <>
            {/* menú dropdown de deportes */}
            <li 
              className="navbar__dropdown"
              onMouseEnter={() => setIsDeportesOpen(true)}
              onMouseLeave={() => setIsDeportesOpen(false)}
            > 
            <Link to={'/'}>
              <span className="navbar__dropdown-toggle">Deportes</span>
              
              {isDeportesOpen && (
                <ul className="navbar__dropdown-menu">
                  <li><Link to={'/deportes/futbol'}>Fútbol</Link></li>
                  <li><Link to={'/deportes/voley'}>Vóley</Link></li>
                  <li><Link to={'/deportes/natacion'}>Natación</Link></li>
                  <li><Link to={'/deportes/tenis'}>Tenis</Link></li>
                  <li><Link to={'/deportes/basquet'}>Básquet</Link></li>
                  <li><Link to={'/deportes/handball'}>Handball</Link></li>
                </ul>
              )}
            </Link></li>

            <li><Link to={'/'}>{'Socios'}</Link></li>
            <li><Link to={'/news'}>{'Noticias'}</Link></li>
            <li><Link to={'/media'}>{'Media'}</Link></li>
          </>
        )}

        {/* 🛒 3. Enlace a la Tienda Oficial visible para todos, con el contador dinámico si hay ítems */}
        <li>
          <Link to={'/tienda'} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Tienda {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </li>

        {/* 💳 Gestión o Pago de Cuotas Inteligente */}
        {user && (user.userType === 'socio' || user.userType === 'admin') && (
          <li>
            <Link to="/cuotas" className="navbar__link-cuotas">
              {user.userType === 'admin' ? 'Gestión Cuotas' : 'Pagar Cuota'}
            </Link>
          </li>
        )}

        {/* Enlaces para invitados (No logueados) */}
        {!user && (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )} 

        {/* Enlaces de sesión activa */}
        {user && (
          <>
            {(user.userType === 'user' || user.userType === 'admin' || user.userType === 'socio') && (
              <li><Link to="/profile">Profile</Link></li>
            )}
            {user.userType === 'superadmin' && (
              <li><Link to="/superadmin">Gestión de Administración</Link></li>
            )}
            <li><Link to={"/"} onClick={handleLogout}>Logout</Link></li>
          </>
        )} 
      </ul>
      {children}
    </nav>
  )
}