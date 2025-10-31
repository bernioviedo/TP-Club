import React from 'react'
import { useState, useContext, useEffect, useCallback } from 'react'
import { ContextUser } from '../../../context/contextUser';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import './Comments.css';
import '../../App.css';
import { Link } from 'react-router-dom';

export default function Comments({newsId}) {

    const { user } = useContext(ContextUser);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const MAX_COMMENT_LENGTH = 500;
    
    const isCommentOwner = (comment) => {
    if (!user) return false;
    const userId = String(user._id ?? user.id);
    const authorId = comment?.author?._id ?? comment?.author;
    return String(authorId) === userId;
  };

    //fetch comentarios
    const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const q = newsId ? `?newsId=${newsId}` : '';
        const { data } = await axios.get(`/comments${q}`, { withCredentials: true });
        setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error');
      toast.error('Error al cargar los comentarios');
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  useEffect(() => {
    if (newsId) fetchComments();
  }, [fetchComments, newsId]);

  // subir comentario
  const submitComment = async (e) =>{
    e.preventDefault();
    if (!newsId) return toast.error('News id missing');
    try {
      const { data: createdComment } = await axios.post('/comments', { content: newComment, newsId }, {
        withCredentials: true
      });

      if(createdComment.error){
        toast.error(createdComment.error)
        return;
      }
      toast.success('Comentario creado con éxito');
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.log(error)
      toast.error('Error al crear el comentario')
    }
  };


        //delete comentario funcionalidad
    const handleDelete = async (id) => {
        if (!window.confirm("Estas seguro de eliminar este comentario?")) return;
        try {
          await axios.delete(`/comments/${id}`, { withCredentials: true });
          setComments((prevComments) => prevComments.filter((item) => item._id !== id));
        } catch (err) {
          alert(
            `Error eliminando el comentario: ${err.response?.data?.error || err.message}`
          );
        }
      };

    return (
      <div className="comments-container">
        <h2>Comentarios</h2>
{ user ? (
  // si esta iniciado sesión
  <form onSubmit={submitComment}>
    <textarea
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      maxLength={MAX_COMMENT_LENGTH}
      placeholder="Escribe tu comentario..."
    />
    <button type="submit" disabled={loading || !newComment.trim()}>
      {loading ? 'Cargando...' : 'Comentar'}
    </button>
  </form>
) : (
  // si no esta iniciado sesion
  <div className="comment-login-prompt">
    <p>Debes <Link to="/login">iniciar sesión</Link> para poder comentar.</p>
  </div>
)}
        {error && <p className="error">{error}</p>}
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment._id}>
                <strong>{comment.authorName}</strong> <em>({new Date(comment.createdAt).toLocaleString()})</em>
                <p>{comment.content}</p>
                {(isCommentOwner(comment) || user?.userType === 'admin') && (
                  <button onClick={() => handleDelete(comment._id)}>Eliminar</button>
                )}
            </li>
          ))}
        </ul>
      </div>
    );
}
