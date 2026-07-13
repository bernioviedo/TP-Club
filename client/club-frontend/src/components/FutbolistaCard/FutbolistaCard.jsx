import { useState, useRef } from 'react';
import './FutbolistaCard.css';

export default function FutbolistaCard({ nombre, posicion, imagen }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [isActive, setIsActive] = useState(false);

  const handleInteraction = (e) => {
    if (!cardRef.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // obtengo dimensiones y posición de la carta
    const rect = cardRef.current.getBoundingClientRect();
    
    // calculo la posición relativa del mouse dentro de la carta
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;

    // calculo los grados de rotacion basados en la posición del mouse
    const rotateX = ((yPct - 50) / 50) * -15; // rotacion máxima de 15 grados en X
    const rotateY = ((xPct - 50) / 50) * 15;  // rotacion máxima de 15 grados en Y
    
    setIsActive(true);

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      '--x': `${xPct}%`,
      '--y': `${yPct}%`,
    });
  };

  const handleInteractionEnd = () => {
    setIsActive(false);
    // cuando el mouse sale de la carta, reseteo la transformacion y las variables CSS
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      '--x': '50%',
      '--y': '50%',
    });
  };

  return (
    <div 
  className={`holo-card ${isActive ? 'active' : ''}`} 
      ref={cardRef}
      onMouseMove={handleInteraction}
      onMouseLeave={handleInteractionEnd}
      onTouchMove={handleInteraction}
      onTouchStart={handleInteraction}
      onTouchEnd={handleInteractionEnd}
      style={style}
    >
      {/* contenido de la carta */}
      <div className="holo-card-content">
        <img src={imagen} alt={nombre} className="holo-card-img" />
        <div className="holo-card-info">
          <h3>{nombre}</h3>
          <p>{posicion}</p>
        </div>
      </div>
      
      {/* capas superpuestas para efectos */}
      <div className="holo-glare"></div>
      <div className="holo-foil"></div>
    </div>
  );
}