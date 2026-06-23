import '../deportes/Futbol.css'
import '../../App.css'
import { Link } from 'react-router-dom'

export default function Futbol() {
  return (
    <div className='main-content'>
        <h1>Futbol</h1>
        <Link to="/deportes/futbol/plantel" className="boton-plantel">
        Ver Plantel de Primera
        </Link>
    </div>
  )
}