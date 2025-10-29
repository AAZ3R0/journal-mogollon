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



    return (
        // Quitamos 'navbar-expand-lg' para que la barra nunca se colapse.
        <nav className="navbar navbar-light bg-accent1  bg-opacity-75 shadow-sm ">
            <div className="container-fluid mx-5 d-flex justify-content-between align-items-center">
                {/* GRUPO IZQUIERDO: Logo y Enlaces */}
                <div className="d-flex align-items-center">
                    {/* Logo */}
                    <Link className="navbar-brand" href="/">
                        <ApplicationLogo style={{ height: '100px', width: 'auto' }} />
                    </Link>

                    {/* Enlaces de Navegación */}
                    {/* 'flex-row' fuerza a los elementos de la lista a estar en horizontal */}
                    {/* 'ms-4' agrega un margen a la izquierda para separar los enlaces del logo */}
                    <ul className="navbar-nav flex-row">
                        <li className="nav-item me-3"> {/* 'me-3' agrega espacio entre los enlaces */}
                            <NavLink
                                href={route('index.notes')}
                                className="nav-link"
                                active={route().current('index.notes')}
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
                                href={route('index.aboutus')}
                                className="nav-link"
                                active={route().current('index.aboutus')}
                            >
                                Sobre Nosotros
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
    );
}