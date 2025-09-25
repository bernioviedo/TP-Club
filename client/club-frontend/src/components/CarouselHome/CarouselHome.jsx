import Carousel from 'react-bootstrap/Carousel'
import './Carousel.css'
function CarouselHome() {
  return (
    <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner ">
        <div className="carousel-item ci1 active">
          <div className="carousel-caption  carousel-text">
            <h5>First slide label</h5>
            <p>Some representative placeholder content for the first slide.</p>
          </div>
        </div>
        <div className="carousel-item ci2">
          <div className="carousel-caption carousel-text">
            <h5>Second slide label</h5>
            <p>Some representative placeholder content for the first slide.</p>
          </div>
        
        </div>
        <div className="carousel-item ci3">
          <div className="carousel-caption carousel-text">
            <h5>Thirst slide label</h5>
            <p>Some representative placeholder content for the first slide.</p>
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