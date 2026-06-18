import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('Verificando...');
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('Token no encontrado.');
            return;
        }

        axios.get(`/verify-email?token=${token}`)
            .then(() => {
                setStatus('¡Cuenta confirmada! Redirigiendo al login...');
                setTimeout(() => navigate('/login'), 8000);
            })
            .catch(() => {
                setStatus('El link es inválido o ya expiró.');
            });
    }, [navigate, searchParams]);

    return (
        <div>
            <h2 className="title-stat">{status}</h2>
        </div>
    );
}