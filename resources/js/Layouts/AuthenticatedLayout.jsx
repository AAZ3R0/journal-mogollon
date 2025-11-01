import ApplicationLogo from '@/Components/ApplicationLogoFigure';
import NavLink from '@/Components/NavLink';
import Footer from '@/Components/Footer';
import { Link, usePage, useForm } from '@inertiajs/react';
import { Speedometer2, JournalText, Search } from 'react-bootstrap-icons';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const userRole = auth.user?.role?.name;

    // --- Lógica de Búsqueda (sin cambios) ---
    const { data, setData, get, processing } = useForm({
        query: usePage().props.searchQuery || '',
    });
    const submitSearch = (e) => {
        e.preventDefault();
        get(route('search'), { preserveState: true });
    };
    // ---

    return (
        <div className="d-flex flex-column min-vh-100">

            {/* ✅ 1. Barra de navegación optimizada para colapsar en 'lg' (pantallas grandes) */}
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
                    {/* 'navbar-brand' para el logo principal */}
                    {/* 'mx-auto' para centrar, 'mx-lg-0' para alinearlo a la izquierda desde 'lg' */}
                    <Link className="navbar-brand mx-auto mx-lg-0 me-lg-4" href="/">
                        <ApplicationLogo style={{ height: '100px', width: 'auto' }} />
                    </Link>
                    
                    {/* Div vacío para ayudar a centrar el logo en móvil (Bootstrap 5) */}
                    <div className="d-lg-none" style={{ width: '56px' }}></div> 

                    {/* ✅ 4. Contenedor Colapsable */}
                    {/* Este div agrupa todo lo que se esconderá en el menú hamburguesa */}
                    <div className="collapse navbar-collapse" id="mainNavbarContent">

                        {/* --- ENLACES DE NAVEGACIÓN (ahora verticales en móvil) --- */}
                        {/* 'me-auto' empuja los enlaces a la izquierda y la búsqueda a la derecha */}
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            
                            <li className="nav-item me-2">
                                <NavLink href={route('index.notes')} className="nav-link d-flex align-items-center" active={route().current('index.notes')}>
                                    Notas
                                </NavLink>
                            </li>

                            <li className="nav-item me-2">
                                <NavLink href={route('profile.edit')} className="nav-link d-flex align-items-center" active={route().current('profile.edit')}>
                                    {auth.user.username}
                                </NavLink>
                            </li>

                            {(userRole === 'Reportero' || userRole === 'Editor') && (
                                <li className="nav-item me-2">
                                    <NavLink href={route('workspace.index')} className="nav-link d-flex align-items-center" active={route().current('workspace.index')}>
                                        Espacio de trabajo
                                    </NavLink>
                                </li>
                            )}

                            {userRole === 'Administrador' && (
                                <li className="nav-item me-2">
                                    <NavLink href={route('admin.panel')} className="nav-link d-flex align-items-center" active={route().current('admin.panel')}>
                                        Panel de Control
                                    </NavLink>
                                </li>
                            )}
                            
                            <li className="nav-item me-2">
                                <NavLink href={route('index.aboutus')} className="nav-link d-flex align-items-center" active={route().current('index.aboutus')}>
                                    Sobre nosotros
                                </NavLink>
                            </li>
                            
                            <li className="nav-item">
                                <NavLink 
                                    href={route('logout')} 
                                    method="post" 
                                    as="button" 
                                    className="nav-link d-flex align-items-center btn btn-link text-danger text-start m-0"
                                >
                                    Cerrar sesión
                                </NavLink>
                            </li>
                        </ul>
                        
                        {/* --- Barra de Búsqueda (ahora dentro del colapso) --- */}
                        <form className="d-flex w-25" onSubmit={submitSearch}> {/* w-auto para que se ajuste */}
                            <div className="input-group">
                                <button className="btn btn-accent2" type="submit" id="button-addon1" disabled={processing}>
                                    <Search className='fs-4'></Search>
                                </button>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por título..."
                                    value={data.query}
                                    onChange={(e) => setData('query', e.target.value)}
                                />
                            </div>
                        </form>

                    </div> {/* Fin del div colapsable */}

                </div>
            </nav>

            {/* El 'main' ahora necesita un padding-top (pt-5) mayor para compensar la altura de la navbar */}
            <main className="container-fluid flex-grow-1 py-4" style={{ paddingTop: '130px' }}>
                {header && (
                    <header className="bg-white shadow-sm mb-4">
                        <div className="py-4 px-4">
                            {header}
                        </div>
                    </header>
                )}
                {children}
            </main>

            <Footer />
        </div>
    );
}