import { Link } from 'react-router-dom'
import './Navbar.css'
import { useContext, useState } from 'react'
import { ContextUser } from '../../../context/contextUser'
import {motion as Motion, useScroll, useMotionValueEvent} from 'framer-motion'
import options from '../../utilities/navOptions.js'
import { TfiMenu } from 'react-icons/tfi'
import  Mobile  from '../../utilities/breakPoints.js'
import MediaQuery from 'react-responsive'

export default function Navbar() {
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
    <Motion.header className='site-header' 
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
    

    <div className='navbar__logo-section'>
      <Link to="/" className='navbar__logo-lin'>
        <img 
          src="../src/assets/LaGacelaFC.png" 
          alt="La Gacela FC"
          className='navbar__escudo' />
      </Link>
      <Link to="/" className='navbar__site-title' id='navbar__site-title'>Club Atlético La Gacela</Link>
    </div>
    <MediaQuery maxWidth={768}>
      <button className='menu-btn'><TfiMenu></TfiMenu></button>
    </MediaQuery>
    <nav className='navbar'>
    <ul className='navbar__menu'>
      {options.map(opt  => {
        const { title, linkTo } = opt
        return(
          <li><Link to={linkTo}>{title}</Link></li>
        )
      })}
    </ul>
    <ul className='navbar__auth-menu'>
      {     !user ? (
      <>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
      </>
      ): ( 
      <>
      <li><Link to="/profile">Profile</Link></li>
      <li><button onClick={handleLogout}>Logout</button></li>
      </>
    )} 
    </ul>
      
  </nav>
  </Motion.header>
  </>
  )
}
