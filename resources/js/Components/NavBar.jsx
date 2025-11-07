// resources/js/Components/Navbar.jsx
import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogoFigure';
import NavLink from '@/Components/NavLink';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowBarRight, CardList, Newspaper, Search } from 'react-bootstrap-icons';
import PrimaryButton from './PrimaryButton';
import { CardText } from 'react-bootstrap';

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
        handleMobileLinkClick();
        e.preventDefault();
        // Hacemos una petición GET a la ruta 'index.notes'
        // Esto recargará la página de 'Notes' con los datos filtrados
        
        get(route('search'), {
            preserveState: true, // Mantiene el estado (ej. scroll)
            preserveScroll: true,
            handleMobileLinkClick,
        });
    };


    const handleMobileLinkClick = () => {
        
        const closeButton = document.querySelector('#mainOffcanvasMenu [data-bs-dismiss="offcanvas"]');
        
        if (closeButton) {
            // Si lo encuentra, hazle clic.
            closeButton.click();
        }
    };



    return (
        // ✅ 1. Añade 'navbar-expand-lg' y 'fixed-top'
        <nav className="navbar navbar-expand-lg navbar-light bg-accent1 bg-opacity-75 shadow-sm">
            <div className="container-fluid mx-lg-5">

                {/* ✅ 1. Botón Hamburguesa (Ahora apunta a un Offcanvas) */}
                <button 
                    className="navbar-toggler border-0" 
                    type="button" 
                    data-bs-toggle="offcanvas" // <--- CAMBIO
                    data-bs-target="#mainOffcanvasMenu" // <--- CAMBIO
                    aria-controls="mainOffcanvasMenu" // <--- CAMBIO
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon fs-1"></span>
                </button>

                {/* Logo (sin cambios) */}
                <Link className="navbar-brand mx-auto mx-lg-0 me-lg-4" href="/">
                    <ApplicationLogo style={{ height: '100px', width: 'auto' }} />
                </Link>
                
                {/* Div espaciador para centrar logo (sin cambios) */}
                <div className="d-lg-none" style={{ width: '56px' }}></div> 

                {/* ✅ 2. Contenedor Offcanvas */}
                {/* - Reemplaza 'collapse navbar-collapse'
                  - 'offcanvas-end' hace que aparezca desde la DERECHA
                  - 'navbar-expand-lg' lo convierte en navbar normal en desktop
                */}
                <div 
                    className="offcanvas offcanvas-start w-75" // <--- CAMBIO
                    tabIndex="-1" 
                    id="mainOffcanvasMenu" // <--- CAMBIO (debe coincidir con el data-bs-target)
                    aria-labelledby="mainOffcanvasMenuLabel"
                >
                    
                    {/* ✅ 3. Header del Offcanvas (SOLO VISIBLE EN MÓVIL) */}
                    <div className="offcanvas-header d-lg-none justify-content-between"> {/* d-lg-none lo oculta en desktop */}
                        <h5 className="offcanvas-title" id="mainOffcanvasMenuLabel">
                            <Link className="navbar-brand mx-auto mx-lg-0 me-lg-4" href="/" onClick={handleMobileLinkClick}>
                                <ApplicationLogo style={{ height: '80px', width: 'auto' }} />
                            </Link>
                        </h5>
                        {/* ✅ CORRECCIÓN: Se usa el botón con el ícono 'X' importado */}
                        <button 
                            type="button" 
                            className="btn btn-close text-reset fs-3 lh-1" // Clases de botón simple
                            data-bs-dismiss="offcanvas" 
                            aria-label="Close"
                        >
                        </button>
                    </div>

                    {/* Barra de Búsqueda (sin cambios, solo movida aquí dentro) */}
                    <form className="col-12 p-1 d-flex d-block d-lg-none mt-3 mt-lg-0" onSubmit={submitSearch}>
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

                    {/* ✅ 4. Cuerpo del Offcanvas (Aquí van tus enlaces y form) */}
                    {/* - 'navbar-expand-lg' hace que este body se comporte
                        como el contenedor de links en desktop.
                    */}
                    <div className="offcanvas-body align-items-center p-0">

                        {/* Lista de celular */}
                        <ul className="navbar-nav mt-2 mb-lg-0 d-block d-lg-none menu-transparent-bg">
                            <li className="nav-item">
                                <a
                                    href={route('index.notes')}
                                    // ✅ Clases de Botón para móvil
                                    className={`text-decoration-none ${route().current('index.notes') ? 'active' : ''}`}
                                    active={route().current('index.notes')} // Sigue controlando el estado 'active'
                                    onClick={handleMobileLinkClick}
                                >
                                    <PrimaryButton className='bg-warning bg-opacity-75 d-flex align-items-center text-dark text-start mb-0 p-4 col-12 fw-bold fs-5 rounded-0 border border-bottom-0 border-dark'>
                                       <Newspaper className='fs-2 me-2'></Newspaper> Notas
                                    </PrimaryButton>
                                    
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    href={route('login')}
                                    className="text-decoration-none"
                                    active={route().current('login')}
                                    onClick={handleMobileLinkClick}
                                >
                                    <PrimaryButton className='bg-warning bg-opacity-75 d-flex align-items-center text-dark text-start mb-0 p-4 w-100 fw-bold fs-5 border-bottom-0 rounded-0 border border-dark'>
                                      <ArrowBarRight className='fs-2 me-2'></ArrowBarRight> Iniciar Sesión
                                    </PrimaryButton>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    href={route('index.aboutus')}
                                    className="text-decoration-none"
                                    active={route().current('index.aboutus')}
                                    onClick={handleMobileLinkClick}
                                >
                                    <PrimaryButton className='bg-warning bg-opacity-75 d-flex align-items-center text-dark text-start mb-0 p-4 w-100 fw-bold fs-5 rounded-0 border border-dark'>
                                        <CardList className='fs-2 me-2'></CardList> Sobre Nosotros
                                    </PrimaryButton>
                                </a>
                            </li>
                        </ul>
                        
                        {/* Enlaces (sin cambios, solo movidos aquí dentro) */}
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-none d-lg-flex">
                            <li className="nav-item me-2">
                                <NavLink
                                    href={route('index.notes')}
                                    className="nav-link"
                                    active={route().current('index.notes')}
                                    onClick={handleMobileLinkClick}
                                >
                                    Notas
                                </NavLink>
                            </li>
                            <li className="nav-item me-2">
                                <NavLink
                                    href={route('login')}
                                    className="nav-link"
                                    active={route().current('login')}
                                    onClick={handleMobileLinkClick}
                                >
                                    Iniciar Sesión
                                </NavLink>
                            </li>
                            <li className="nav-item me-2">
                                <NavLink
                                    href={route('index.aboutus')}
                                    className="nav-link "
                                    active={route().current('index.aboutus')}
                                    onClick={handleMobileLinkClick}
                                >
                                    Sobre Nosotros
                                </NavLink>
                            </li>
                        </ul>

                        {/* Barra de Búsqueda (sin cambios, solo movida aquí dentro) */}
                        <form className="d-flex col-lg-4 d-none d-lg-block mt-3 mt-lg-0" onSubmit={submitSearch}>
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
                        
                        {/* Error (sin cambios) */}
                        {errors.query && <div className='text-danger small mt-1 d-lg-none'>{errors.query}</div>}

                    </div> {/* Fin del offcanvas-body */}

                </div> {/* Fin del div offcanvas */}

            </div>
        </nav>
    );
}