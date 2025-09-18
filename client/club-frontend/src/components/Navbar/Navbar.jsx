import {Link, useNavigate} from 'react-router-dom'
import './Navbar.css'
import { useContext } from 'react'
import { ContextUser } from '../../../context/contextUser';

export default function Navbar() {

  const navigate = useNavigate();
  const { user, setUser } = useContext(ContextUser);
  // manejo logout
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/logout', {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(null);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  //navegación
  const handleHome = () => navigate('/');
  const handleRegister = () => navigate('/register');
  const handleLogin = () => navigate('/login');
  const handleProfile = () => navigate('/profile');

  return (
  <header className='header'>
    <a href="/" className='logo'>Club Atlético La Gacela</a>
    <nav className='navbar'>
      <button onClick={handleHome}>Futbol</button>
      <button onClick={handleHome}>Socio</button>
      <button onClick={handleHome}>Noticia</button>
      <button onClick={handleHome}>Media</button>
    {     !user &&(
      <>
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      </>
      )
      }      
    {    user &&(   
      <>  
      <button onClick={handleProfile}>Profile</button>
      <button onClick={handleLogout}>Logout</button>
      </>
      )
      } 
    </nav>
  </header>
  )
}
