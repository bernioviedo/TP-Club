import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { ContextUser } from '../../context/contextUser'; // Importar el contexto
import './Media.css';

const Media = () => {
  // Obtener el objeto de usuario del contexto
  const { user } = useContext(ContextUser);
  
  // Determinar si el usuario es administrador
  const isAdmin = user?.userType === 'admin';
  
  const [carouselImages, setCarouselImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');
  const [isAnimating, setIsAnimating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [isAddingCarousel, setIsAddingCarousel] = useState(false);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [newCaption, setNewCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

// Cargar imágenes desde el backend
  useEffect(() => {
    // La ruta de fetch es pública
    const fetchMedia = async () => {
      try {
        // Hacemos ambas peticiones en paralelo para más eficiencia
        const [carouselRes, galleryRes] = await Promise.all([
          axios.get('http://localhost:8000/media/carousel'), // Pide solo carrusel
          axios.get('http://localhost:8000/media/gallery')  // Pide solo galería
        ]);
        
        setCarouselImages(carouselRes.data);
        setGalleryImages(galleryRes.data);

      } catch (err) {
        console.error('Error al cargar imágenes:', err);
      }
    };

    fetchMedia();
  }, []);

  // Subir nueva imagen a Cloudinary
  const handleAddImage = async (isCarousel = false) => {
    if (!isAdmin) return; //  Comprobación de seguridad
    if (!newImage || !newCaption) {
      alert('Por favor completa todos los campos');
      return;
    }

  setIsUploading(true);

    const formData = new FormData();
    formData.append('imagen', newImage);
    formData.append('titulo', newCaption);
    formData.append('descripcion', newCaption);
    formData.append('autor', user._id); // Usamos el ID del usuario del contexto
    formData.append('tipo', isCarousel ? 'carousel' : 'gallery');
    
    try {
      const res = await axios.post('http://localhost:8000/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true // Envía la cookie de autenticación
      });

      if (isCarousel) {
        setCarouselImages(prev => [...prev, res.data]);
        setIsAddingCarousel(false);
      } else {
        setGalleryImages(prev => [...prev, res.data]);
        setIsAddingGallery(false);
      }

      setNewImage(null);
      setNewCaption('');
      alert('Imagen subida exitosamente');
    } catch (err) {
      console.error('Error al subir imagen:', err);
      alert(err.response?.data?.error || 'Error al subir la imagen. Verifica tu sesión de administrador.');
    } finally {
      setIsUploading(false);
    }
  };

  // Iniciar edición
  const startEdit = (id, currentCaption) => {
    if (!isAdmin) return; // Comprobación de seguridad
    setEditingId(id);
    setEditCaption(currentCaption || '');
  };

  // Guardar edición
  const saveEdit = async (id) => {
    if (!isAdmin) return; // Comprobación de seguridad
    try {
      const res = await axios.put(`http://localhost:8000/media/${id}`, { 
        titulo: editCaption,
        descripcion: editCaption 
      }, {
        withCredentials: true // Envía la cookie de autenticación
      });
      
      setCarouselImages(prev => prev.map(img => (img._id === id ? res.data : img)));
      setGalleryImages(prev => prev.map(img => (img._id === id ? res.data : img)));
      setEditingId(null);
      setEditCaption('');
    } catch (err) {
      console.error('Error al editar:', err);
      alert(err.response?.data?.error || 'Error al guardar los cambios. Verifica tu sesión de administrador.');
    }
  };

  // Eliminar de Cloudinary y MongoDB
  const handleDelete = async (id) => {
    if (!isAdmin) return; // Comprobación de seguridad
    if (!window.confirm('¿Estás seguro de eliminar esta imagen? Se eliminará de Cloudinary y la base de datos.')) return;

    try {
      await axios.delete(`http://localhost:8000/media/${id}`, {
        withCredentials: true // Envía la cookie de autenticación
      });
      
      setCarouselImages(prev => prev.filter(img => img._id !== id));
      setGalleryImages(prev => prev.filter(img => img._id !== id));
      
      // Ajustar índice del carrusel si quedaste fuera de rango
      if (currentSlide >= carouselImages.length - 1) {
        setCurrentSlide(0);
      }
      
      alert('Imagen eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert(err.response?.data?.error || 'Error al eliminar la imagen. Verifica tu sesión de administrador.');
    }
  };

  // Navegación del carrusel (sin cambios)
  const nextSlide = () => {
    if (isAnimating || carouselImages.length === 0) return;
    setIsAnimating(true);
    setSlideDirection('right');
    setCurrentSlide(prev => (prev + 1) % carouselImages.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating || carouselImages.length === 0) return;
    setIsAnimating(true);
    setSlideDirection('left');
    setCurrentSlide(prev => (prev - 1 + carouselImages.length) % carouselImages.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setSlideDirection(index > currentSlide ? 'right' : 'left');
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getImageClassName = () =>
    slideDirection === 'right' ? 'carousel-slide-enter-right' : 'carousel-slide-enter-left';

  // Si user es null o undefined (no ha cargado el contexto), no renderizamos
  if (user === undefined) { 
    return <div className="loading-state">Cargando sesión...</div>;
  }
  
  return (
    <div className="media-page">
      <div className="media-container">
        
        <div className="media-title">
          <h1>Media La Gacela FC</h1>
          <p>Los mejores momentos de nuestro equipo</p>
        </div>

        {/* Carrusel */}
        <div className="carousel">
          <div className="section-header">
            <h2>Destacados</h2>
            {isAdmin && ( // Solo si es admin
              <button onClick={() => setIsAddingCarousel(!isAddingCarousel)} className="btn-add">
                <Plus size={20} /> Agregar a carrusel
              </button>
            )}
          </div>

          {isAdmin && isAddingCarousel && ( // Solo si es admin
            <div className="add-image">
              <input 
                type="file" 
                onChange={(e) => setNewImage(e.target.files[0])} 
                accept="image/*"
                disabled={isUploading}
              />
              <input
                type="text"
                placeholder="Descripción"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                disabled={isUploading}
              />
              <div className="form-buttons">
                <button 
                  onClick={() => handleAddImage(true)} 
                  className="btn-save"
                  disabled={isUploading}
                >
                  <Save size={18} /> {isUploading ? 'Subiendo...' : 'Guardar'}
                </button>
                <button 
                  onClick={() => setIsAddingCarousel(false)} 
                  className="btn-cancel"
                  disabled={isUploading}
                >
                  <X size={18} /> Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="carousel-wrapper">
            {carouselImages.length > 0 ? (
              <>
                <img
                  src={carouselImages[currentSlide].url_imagen}
                  alt={carouselImages[currentSlide].descripcion}
                  className={isAnimating ? getImageClassName() : ''}
                />

                <button
                  onClick={prevSlide}
                  className="carousel-nav carousel-nav-left"
                  disabled={isAnimating}
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  onClick={nextSlide}
                  className="carousel-nav carousel-nav-right"
                  disabled={isAnimating}
                >
                  <ChevronRight size={24} />
                </button>

                <div className="carousel-caption">
                  {isAdmin && editingId === carouselImages[currentSlide]._id ? ( // Edición solo admin
                    <div className="caption-edit">
                      <input
                        type="text"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                      />
                      <button
                        onClick={() => saveEdit(carouselImages[currentSlide]._id)}
                        className="btn-save"
                      >
                        <Save size={18} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="btn-cancel">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="caption-text">{carouselImages[currentSlide].descripcion}</p>
                      {isAdmin && ( // Botones de edición y eliminación solo admin
                        <div className="caption-buttons">
                          <button
                            onClick={() =>
                              startEdit(
                                carouselImages[currentSlide]._id,
                                carouselImages[currentSlide].descripcion
                              )
                            }
                            className="btn-edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(carouselImages[currentSlide]._id)}
                            className="btn-delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="carousel-indicators">
                  {carouselImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={`indicator ${idx === currentSlide ? 'active' : ''}`}
                      disabled={isAnimating}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="carousel-empty">
                <p>No hay imágenes en el carrusel</p>
              </div>
            )}
          </div>
        </div>

        {/* Galería */}
        <div className="gallery-section">
          <div className="section-header">
            <h2>Galería</h2>
            {isAdmin && ( // Solo si es admin
              <button onClick={() => setIsAddingGallery(!isAddingGallery)} className="btn-add">
                <Plus size={20} /> Agregar imagen
              </button>
            )}
          </div>

          {isAdmin && isAddingGallery && ( // Solo si es admin
            <div className="add-image">
              <input 
                type="file" 
                onChange={(e) => setNewImage(e.target.files[0])} 
                accept="image/*"
                disabled={isUploading}
              />
              <input
                type="text"
                placeholder="Descripción"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                disabled={isUploading}
              />
              <div className="form-buttons">
                <button 
                  onClick={() => handleAddImage(false)} 
                  className="btn-save"
                  disabled={isUploading}
                >
                  <Save size={18} /> {isUploading ? 'Subiendo...' : 'Guardar'}
                </button>
                <button 
                  onClick={() => setIsAddingGallery(false)} 
                  className="btn-cancel"
                  disabled={isUploading}
                >
                  <X size={18} /> Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="gallery-grid">
            {galleryImages.map((image) => (
              <div key={image._id} className="gallery-item">
                <div className="gallery-image-wrapper">
                  <img
                    src={image.url_imagen}
                    alt={image.descripcion}
                    className="gallery-image"
                  />
                  {isAdmin && ( // Botones de edición y eliminación solo admin
                    <div className="gallery-overlay">
                      <button
                        onClick={() => startEdit(image._id, image.descripcion)}
                        className="btn-icon"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(image._id)}
                        className="btn-icon delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="gallery-caption">
                  {isAdmin && editingId === image._id ? ( // Edición en la galería solo admin
                    <div className="gallery-caption-edit">
                      <input
                        type="text"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                      />
                      <button onClick={() => saveEdit(image._id)} className="btn-small">
                        <Save size={16} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="btn-small cancel">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <p className="gallery-caption-text">{image.descripcion}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Media;