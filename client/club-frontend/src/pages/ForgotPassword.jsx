import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
        <div>
            <h2>Olvidé mi contraseña</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Ingresá tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Enviar instrucciones</button>
            </form>
        </div>
    );
}