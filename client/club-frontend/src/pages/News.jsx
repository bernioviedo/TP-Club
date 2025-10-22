import React from 'react'
import { useState, useContext, useEffect } from 'react'
import { ContextUser } from '../../context/contextUser';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import '../pages/News.css';
import '../App.css';

export default function News() {

    const { user } = useContext(ContextUser);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [news, setNews] = useState([]);

    const[textData, setTextData] = useState({
        title: '',
        content:'',
    });

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); //guarda el objeto archivo
    };

    const handleTextChange = (e) => {
        setTextData({...textData, [e.target.name]: e.target.value});
    };

        const submitNews = async (e) =>{
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', textData.title);
        formData.append('content', textData.content);
        formData.append('image', file);

        try {
            const { data: registerNews } = await axios.post('/news', formData, { 
                withCredentials: true 
            });

            if(registerNews.error){
                toast.error(registerNews.error)
                return;
            }
            toast.success('Noticia creada con éxito');

            setTextData({ title: '', content:'' });
            setFile(null);
            e.target.reset();
            fetchNews();
        } catch (error) {
            console.log(error)
            toast.error('Error al crear la noticia')
        };
    };

  //fetch news

    const fetchNews = async () => {
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
  };

  useEffect(() => {
    fetchNews();
  }, []);

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
    <div className='news-page'>
    { user?.userType === 'admin' ? (
        <>
        <div className='user-forms'>
      <form onSubmit={submitNews}>
        <h2>Noticias</h2>
        <div className='news-form form-group'>
        <input className='form-control' type="text" name='title' placeholder="Título" value={textData.title} onChange={handleTextChange} />
        <textarea className='form-control' placeholder="Contenido" name='content' value={textData.content} onChange={handleTextChange} rows={8} />
        <input type="file" className='form-control-file' onChange={handleFileChange} />
        <button type="submit" className='newsbtn'>Crear noticia</button>
        </div>
      </form>
        </div>
        </>
      ) : (
        <div>
            <h2>Noticias</h2>
        </div>

      )
      }
      <div className='news-list'>
                {loading ? (
          <p>Cargando noticias...</p>
        ) : error ? ( 
          <p>Error cargando noticias: {error}</p>
        ) : ( 
          <ul>
            {news.map((item) => (
              <li key={item._id}>
                <div className="card" style={{ width: '18rem' }}>
                  {item.image && <img src={item.image} alt={item.title} className='card-img-top' />}
                  <div className="card-body">
                    <h5 className='card-title'>{item.title}</h5>
                    <a href={`/news/${item._id}`} className="newsbtn btn btn-primary">Leer Noticia</a>
                    {(user?.userType === 'admin') &&<button onClick={() => handleDelete(item._id)}>Eliminar</button>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) }
      </div>
    </div>
  )
}
