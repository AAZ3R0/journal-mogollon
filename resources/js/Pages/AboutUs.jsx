// resources/js/Pages/AboutUs.jsx

import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Logo from '../../img/LogoModificado.png'; // ¡Perfecto! Esta es la importación correcta.

export default function AboutUs({ auth, laravelVersion, phpVersion }) {

    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout>
            <Head title="Sobre Nosotros" />

            <div className="row justify-content-center">
                {/* --- CAMBIO 1: Contenedor principal más grande --- */}
                {/* Cambiamos col-lg-8 por col-lg-10 */}
                <div className=" col-lg-10 col-md-10">

                    <div className="rounded bg-light bg-opacity-50 shadow-sm mb-5">
                        <div className=" p-4 p-md-4">

                            {/* --- CAMBIO 1: Título más grande (fs-2 -> fs-1) --- */}
                            <h1 className="fw-bold text-dark" style={{fontSize:'4.5rem'}}>
                                Sobre nosotros
                            </h1>


                            <div className="row align-items-center p-4">

                                {/* Columna Izquierda: Logo */}
                                <div className="col-md-4 text-center p-3">
                                    <img
                                        src={Logo}
                                        alt="Journal Mogollón Logo"
                                        className="img-fluid"
                                        // --- CAMBIO 2: Límite de tamaño de imagen aumentado ---
                                        style={{ width: '30rem', height: 'auto' }}
                                    />
                                </div>

                                {/* Columna Derecha: Texto */}
                                {/* --- CAMBIO 2: Texto más grande (añadido fs-5) --- */}
                                <div className="col-md-8 fs-5 " style={{ textAlign: 'justify', textAlignLast: 'left', hyphens: 'auto'}}>
                                    <p className='text-dark' >
                                        Somos una empresa periodística que desarrolla información, investigación e historia a
                                        través de los principales sucesos que acontecen y afectan a Ciudad Juárez, nuestra Misión es servir de
                                        puente a la comunidad con información oportuna, veraz y trascendente con prioridad en la difusión del Valor de lo
                                        propio y el respeto a lo ajeno, fundada por profesionales en la comunicación y la cultura, teniendo como Visión el
                                        cambio hacia un periodismo más humano, accesible y crítico que genere reflexión, entretenimiento y emociones siempre
                                        con la perspectiva de una mejor convivencia social.

                                    </p>
                                    <div >
                                        <strong>Objetivos:</strong>
                                        <ul className="mt-2" >
                                            <li className='mb-2'>Lanzar oficialmente al final de noviembre la primera publicación oficial de "Journal Mogollón" como periodico digital.</li>
                                            <li className='mb-2'>Iniciar con publicación de información general de fuentes informativas principales durante el primer mes.</li>
                                            <li className='mb-2'>Reducir al mínimo curva de aprendizaje en el equipo de trabajo sobre la dinámica laboral en equipo base y de rapidez en la publicación de contenido inmediato.</li>
                                            <li className='mb-2'>Completar  en el primer semestre del año, la publicación de todas las fuentes, tanto locales, nacionales e internacionales, soft y hard.</li>
                                            <li className='mb-2'>Formar un equipo de trabajo completo al final del primer año de fundación con reporteros asignados a fuentes y staff administrativo.</li>
                                            <li className='mb-2'>Mejorar calidad en contenidos en los diferentes géneros y secciones, en redacción de notas, selección de temas e historias que generen impacto en lectores.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}