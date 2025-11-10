import Carousel from 'react-bootstrap/Carousel'
import './Carousel.css'
function CarouselHome() {
  return (
    <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner ">
        <div className="carousel-item ci1 active">
          <div className="carousel-caption  carousel-text">
            <h5>LA GACELA FC</h5>
            <p>Un club hecho para vos</p>
          </div>
        </div>
        <div className="carousel-item ci2">
          <div className="carousel-caption carousel-text">
            <h5>UN LUGAR IDEAL PARA VOS</h5>
            <p>Donde podes practicar el deporte que mas te gusta</p>
          </div>
        
        </div>
        <div className="carousel-item ci3">
          <div className="carousel-caption carousel-text">
            <h5>ALCANZA LA GLORIA</h5>
            <p>Hacete socio, y alcanza la gloria con nosotros</p>
          </div>
        
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default CarouselHome;

//TODO: optimizar el renderizado de imagenes