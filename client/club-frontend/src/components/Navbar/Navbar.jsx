import {Link, useNavigate} from 'react-router-dom'
import './Navbar.css'
import { useContext, useState } from 'react'
import { ContextUser } from '../../../context/contextUser';
import {motion as Motion, useScroll, useMotionValueEvent} from 'framer-motion';

export default function Navbar() {

  const navigate = useNavigate();
  const { user, setUser } = useContext(ContextUser);

  console.log('Navbar user:', user);
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
  const handleMedia = () => navigate('/media');
  const handleSuperAdmin = () => navigate('/superadmin');

  const { scrollY } = useScroll();

  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 75) {
      setHidden(true);
    } else {
      setHidden(false);
    }
     })

  return (
    <>
    <Motion.nav className='navbar' 
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -50, opacity: 0 }, 
      }}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      >
    <div className=' spikes-shadow'></div>
    <div className=' spikes '></div>
    <header className='header'>

       <div className='left-section'>
      <div className='escudo'>
        <a href="#" className="Escudo">
          <img src="../src/assets/LaGacelaFC.png" alt="La Gacela FC" />
        </a>
      </div>
      <a href="/" className='logo'>Club Atlético La Gacela</a>
    </div>
    { (!user || user.userType === 'user' || user.userType === 'admin') &&(
      <>
      <button onClick={handleHome}>Futbol</button>
      <button onClick={handleHome}>Socios</button>
      <button onClick={handleHome}>Noticias</button>
      <button onClick={handleMedia}>Media</button>
      </>
      )
      }
    {     !user &&(
      <>
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      </>
      )
    }      
    {    user &&(   
      <>  
      {(user.userType === 'user' || user.userType === 'admin') &&<button onClick={handleProfile}>Profile</button>}
      {user.userType === 'superadmin' && <button onClick={handleSuperAdmin}>Gestión de Administración</button>}
      <button onClick={handleLogout}>Logout</button>
      </>
      )
    }
  </header>
  </Motion.nav>
  </>
  )
}
