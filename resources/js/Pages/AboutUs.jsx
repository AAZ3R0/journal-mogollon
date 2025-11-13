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

            <div className="row justify-content-center px-lg-5">
                {/* --- CAMBIO 1: Contenedor principal más grande --- */}
                {/* Cambiamos col-lg-8 por col-lg-10 */}
                <div className="col-lg col-md">

                    <div className="rounded bg-light bg-opacity-50 shadow-sm">
                        <div className="p-4 p-md-4">

                            


                            <div className="row align-items-center p-3">

                                {/* --- CAMBIO 1: Título más grande (fs-2 -> fs-1) --- */}
                                <h1 className="fw-bold text-dark text-center text-lg-start">
                                    Sobre nosotros
                                </h1>

                                {/* Columna Izquierda: Logo */}
                                <div className="col-md-4 text-center">
                                    <img
                                        src={Logo}
                                        alt="Journal Mogollón Logo"
                                        className="img-fluid"
                                        // --- CAMBIO 2: Límite de tamaño de imagen aumentado ---
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </div>

                                {/* Columna Derecha: Texto */}
                                {/* --- CAMBIO 2: Texto más grande (añadido fs-5) --- */}
                                <div className="col-md-8" style={{ textAlign: 'justify', textAlignLast: 'left', hyphens: 'auto'}}>
                                    <p className='text-dark fs-4' >
                                       <b>Journal Mogollón</b> es una empresa periodística que desarrolla información, investigación e historia a
                                        través de los principales sucesos que acontecen y afectan a Ciudad Juárez, nuestra Misión es servir de
                                        puente a la comunidad con información oportuna, veraz y trascendente con prioridad en la difusión del Valor de lo
                                        propio y el respeto a lo ajeno, fundada por profesionales en la comunicación y la cultura, teniendo como Visión el
                                        cambio hacia un periodismo más humano, accesible y crítico que genere reflexión, entretenimiento y emociones siempre
                                        con la perspectiva de una mejor convivencia social.

                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}