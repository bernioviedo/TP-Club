import './Faqss.css'
import { Link } from 'react-router-dom'

export default function Faqs() {
    return(
        <>
        <h2 className="faqs-title">LA GACELA FC - Preguntas frequentes</h2>
        <section className='sctn'>
            <h3>Registro y acceso</h3>
            <article className="q-art">
                <h4 className="q-title">¿Es necesario pagar para registrarse?</h4>
                <p className="q-res">No, el registro es completamente gratuito.</p>
            </article>
            <article className="q-art">
                <h4 className="q-title">Olvidé mi contraseña, ¿cómo la recupero?</h4>
                <p className="q-res">Haciendo click <Link className='link-faqs' to='/'>aquí.</Link></p>
            </article>
            <article className="q-art">
                <h4 className="q-title">¿Puedo borrar mi cuenta?</h4>
                <p className="q-res">Sí, entrando <Link className='link-faqs' to='/'>aquí</Link>lo podés hacer sin problema.</p>
            </article>
        </section>
        <section className='sctn'>
            <h3>Membresía y socios</h3>
            <article className="q-art">
                <h4 className="q-title">¿Cómo me hago socio del club?</h4>
                <p className="q-res">En la barra de navegación donde dice socios o <Link className='link-faqs' to='/'>aquí</Link>.</p>
            </article>
            <article className="q-art art-list">
                <h4 className="q-title">¿Cuáles son los beneficios de ser socio?</h4>
                <p className="q-res">Haciendote socio tenes los siguientes beneficios:</p>
                <ul className='benefits-list'>
                    <li>Entrada gratis a los partidos de futbol.</li>
                    <li>Colonia de verano para los chicos</li>
                    <li>Acceso al camping del club</li>
                </ul>
            </article>
            <article className="q-art">
                <h4 className="q-title">¿Cuánto cuesta la cuota mensual/anual?</h4>
                <div className='members-prices-table'>
                    <table className='responsive-table'>
                        <thead>
                            <tr>
                                <td><strong>Categoría</strong></td>
                                <td><strong>Cuota</strong></td>
                                <td><strong>Inscripción</strong></td>
                                <td><strong>Condición</strong></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label='Categoria'>Activo</td>
                                <td data-label='Cuota'>$15.000</td>
                                <td data-label='Inscripcion'>$5.000</td>
                                <td data-label='Condicion'>Mayor a 18 años</td>
                            </tr>
                            <tr>
                                <td data-label='Categoria'>Cadete</td>
                                <td data-label='Cuota'>$10.000</td>
                                <td data-label='Inscripcion'>$5.000</td>
                                <td data-label='Condicion'>Mayor a 14 años</td>
                            </tr>
                            <tr>
                                <td data-label='Categoria'>Menor</td>
                                <td data-label='Cuota'>-</td>
                                <td data-label='Inscripcion'>$5.000</td>
                                <td data-label='Condicion'>Mayor a 5 años</td>
                            </tr>
                            <tr>
                                <td data-label='Categoria'>Adherente</td>
                                <td data-label='Cuota'>$18.000</td>
                                <td data-label='Inscripcion'>$5.000</td>
                                <td data-label='Condicion'>-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </article>
        </section>
        </>
    )
}