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

                    <div className="card bg-light bg-opacity-50 shadow-sm mb-1 card-custom-bg">
                        <div className="card-body p-4 p-md-3">

                            <header>
                                {/* --- CAMBIO 1: Título más grande (fs-2 -> fs-1) --- */}
                                <h5 className="fw-bold fs-1 mb-4 text-dark" >
                                    Sobre nosotros
                                </h5>
                            </header>

                            <div className="row align-items-center">

                                {/* Columna Izquierda: Logo */}
                                <div className="col-md-4 text-center p-3">
                                    <img
                                        src={Logo}
                                        alt="Journal Mogollón Logo"
                                        className="img-fluid"
                                        // --- CAMBIO 2: Límite de tamaño de imagen aumentado ---
                                        style={{ maxWidth: '300px' }}
                                    />
                                </div>

                                {/* Columna Derecha: Texto */}
                                {/* --- CAMBIO 2: Texto más grande (añadido fs-5) --- */}
                                <div className="col-md-8 fs-5 ">
                                    <p className='text-dark'>
                                        <strong>Journal Mogollón</strong> es una empresa... lorem ipsum lorem ipsum
                                        lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem.
                                    </p>
                                    <p className='text-dark'>
                                        <strong>Misión:</strong> Lorem Ipsum is simply dummy text of the 
                                        printing and typesetting industry. Lorem Ipsum has been the industry's 
                                        standard dummy text ever since the 1500s.
                                    </p>
                                    <p className='text-dark'>
                                        <strong>Visión:</strong> It has survived not only five centuries, but also the leap into electronic typesetting, 
                                        remaining essentially unchanged. It was popularised in the 1960s with the 
                                        release of Letraset sheets containing Lorem Ipsum passages.
                                    </p>
                                    <div>
                                        <strong>Objetivos:</strong> Lorem ipsum Lorem ipsum... lorem ipsum lorem
                                        <ul className="mt-2 text-dark">
                                            <li>Lorem ipsum Lorem ipsum...</li>
                                            <li>Lorem ipsum Lorem ipsum...</li>
                                            <li>Lorem ipsum Lorem ipsum...</li>
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