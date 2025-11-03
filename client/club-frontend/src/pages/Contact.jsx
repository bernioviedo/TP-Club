import './Contact.css'
import { FaWhatsapp } from 'react-icons/fa'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { SiGmail } from 'react-icons/si'



export default function Contact() {
    return(
        <>
        <section className='wrapper'>
            <h2>Ante cualquier consulta, no dudes en contactar con La Gacela</h2>
            <img className="gazelle-img" src='../src/assets/gacela contacto.png' alt="gacela" />
        </section>
        <section className='contact-tools'>
            <ul className='tools-list'>
                <li>
                    <p>Podés hablarnos por Whatsapp </p>
                    <p>
                        
                        <FaWhatsapp /> 3407-123456
                    </p>
                </li>
                <li>
                    <p>Podés llamarnos de 08:00 a 13:00</p>
                    <p><BsFillTelephoneFill /> 03407-987654</p>
                </li>
                <li>
                    <p>Podés escribirnos al siguiente mail</p>
                    <p><SiGmail /> lagacela@gmail.dep.com</p>
                </li>
            </ul>
        </section>
        </>
    )
}