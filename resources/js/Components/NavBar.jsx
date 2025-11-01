// resources/js/Components/Navbar.jsx
import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogoFigure';
import NavLink from '@/Components/NavLink';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Search } from 'react-bootstrap-icons';

export default function Navbar() {

    // Obtenemos el 'searchQuery' actual de las props de la página
    const { searchQuery } = usePage().props;

    // ✅ PASO 1: Inicializa useForm para el campo de búsqueda
    // Pre-llena el campo con el valor de búsqueda actual (si existe)
    const { data, setData, get, processing, errors } = useForm({
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



    return (
        // ✅ 1. Añade 'navbar-expand-lg' y 'fixed-top'
        <nav className="navbar navbar-expand-lg navbar-light bg-accent1 bg-opacity-75 shadow-sm">
            <div className="container-fluid mx-lg-5"> {/* 'mx-5' solo en pantallas grandes */}

                {/* ✅ 2. Botón Hamburguesa (alineado a la izquierda) */}
                <button 
                    className="navbar-toggler border-0" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#mainNavbarContent" 
                    aria-controls="mainNavbarContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon fs-1"></span>
                </button>

                {/* ✅ 3. Logo (centrado en móvil, a la izquierda en escritorio) */}
                <Link className="navbar-brand mx-auto mx-lg-0 me-lg-4" href="/">
                    <ApplicationLogo style={{ height: '100px', width: 'auto' }} />
                </Link>
                
                {/* Div vacío para ayudar a centrar el logo en móvil (Bootstrap 5) */}
                <div className="d-lg-none" style={{ width: '56px' }}></div> 

                {/* ✅ 4. Contenedor Colapsable */}
                <div className="collapse navbar-collapse" id="mainNavbarContent">

                    {/* 'me-auto' empuja los enlaces a la izquierda */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item me-2">
                            <NavLink
                                href={route('index.notes')}
                                className="nav-link"
                                active={route().current('index.notes')}
                            >
                                Notas
                            </NavLink>
                        </li>
                        <li className="nav-item me-2">
                            <NavLink
                                href={route('login')}
                                className="nav-link"
                                active={route().current('login')}
                            >
                                Iniciar Sesión
                            </NavLink>
                        </li>
                        <li className="nav-item me-2">
                            <NavLink
                                href={route('index.aboutus')}
                                className="nav-link "
                                active={route().current('index.aboutus')}
                            >
                                Sobre Nosotros
                            </NavLink>
                        </li>
                    </ul>

                    {/* --- Barra de Búsqueda (ahora dentro del colapso) --- */}
                    <form className="d-flex w-25 mt-3 mt-lg-0" onSubmit={submitSearch}> {/* w-auto y márgenes responsivos */}
                        <div className="input-group">
                            <button className="btn btn-accent2" type="submit" id="button-addon1" disabled={processing}>
                                <Search className='fs-4'></Search>
                            </button>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por título..."
                                aria-label="Buscar"
                                aria-describedby="basic-addon1"
                                value={data.query}
                                onChange={(e) => setData('query', e.target.value)}
                            />
                        </div>
                    </form>
                    {/* Opcional: Mostrar error de validación */}
                    {errors.query && <div className='text-danger small mt-1 d-lg-none'>{errors.query}</div>}

                </div> {/* Fin del div colapsable */}

            </div>
        </nav>
    );
}