import React from 'react'
import './Home.css'
import CarouselHome from '../CarouselHome/CarouselHome.jsx'
import Card from '../Card/Card.jsx'
import { useState, useContext, useEffect, useCallback } from 'react'
import { ContextUser } from '../../../context/contextUser.js';
import axios from 'axios';
import {toast} from 'react-hot-toast';

export default function Home() {
      const { user } = useContext(ContextUser);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [news, setNews] = useState([]);
      const [editNews, setEditNews] = useState(null);
      const [editForm, setEditForm] = useState({ title: "", content: "", summary: "" });
const MAX_SUMMARY = 80;
    const MAX_TITLE = 50;
          
    //edit funcionalidad
    const openEditDialog = (newsItem) => {
      setEditNews(newsItem);
      setEditForm({ title: newsItem.title, content: newsItem.content, summary: newsItem.summary });
    };

    const closeEditDialog = () => {
      setEditNews(null);
    };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'summary') {
      setEditForm(prev => ({ ...prev, [name]: value.slice(0, MAX_SUMMARY) }));
    } else if (name === 'title') {
      setEditForm(prev => ({ ...prev, [name]: value.slice(0, MAX_TITLE) }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSave = async () => {
      if (!editNews) return;
      try {
        const response = await axios.put(`/news/${editNews._id}`, editForm, { withCredentials: true });
        setNews((prevNews) =>
          prevNews.map((n) => (n._id === editNews._id ? response.data : n))
        );
        closeEditDialog();
      } catch (err) {
        alert(
          `Error editando la noticia: ${err.response?.data?.error || err.message}`
        );
      }
    };
      
      
    

  
  //fetch news

    const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('/news', { withCredentials: true });
      const newsArray = Array.isArray(data) ? data : (data?.news ?? []);
      setNews(newsArray);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error');
      toast.error('Error al cargar las noticias');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

    //delete noticia funcionalidad
const handleDelete = async (id) => {
    if (!window.confirm("Estas seguro de eliminar esta noticia?")) return;
    try {
      await axios.delete(`/news/${id}`, { withCredentials: true });
      setNews((prevNews) => prevNews.filter((item) => item._id !== id));
    } catch (err) {
      alert(
        `Error eliminando la noticia: ${err.response?.data?.error || err.message}`
      );
    }
  };

  return (
    <div className='home-content'>
      <div className='main-content-position'>   
        <CarouselHome className="carousel"></CarouselHome>
        <h2>Ultimas noticias de La Gacela</h2>
        <div className='news-list'>
    {loading ? (
      <p>Cargando noticias...</p>
    ) : error ? ( 
      <p>Error cargando noticias: {error}</p>
    ) : ( 
      <ul>
        {news.map((item) => (
          <li key={item._id}>
            
            <div className="card news-card-horizontal">
              
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className='news-card-img'
                />
              )}
              
              <div className="card-body">
                <div>
                  <h4 className='card-title'>{item.title}</h4>
                  <p className='card-text'>{item.summary}</p>
                </div>
                
                <div>
                  <a href={`/news/${item._id}`} className="newsbtn">Leer Noticia</a>
                  
                  {(user?.userType === 'admin') && ( <>
                    <button onClick={() => handleDelete(item._id)} className="newsbtn newsbtn-delete">Eliminar</button>
                    <button onClick={() => openEditDialog(item)} className="newsbtn newsbtn-edit">Editar</button>
                    </>
                  )}
                </div>
            {editNews && ( 
            <>
            <div className="dialog-backdrop" onClick={closeEditDialog} />
            <div className="dialog">
              <h2>Editar Noticia</h2>
              <label>Título:</label>
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditFormChange}
              />
              <label>Resumen:</label>
              <input
                type="text"
                name="summary"
                value={editForm.summary}
                onChange={handleEditFormChange}
              />
              <label>Contenido:</label>
              <textarea
                name="content"
                value={editForm.content}
                onChange={handleEditFormChange}
              />
              <div className="dialog-actions">
                <button onClick={handleEditSave}>Guardar</button>
                <button onClick={closeEditDialog}>Cancelar</button>
              </div>
            </div>
            </>
          )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) }
</div>
      </div>
    </div>
  ) 
}
