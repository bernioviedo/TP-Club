import { useContext, useState } from 'react';
import { ContextUser } from '../../../context/contextUser';
import axios from 'axios';

export default function VerificationBanner() {
    const { user } = useContext(ContextUser);
    const [sent, setSent] = useState(false);

    if (!user || user.isVerified) return null;

    const handleResend = async () => {
        await axios.post('/resend-verification', { email: user.email });
        setSent(true);
    };

    return (
        <div style={{ background: '#fff3cd', padding: '12px', textAlign: 'center' }}>
            {sent
                ? 'Mail reenviado, revisá tu casilla.'
                : <>
                    Confirmá tu email para acceder a todas las funciones.{' '}
                    <button onClick={handleResend}>Reenviar mail de confirmación</button>
                </>
            }
        </div>
    );
}