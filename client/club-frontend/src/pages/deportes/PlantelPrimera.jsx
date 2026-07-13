import '../../App.css';
import FutbolistaCard from '../../components/FutbolistaCard/FutbolistaCard.jsx';
import imgAaronson from './Brenden-Aaronson.png';
import imgPerri from './Lucas-Perri.png';

export default function PlantelPrimera() {
  // cambiar y sacar datos de db despues
  const plantel = [
    { id: 1, nombre: "Brenden Aaronson", posicion: "Mediocampista", imagen: imgAaronson },
    { id: 2, nombre: "Lucas Perri", posicion: "Arquero", imagen: imgPerri },
  ];

  return (
    <div className='main-content'>
      <h1>Plantel de Fútbol</h1>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '20px' }}>
        {plantel.map(jugador => (
          <FutbolistaCard 
            key={jugador.id}
            nombre={jugador.nombre}
            posicion={jugador.posicion}
            imagen={jugador.imagen}
          />
        ))}
      </div>
    </div>
  )
}