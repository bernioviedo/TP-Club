import { useContext, useState } from 'react';
import { ContextUser } from '../../../context/contextUser';
import axios from 'axios';
import './VerificationBanner.css';
import { HiOutlineX } from "react-icons/hi"

export default function VerificationBanner() {
    const { user } = useContext(ContextUser);
    const [sent, setSent] = useState(false);
    const [closed, setClosed] = useState(false);

    if (!user || user.isVerified) return null;

    const handleResend = async () => {
        await axios.post('/resend-verification', { email: user.email });
        setSent(true);
    };

    const handleClose = () => setClosed(true)

    return (
        <div className={`banner ${closed ? 'closed' : 'open'}`}>
            <section className='banner-content'>
                {sent
                    ? 'Mail reenviado, revisá tu casilla'
                    : <>
                        Confirmá tu email para acceder a todas las funciones{' '}
                        <button className='confirmation-button' onClick={handleResend}>Reenviar mail de confirmación</button>
                    </>
            }
            </section>
            <button className='close-button' onClick={handleClose}><HiOutlineX /></button>{/*  aqui iria el boton para cerrar el banner*/}
        </div>
    );
}