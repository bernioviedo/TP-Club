import './Footer.css'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
  <footer className="footer"> 
    <section className="social-icons-section">
      <h4>Nuestras redes</h4>
      <nav className='social-list'>
        <ul className='social-options'>
          <li>
            <Link to="https://www.instagram.com/" className="social-link">
              <img src="..\src\assets\ig.webp" alt="Instagram" />
            </Link>
          </li>
          <li>
            <Link to="https://www.facebook.com/" className="social-link">
              <img src="..\src\assets\fb.webp" alt="Facebook" />
            </Link>
          </li>
          <li>
            <Link to="https://x.com/" className="social-link">
              <img src="..\src\assets\twitter.webp" alt="Email" />
            </Link>
          </li>
        </ul>
      </nav>
    </section>
    <section className="footer-menu-section">
      <nav className='footer-menu'>
        <ul className="footer-menu-sections">
          <li><Link to='/faqs' className='m-opt'>FAQs</Link></li>
          <li><Link to='/' className='m-opt'>Soporte</Link></li>
          <li><Link to='/' className='m-opt'>Contacto</Link></li>
          <li><Link to='/' className='m-opt'>Nosotros</Link></li>
        </ul>
      </nav>
    </section>
    <section className="footer-direction">
      <h4>© Club Atlético La Gacela</h4>
      <p className='direction'>📍 OROÑO 2000, Rosario, Santafe</p>
    </section>
  </footer>
  )
}
