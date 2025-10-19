// resources/js/Components/Footer.jsx
import ApplicationLogo from '@/Components/ApplicationLogo';
import React from 'react';
import { Envelope, Telephone, Facebook } from 'react-bootstrap-icons';

export default function Footer() {
    return (
        <footer className="bg-accent1 bg-opacity-75 text-dark mt-auto py-3">
            <div className="container">
                {/*
                 * CAMBIO: Usamos el sistema Grid de Bootstrap en lugar de 'd-flex'.
                 * 'row': Contenedor principal de la grilla.
                 * 'align-items-center': Mantiene todo centrado verticalmente.
                 */}
                <div className="row align-items-center">
                    
                    {/* --- 1. Bloque Izquierdo (Texto Pasión) --- */}
                    {/*
                     * 'col-lg-4': Ocupa 1/3 (4 de 12 columnas) en pantallas 'lg' y superiores.
                     * 'text-center': Centra el texto en pantallas pequeñas (cuando se apila).
                     * 'text-lg-start': Alinea el texto a la izquierda en pantallas 'lg'.
                     * 'my-3': Añade margen vertical para espaciar cuando se apila.
                     */}
                    <div className="col-lg-4 text-center text-lg-start my-3">
                        <span className="fs-5 fw-bold">
                            📰 Journal Mogollón, periodismo con pasión.
                        </span>
                    </div>

                    {/* --- 2. Bloque Central (Logo) --- */}
                    {/*
                     * 'col-lg-4': Ocupa el 1/3 central.
                     * 'text-center': Asegura que el logo SIEMPRE esté centrado en su columna.
                     * Esta es la clave para tu solicitud.
                     */}
                    <div className="col-lg-4 text-center my-3">
                        <ApplicationLogo style={{ height: '200px', width: 'auto' }} />
                    </div>

                    {/* --- 3. Bloque Derecho (Contacto) --- */}
                    {/*
                     * 'col-lg-4': Ocupa el 1/3 derecho.
                     * 'd-flex': Permite usar utilidades de justificación.
                     * 'justify-content-center': Centra el bloque en pantallas pequeñas.
                     * 'justify-content-lg-end': Alinea el bloque a la DERECHA en pantallas 'lg'.
                     */}
                    <div className="col-lg-4 d-flex justify-content-center justify-content-lg-end my-3">
                        
                        {/* El 'text-start' aquí asegura que el contenido *dentro* del bloque
                            (la lista) se alinee a la izquierda, aunque el bloque
                            entero esté alineado a la derecha en 'lg'. */}
                        <div className="text-start">
                            <strong>Contactanos:</strong>
                            
                            <ul className="list-unstyled mt-2">
                                <li className="d-flex align-items-center mb-2">
                                    <Envelope />
                                    <a 
                                        href="mailto:journal_mogollon75@gmail.com" 
                                        className="text-dark text-decoration-none ms-2 opacity-75 opacity-100-hover"
                                    >
                                        journal_mogollon75@gmail.com
                                    </a>
                                </li>
                                
                                <li className="d-flex align-items-center mb-2">
                                    <Telephone />
                                    <a 
                                        href="tel:656-822-7384" 
                                        className="text-dark text-decoration-none ms-2 opacity-75 opacity-100-hover"
                                    >
                                        656-822-7384
                                    </a>
                                </li>
                                
                                <li className="d-flex align-items-center">
                                    <Facebook />
                                    <a 
                                        href="#" // <-- RECUERDA REEMPLAZAR ESTO
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-dark text-decoration-none ms-2 opacity-75 opacity-100-hover"
                                    >
                                        Journal Mogollón
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}