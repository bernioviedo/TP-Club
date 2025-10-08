import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import '../App.css'
import foto from '../assets/camiseta en maniqui.png';
import './Media.css';

const Media = () => {
 
  const [carouselImages, setCarouselImages] = useState([
    { id: 1, url: foto, caption: 'Camiseta de nuestro club' },
    { id: 2, url: 'https://drive.google.com/file/d/12Gs_QHPr-UUe8WNwgoWC4s5-HZPiVyJa/view?usp=drive_link', caption: 'Entrenamiento del primer equipo' },
    { id: 3, url: '', caption: 'Celebración del campeonato' }
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);

  
  const [galleryImages, setGalleryImages] = useState([
    { id: 1, url: '', caption: 'Gol del capitán' },
    { id: 2, url: '', caption: 'Hinchada en el estadio' },
    { id: 3, url: '', caption: 'Formación titular' },
    { id: 4, url: '', caption: 'Festejo en vestuario' },
    { id: 5, url: '', caption: 'Concentración previa' },
    { id: 6, url: '', caption: 'Práctica de tiros libres' }
  ]);


  const [editingId, setEditingId] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [isAddingCarousel, setIsAddingCarousel] = useState(false);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  // Funciones del carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  
  const handleAddCarouselImage = () => {
    if (newImageUrl && newCaption) {
      const newImage = {
        id: Date.now(),
        url: newImageUrl,
        caption: newCaption
      };
      setCarouselImages([...carouselImages, newImage]);
      setNewImageUrl('');
      setNewCaption('');
      setIsAddingCarousel(false);
    }
  };

  const handleAddGalleryImage = () => {
    if (newImageUrl && newCaption) {
      const newImage = {
        id: Date.now(),
        url: newImageUrl,
        caption: newCaption
      };
      setGalleryImages([...galleryImages, newImage]);
      setNewImageUrl('');
      setNewCaption('');
      setIsAddingGallery(false);
    }
  };

  const handleDeleteCarousel = (id) => {
    setCarouselImages(carouselImages.filter(img => img.id !== id));
    if (currentSlide >= carouselImages.length - 1) {
      setCurrentSlide(0);
    }
  };

  const handleDeleteGallery = (id) => {
    setGalleryImages(galleryImages.filter(img => img.id !== id));
  };

  const startEdit = (id, caption) => {
    setEditingId(id);
    setEditCaption(caption);
  };

  const saveEdit = (id, isCarousel = false) => {
    if (isCarousel) {
      setCarouselImages(carouselImages.map(img => 
        img.id === id ? { ...img, caption: editCaption } : img
      ));
    } else {
      setGalleryImages(galleryImages.map(img => 
        img.id === id ? { ...img, caption: editCaption } : img
      ));
    }
    setEditingId(null);
    setEditCaption('');
  };

  return (
    <div className="media-page">
      <div className="media-container">
        
        
        <div className="media-title">
          <h1>Media La Gacela FC</h1>
          <p>Los mejores momentos de nuestro equipo</p>
        </div>

        
        <div className="carousel-section">
          <div className="section-header">
            <h2>Destacados</h2>
            <button
              onClick={() => setIsAddingCarousel(!isAddingCarousel)}
              className="btn-add"
            >
              <Plus size={20} />
              Agregar a carrusel
            </button>
          </div>

         
          {isAddingCarousel && (
            <div className="add-image-form">
              <input
                type="text"
                placeholder="URL de la imagen"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <input
                type="text"
                placeholder="Descripción"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
              />
              <div className="form-buttons">
                <button onClick={handleAddCarouselImage} className="btn-save">
                  <Save size={18} />
                  Guardar
                </button>
                <button onClick={() => setIsAddingCarousel(false)} className="btn-cancel">
                  <X size={18} />
                  Cancelar
                </button>
              </div>
            </div>
          )}

         
          <div className="carousel-wrapper">
            <div className="carousel-content">
              {carouselImages.length > 0 ? (
                <>
                  <img
                    src={carouselImages[currentSlide].url}
                    alt={carouselImages[currentSlide].caption}
                  />
                  
                 
                  <button onClick={prevSlide} className="carousel-nav carousel-nav-left">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextSlide} className="carousel-nav carousel-nav-right">
                    <ChevronRight size={24} />
                  </button>

                
                  <div className="carousel-caption">
                    <div className="caption-content">
                      {editingId === carouselImages[currentSlide].id ? (
                        <div className="caption-edit">
                          <input
                            type="text"
                            value={editCaption}
                            onChange={(e) => setEditCaption(e.target.value)}
                          />
                          <button
                            onClick={() => saveEdit(carouselImages[currentSlide].id, true)}
                            className="btn-save"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="btn-cancel"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="caption-text">
                            {carouselImages[currentSlide].caption}
                          </p>
                          <div className="caption-buttons">
                            <button
                              onClick={() => startEdit(carouselImages[currentSlide].id, carouselImages[currentSlide].caption)}
                              className="btn-edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteCarousel(carouselImages[currentSlide].id)}
                              className="btn-delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  
                  <div className="carousel-indicators">
                    {carouselImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`indicator ${idx === currentSlide ? 'active' : ''}`}
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
        </div>

        
        <div className="gallery-section">
          <div className="section-header">
            <h2>Galería</h2>
            <button
              onClick={() => setIsAddingGallery(!isAddingGallery)}
              className="btn-add"
            >
              <Plus size={20} />
              Agregar imagen
            </button>
          </div>

        
          {isAddingGallery && (
            <div className="add-image-form">
              <input
                type="text"
                placeholder="URL de la imagen"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <input
                type="text"
                placeholder="Descripción"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
              />
              <div className="form-buttons">
                <button onClick={handleAddGalleryImage} className="btn-save">
                  <Save size={18} />
                  Guardar
                </button>
                <button onClick={() => setIsAddingGallery(false)} className="btn-cancel">
                  <X size={18} />
                  Cancelar
                </button>
              </div>
            </div>
          )}

          
          <div className="gallery-grid">
            {galleryImages.map((image) => (
              <div key={image.id} className="gallery-item">
                <div className="gallery-image-wrapper">
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="gallery-image"
                  />
                  <div className="gallery-overlay">
                    <button
                      onClick={() => startEdit(image.id, image.caption)}
                      className="btn-icon"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(image.id)}
                      className="btn-icon delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="gallery-caption">
                  {editingId === image.id ? (
                    <div className="gallery-caption-edit">
                      <input
                        type="text"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                      />
                      <button onClick={() => saveEdit(image.id)} className="btn-small">
                        <Save size={16} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="btn-small cancel">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <p className="gallery-caption-text">{image.caption}</p>
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