import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/forgot-password', { email });
            if (data.error) {
                toast.error(data.error);
            } else {
                setSent(true);
            }
        } catch {
            toast.error('Algo salió mal, intentá de nuevo.');
        }
    };

    if (sent) return (
        <div>
            <h2>Revisá tu mail</h2>
            <p>Te enviamos instrucciones para restablecer tu contraseña.</p>
        </div>
    );

    return (
        <div className="forgot-password-container container-background">
            <form onSubmit={handleSubmit} className="forgot-password-form">
                <h2 className="form-title">Olvidé mi contraseña</h2>
                <label htmlFor="email" className="description">Ingresa tu email aquí abajo y te enviaremos un mensaje con un link para que puedas reestablecer tu contraseña.</label>
                <div className="body">
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="submit-button" type="submit">Enviar</button>
                </div>
            </form>
        </div>
    );
}