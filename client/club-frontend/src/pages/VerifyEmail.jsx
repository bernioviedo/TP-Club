import { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ContextUser } from '../../context/contextUser'
import axios from 'axios';
import './VerifyEmail.css';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('Verificando...');
    const navigate = useNavigate();
    const { setUser } = useContext(ContextUser);

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('Token no encontrado.');
            return;
        }

        axios.get(`/verify-email?token=${token}`)
            .then(() => {
                setStatus('¡Cuenta confirmada! Redirigiendo al inicio...');
                setUser(prev => {
            return { ...prev, isVerified: true };
        });
                setTimeout(() => navigate('/login'), 4000);
            })
            .catch(() => {
                setStatus('El link es inválido o ya expiró.');
            });
    }, [searchParams, navigate, setUser]);

    return (
        <div className="verify-section">
            <h1 className="title-stat">{status}</h1>
            <img className='image-section' src="https://upload.wikimedia.org/wikipedia/commons/1/1d/Antidorcas_marsupialis_angolensis.jpg">
            </img>
        </div>
    );
}