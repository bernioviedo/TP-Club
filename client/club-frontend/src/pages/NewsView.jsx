import React from 'react'
import { useState, useEffect } from 'react'
import { ContextUser } from '../../context/contextUser';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import '../pages/NewsView.css';
import '../App.css';
import Comments from '../components/Comments/Comments';

export default function NewsView() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newsItem, setNewsItem] = useState(null);


  //fetch new by id
    const id = window.location.pathname.split('/').pop();
  useEffect(() => {
    const fetchOneNew = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`http://localhost:8000/news/${id}`, { withCredentials: true });
        setNewsItem(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error');
        toast.error('Error al cargar las noticias');
      } finally {
        setLoading(false);
      }
    };
    fetchOneNew();
  }, [id]);

  if (loading) return <div className='news-list'><p>Cargando noticia...</p></div>;
  if (error) return <div className='news-list'><p>Error cargando noticia: {error}</p></div>;
  if (!newsItem) return <div className='news-list'><p>No se encontró la noticia.</p></div>;

  return (
    <div className='news-list'>
      <div className='news-item-view'>
        <h1>{newsItem.title}</h1>
        {newsItem.image && <img className='news-image-view' src={newsItem.image} alt={newsItem.title} />}
        <p className='news-content-view'>{newsItem.content}</p>
      </div>
      <Comments newsId={id} />
    </div>
    )
}

