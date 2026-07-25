import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ResetPassword.css';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirm) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            const token = searchParams.get('token');
            const { data } = await axios.patch('/reset-password', { token, password });

            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success('Contraseña actualizada exitosamente');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch  {
            toast.error('Algo salió mal, intentá de nuevo.');
        }
    };

    return (
        <div className="reset-password-container">
            <form className="reset-form" onSubmit={handleSubmit}>
                <h2 className='reset-title'>Restablecer contraseña</h2>
                <div className='new-password'>
                    <label htmlFor="password">Nueva contraseña</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Ingresá tu nueva contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className='confirm-password'>
                    <label htmlFor="confirm">Confirmá la contraseña</label>
                    <input
                        type="password"
                        id="confirm"
                        placeholder="Repetí tu nueva contraseña"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                </div>
                <button className='reset-button' type="submit">Restablecer contraseña</button>
            </form>
        </div>
    );
}