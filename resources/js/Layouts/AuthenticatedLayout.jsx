// resources/js/Layouts/AuthenticatedLayout.jsx

import ApplicationLogo from '@/Components/ApplicationLogoFigure';
import NavLink from '@/Components/NavLink';
import Footer from '@/Components/Footer';
import { Link, usePage } from '@inertiajs/react';

import { Speedometer2, JournalText } from 'react-bootstrap-icons';


export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;

    const userRole = auth.user?.role?.name;

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
                <div className="container-fluid mx-5 d-flex justify-content-between align-items-center">

                    {/* GRUPO IZQUIERDO: Logo y Enlaces */}
                    <div className="d-flex align-items-center">
                        {/* Logo */}
                        <Link className="navbar-brand me-4" href="/">
                            <ApplicationLogo style={{ height: '100px', width: 'auto' }} />
                        </Link>

                        {/* --- ENLACES DE NAVEGACIÓN DINÁMICOS --- */}
                        <ul className="navbar-nav flex-row">
                            
                            {/* 1. Enlace "Notas" (Para todos los usuarios autenticados) */}
                            <li className="nav-item me-3">
                                <NavLink href={route('index.notes')} className="nav-link d-flex align-items-center" active={route().current('index.notes')}>
                                    Notas
                                </NavLink>
                            </li>

                            {/* 4. Enlace de Perfil (Para todos) */}
                            <li className="nav-item me-3">
                                <NavLink href={route('profile.edit')} className="nav-link d-flex align-items-center" active={route().current('profile.edit')}>
                                    {auth.user.username}
                                </NavLink>
                            </li>

                            {/* 2. Enlace "Workspace" (Solo para Reportero y Editor) */}
                            {(userRole === 'Reportero' || userRole === 'Editor') && (
                                <li className="nav-item me-3">
                                    <NavLink href={route('workspace.index')} className="nav-link d-flex align-items-center" active={route().current('workspace.index')}>
                                        <JournalText className='me-1' />
                                        Workspace
                                    </NavLink>
                                </li>
                            )}

                            {/* 3. Enlace "Panel de Control" (Solo para Administrador) */}
                            {userRole === 'Administrador' && (
                                <li className="nav-item me-3">
                                    <NavLink href={route('admin.panel')} className="nav-link d-flex align-items-center" active={route().current('admin.panel')}>
                                        <Speedometer2 className='me-1' />
                                        Panel de Control
                                    </NavLink>
                                </li>
                            )}
                            
                            {/* 5. Enlace "Sobre nosotros" (Para todos) */}
                            <li className="nav-item me-3">
                                <NavLink href={route('index.aboutus')} className="nav-link d-flex align-items-center" active={route().current('index.aboutus')}>
                                    Sobre nosotros
                                </NavLink>
                            </li>
                            
                            {/* 6. Cerrar Sesión (Para todos) */}
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
            <main className="container-fluid flex-grow-1 py-4 mt-5">
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