// resources/js/Components/Navbar.jsx
import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogoFigure';
import NavLink from '@/Components/NavLink';
import { Link } from '@inertiajs/react';

export default function Navbar() {
    return (
        // Quitamos 'navbar-expand-lg' para que la barra nunca se colapse.
        <nav className="navbar navbar-light bg-accent1  bg-opacity-75 shadow-sm ">
            <div className="container d-flex justify-content-between align-items-center">
                {/* GRUPO IZQUIERDO: Logo y Enlaces */}
                <div className="d-flex align-items-center">
                    {/* Logo */}
                    <Link className="navbar-brand" href="/">
                        <ApplicationLogo style={{ height: '100px', width: 'auto' }} />
                    </Link>

                    {/* Enlaces de Navegación */}
                    {/* 'flex-row' fuerza a los elementos de la lista a estar en horizontal */}
                    {/* 'ms-4' agrega un margen a la izquierda para separar los enlaces del logo */}
                    <ul className="navbar-nav flex-row ms-4">
                        <li className="nav-item me-3"> {/* 'me-3' agrega espacio entre los enlaces */}
                            <NavLink
                                href={route('login')}
                                className="nav-link"
                                active={route().current('login')}
                            >
                                Notas
                            </NavLink>
                        </li>
                        <li className="nav-item me-3"> {/* 'me-3' agrega espacio entre los enlaces */}
                            <NavLink
                                href={route('login')}
                                className="nav-link"
                                active={route().current('login')}
                            >
                                Iniciar Sesión
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                href={route('register')}
                                className="nav-link"
                                active={route().current('register')}
                            >
                                Sobre Nosotros
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* GRUPO DERECHO: Barra de Búsqueda */}
                <form className="d-flex">
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                            🔍
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar"
                            aria-label="Buscar"
                            aria-describedby="basic-addon1"
                        />
                    </div>
                </form>

            </div>
        </nav>
    );
}