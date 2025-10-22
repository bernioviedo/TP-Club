import { Link } from 'react-router-dom'
import './Navbar.css'
import { useContext } from 'react'
import { ContextUser } from '../../../context/contextUser'



export default function Navbar({navStyle, ulStyle, children}) {
  const { user, setUser } = useContext(ContextUser);

  console.log('Navbar user:', user)
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
        {(!user || user.userType === 'user' || user.userType === 'admin') && (
        <>
        <li><Link to={'/'}>{'Futbol'}</Link></li>
        <li><Link to={'/'}>{'Socios'}</Link></li>
        <li><Link to={'/news'}>{'Noticias'}</Link></li>
        <li><Link to={'/media'}>{'Media'}</Link></li>
        </>
        )}
        {     !user && (
          <>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
          </>
        )} 
        { user &&( 
          <>
          {(user.userType === 'user' || user.userType === 'admin') &&<li><Link to="/profile">Profile</Link></li>}
          {user.userType === 'admin' && <li><Link to="/superadmin">Gestión de Administración</Link></li>}
          <li><button onClick={handleLogout}>Logout</button></li>
          </>
        )} 
      </ul>
      {children}
    </nav>
  )
}
