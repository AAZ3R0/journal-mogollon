// resources/js/Layouts/AuthenticatedLayout.jsx

import ApplicationLogo from '@/Components/ApplicationLogoFigure';
import NavLink from '@/Components/NavLink';
import Footer from '@/Components/Footer';
import { Link, usePage, useForm } from '@inertiajs/react';

import { Speedometer2, JournalText, Search } from 'react-bootstrap-icons';


export default function AuthenticatedLayout({ header, children }) {
    const { auth, searchQuery } = usePage().props;

    // ✅ PASO 1: Inicializa useForm para el campo de búsqueda
    // Pre-llena el campo con el valor de búsqueda actual (si existe)
    const { data, setData, get, processing } = useForm({
        query: searchQuery || '',
    });

    // ✅ PASO 2: Crea la función de envío
    const submitSearch = (e) => {
        e.preventDefault();
        // Hacemos una petición GET a la ruta 'index.notes'
        // Esto recargará la página de 'Notes' con los datos filtrados
        get(route('search'), {
            preserveState: true, // Mantiene el estado (ej. scroll)
        });
    };

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
                                        Espacio de trabajo
                                    </NavLink>
                                </li>
                            )}

                            {/* 3. Enlace "Panel de Control" (Solo para Administrador) */}
                            {userRole === 'Administrador' && (
                                <li className="nav-item me-3">
                                    <NavLink href={route('admin.panel')} className="nav-link d-flex align-items-center" active={route().current('admin.panel')}>
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
                    <form className="d-flex w-25" onSubmit={submitSearch}>
                        <div className="input-group">
                            
                            {/* El botón ahora es de tipo 'submit' */}
                            <button className="btn btn-accent2" type="submit" id="button-addon1" disabled={processing}>
                                <Search className='fs-4'></Search>
                            </button>
                            
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por título..."
                                aria-label="Buscar"
                                aria-describedby="basic-addon1"
                                value={data.query} // Controlado por el estado
                                onChange={(e) => setData('query', e.target.value)} // Actualiza el estado
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