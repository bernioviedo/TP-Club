import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
<footer class="footer"> 
  <h4>Nuestras redes</h4>
    <div class="social-icons">
      <a href="#" class="social-link">
        <img src="..\src\assets\ig.webp" alt="Instagram" />
      </a>
      <a href="#" class="social-link">
        <img src="..\src\assets\fb.webp" alt="Facebook" />
      </a>
      <a href="#" class="social-link">
        <img src="..\src\assets\mail.png" alt="Email" />
      </a>
    </div>
    <div class="footer-menu">
      <div class=" footer-menu-title">
        <h4>MENU</h4>
          <div class="footer-menu-sections">
            <a href="#futbol">Futbol</a>
            <a href="#socio">Socio</a>
            <a href="#noticia">Noticias</a>
            <a href="#media">Media</a>
          </div>
      </div>
    </div>
    <div class="footer-direccion">
      <h4>Nuestra direccion</h4>
      <div class="direccion">
        <p>📍 OROÑO 2000, Rosario, Santafe</p>
      </div>
    </div>
  </footer>
  )
}
