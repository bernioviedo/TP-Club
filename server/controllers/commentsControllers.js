import Comments from '../models/comments.js';
import pkg from 'jsonwebtoken';
const { verify } = pkg;
import User from '../models/users.js';

//crear comentario
const createComment = async (req, res) => {
    try {
        const { content, newsId } = req.body;
        // valido datos
        if (!content || !newsId) {
        return res.status(400).json({ error: 'Content y newsId son obligatorios' });
        }
        const MAX_CONTENT = 500;
        const safeContent = (typeof content === 'string') ? content.trim().slice(0, MAX_CONTENT) : '';

        // obtener token desde cookies y verificar
        const token = req.cookies?.token;
        if (!token) return res.status(401).json({ error: 'No autorizado' });
        // verifico token
        verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
            if (err) return res.status(401).json({ error: 'Token inválido' });
            // obtengo user
            const authorUser = await User.findById(decoded.id).select('name');
            if (!authorUser) return res.status(401).json({ error: 'Usuario no encontrado' });
            // creo comentario
            const newComment = new Comments({
                content: safeContent,
                author: authorUser._id,
                authorName: authorUser.name,
                news: newsId,
            });
            await newComment.save();
            await newComment.populate('author', 'name').execPopulate?.();
            res.status(201).json(newComment);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al crear el comentario' });
    }
};

//hago fetch de comentarios
const fetchComments = async (req, res) => {
    try {
    const { newsId } = req.query;
    const filter = newsId ? { news: newsId } : {};
    const comments = await Comments.find(filter).populate('author', 'name').sort({ createdAt: -1 });
    res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener los comentarios' });
    }
};

//delete de comentarios
const deleteComment = async (req, res) => {
    try {
        const deletedComment = await Comments.findByIdAndDelete(req.params.id);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        res.json({ message: 'Comentario eliminado' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export {    
        createComment, 
        fetchComments,
        deleteComment, 
    };

