// resources/js/Layouts/AuthenticatedLayout.jsx

import ApplicationLogo from '@/Components/ApplicationLogoFigure';
import NavLink from '@/Components/NavLink';
import Footer from '@/Components/Footer';
import { Link, usePage } from '@inertiajs/react';


export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;

    return (
        // Estructura principal para que el footer (si lo añades) se pegue abajo
        <div className="d-flex flex-column min-vh-100">

            {/* Añadimos 'fixed-top' para que la barra de navegación
              se quede fija en la parte superior.
            */}
            <nav className="navbar navbar-light bg-accent1 bg-opacity-75 shadow-sm">
                {/* Contenedor con Flexbox:
                  d-flex: activa flexbox
                  justify-content-between: empuja los grupos a los extremos
                  align-items-center: centra todo verticalmente
                */}
                <div className="container d-flex justify-content-between align-items-center">

                    {/* GRUPO IZQUIERDO: Logo y Enlaces */}
                    <div className="d-flex align-items-center">
                        {/* Logo */}
                        <Link className="navbar-brand me-4" href="/">
                            <ApplicationLogo style={{ height: '100px', width: 'auto' }} />
                        </Link>

                        {/* Enlaces de Navegación */}
                        <ul className="navbar-nav flex-row">
                            <li className="nav-item me-3">
                                <NavLink href={route('dashboard')} className="nav-link d-flex align-items-center" active={route().current('dashboard')}>
                                    Notas
                                </NavLink>
                            </li>
                            <li className="nav-item me-3">
                                <NavLink href={route('profile.edit')} className="nav-link d-flex align-items-center" active={route().current('profile.edit')}>
                                    {auth.user.name}
                                </NavLink>
                            </li>
                            <li className="nav-item me-3">
                                <NavLink href="#" className="nav-link d-flex align-items-center">
                                    Sobre nosotros
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink href={route('logout')} method="post" as="button" className="nav-link d-flex align-items-center btn btn-link text-danger">
                                    Cerrar sesión
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

            {/* Añadimos 'mt-5' y 'pt-4' al 'main' para crear el espacio
              necesario y que el contenido no quede oculto
              debajo de la barra de navegación fija.
            */}
            <main className="container flex-grow-1 py-4 mt-5">
                {/* Cabecera de la página (si existe) */}
                {header && (
                    <header className="bg-white shadow-sm mb-4">
                        <div className="py-4 px-4">
                            {header}
                        </div>
                    </header>
                )}

                {/* Contenido principal */}
                {children}
            </main>

            {/* <Footer /> */}
            <Footer />

        </div>
    );
}