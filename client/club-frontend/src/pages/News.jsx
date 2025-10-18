import React from 'react'
import { useState, useContext } from 'react'
import { ContextUser } from '../../context/contextUser';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import '../pages/News.css';
import '../App.css';

export default function News() {

    const { user } = useContext(ContextUser);

    const[data, setData] = useState({
        title: '',
        content:'',
        image:'',

    })

        const submitNews = async (e) =>{
        e.preventDefault();
        const {title, content, image} = data
        try {
            const { data: registerNews } = await axios.post('/news', {title, content, image}, { withCredentials: true });
            if(registerNews.error){
                toast.error(registerNews.error)
                return;
            }
            toast.success('Noticia creada con éxito');
            setData({ title: '', content:'', image:'' });
        } catch (error) {
            console.log(error)
            toast.error('Error al crear la noticia')
        };
    };

  return (
    <div>
    { user?.userType === 'admin' ? (
        <>
        <div className='user-forms'>
      <form onSubmit={submitNews}>
        <h2>Noticias</h2>
        <div className='news-form'>
        <input type="text" placeholder="Título" value={data.title} onChange={(e) => setData({...data, title: e.target.value})} />
        <textarea placeholder="Contenido" value={data.content} onChange={(e) => setData({...data, content: e.target.value})} />
        <input type="text" placeholder="URL de la imagen" value={data.image} onChange={(e) => setData({...data, image: e.target.value})} />
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
    </div>
  )
}
