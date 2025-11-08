import ApplicationLogo from '@/Components/ApplicationLogoFigure';
import NavLink from '@/Components/NavLink';
import Footer from '@/Components/Footer';
import { Link, usePage, useForm } from '@inertiajs/react';
import { ArrowBarRight, CardList, Newspaper, Speedometer2, JournalText, Search, PersonFill, ListTask, ArrowBarLeft, ClipboardData, PersonCircle, ChatLeftDots } from 'react-bootstrap-icons';
import PrimaryButton from '@/Components/PrimaryButton';


export default function AuthenticatedLayout({ header, children, containerType = 'container' }) {
    const { auth } = usePage().props;
    const userRole = auth.user?.role?.name;

    const mainContainerClass = `${containerType} flex-grow-1 py-4`;

    // --- Lógica de Búsqueda (sin cambios) ---
    const { data, setData, get, processing } = useForm({
        query: usePage().props.searchQuery || '',
    });
    const submitSearch = (e) => {

        handleMobileLinkClick();
        e.preventDefault();
        get(route('search'), { 
            preserveState: true,
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
        <div className="d-flex flex-column min-vh-100">

            {/* ✅ 1. Barra de navegación optimizada para colapsar en 'lg' (pantallas grandes) */}
            <nav className="navbar navbar-expand-lg navbar-light bg-accent1 bg-opacity-75 shadow-sm">
                <div className="container-fluid mx-lg-5"> {/* 'mx-5' solo en pantallas grandes */}

                    {/* ✅ 2. Botón Hamburguesa (alineado a la izquierda) */}
                    <button 
                        className="navbar-toggler border-0" 
                        type="button" 
                        data-bs-toggle="offcanvas"
                        data-bs-target="#mainOffcanvasMenu"
                        aria-controls="mainOffcanvasMenu" 
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
                    <div 
                        className="offcanvas offcanvas-start w-75" 
                        id="mainOffcanvasMenu" // <--- CAMBIO (debe coincidir con el data-bs-target)
                        aria-labelledby="mainOffcanvasMenuLabel"
                        tabIndex='-1'
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

                        {/* --- ENLACES DE NAVEGACIÓN (ahora verticales en móvil) --- */}
                        {/* 'me-auto' empuja los enlaces a la izquierda y la búsqueda a la derecha */}
                        <div className='offcanvas-body align-items-center p-0'>

                            <ul className='navbar-nav mt-2 mb-lg-0 d-block d-lg-none menu-transparent-bg'>
                                <a 
                                    href={route('index.notes')}
                                    className={`text-decoration-none ${route().current('index.notes') ? 'active' : ''}`}
                                    active={route().current('index.notes')}
                                    onClick={handleMobileLinkClick}
                                >
                                    <PrimaryButton className='bg-warning bg-opacity-75 d-flex align-items-center text-dark text-start mb-0 p-4 col-12 fw-bold fs-5 rounded-0 border border-bottom-0 border-dark'>
                                        <Newspaper className='fs-2 me-2'></Newspaper> Notas
                                    </PrimaryButton>
                                </a>
                                <a
                                    href={route('profile.edit')}
                                    className="text-decoration-none"
                                    active={route().current('profile.edit')}
                                    onClick={handleMobileLinkClick}
                                >
                                    <PrimaryButton className='bg-warning bg-opacity-75 d-flex align-items-center text-dark text-start mb-0 p-4 w-100 fw-bold fs-5 border-bottom-0 rounded-0 border border-dark'>
                                      <PersonFill className='fs-2 me-2'></PersonFill> {auth.user.username}
                                    </PrimaryButton>
                                </a>

                                {(userRole === 'Reportero' || userRole === 'Editor') && (
                                    
                                    <a 
                                        href={route('workspace.index')} 
                                        className="text-decoration-none" 
                                        active={route().current('workspace.index')}
                                        onClick={handleMobileLinkClick}
                                    >
                                        <PrimaryButton className='bg-warning bg-opacity-75 d-flex align-items-center text-dark text-start mb-0 p-4 w-100 fw-bold fs-5 border-bottom-0 rounded-0 border border-dark'>
                                            <ListTask className='fs-2 me-2'></ListTask> Espacio de trabajo
                                        </PrimaryButton>
                                    </a>
                                    
                                )}

                                {(userRole === 'Administrador') && (

                                    <a 
                                        href={route('admin.panel')} 
                                        className="text-decoration-none" 
                                        active={route().current('admin.panel')}
                                        onClick={handleMobileLinkClick}
                                    >
                                        <PrimaryButton className='bg-warning bg-opacity-75 d-flex align-items-center text-dark text-start mb-0 p-4 w-100 fw-bold fs-5 border-bottom-0 rounded-0 border border-dark'>
                                            <ClipboardData className='fs-2 me-2'></ClipboardData>
                                            Panel de control                                         
                                        </PrimaryButton>
                                        
                                    </a>
                                )}

                                {(userRole === 'Administrador') && (
                                    <div class="btn-group row g-0 col-12 bg-warning bg-opacity-75 border border-bottom-0 rounded-0 border-dark">
                                        <button type="button" class="btn btn-lg fs-2 rounded-0 border-0 text-start dropdown-toggle mx-2" data-bs-toggle="dropdown" aria-expanded="false">
                                            <span class="visually-hidden"></span>
                                        </button>
                                        <ul class="dropdown-menu rounded-0 m-0 border-0 border-top border-dark bg-warning bg-opacity-25">
                                            <li><a class="ms-4 dropdown-item d-flex align-items-center fw-bold" href={route('notes.index')}><JournalText className='fs-2 me-2 text-dark'></JournalText> Administrar notas</a></li>
                                            <li><hr class="dropdown-divider"/></li>
                                            <li><a class="ms-4 dropdown-item d-flex align-items-center fw-bold" href={route('admin.users')}><PersonCircle className='fs-2 me-2 text-dark'></PersonCircle> Administrar usuarios</a></li>
                                            <li><hr class="dropdown-divider"/></li>
                                            <li><a class="ms-4 dropdown-item d-flex align-items-center fw-bold" href={route('admin.comments')}><ChatLeftDots className='fs-2 me-2 text-dark'></ChatLeftDots> Administrar comentarios</a></li>
                                        </ul>
                                    </div>
                                )}

                                  

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

                                <NavLink
                                    href={route('logout')} 
                                    method="post" 
                                    
                                    className="text-decoration-none"
                                    onClick={handleMobileLinkClick}
                                >
                                    <button className='bg-danger bg-opacity-75 border-top-0 d-flex align-items-center text-light text-start mb-0 p-4 w-100 fw-bold fs-5 rounded-0 border border-dark'>
                                        <ArrowBarLeft className='fs-2 me-2'></ArrowBarLeft> Cerrar sesión
                                    </button>
                                </NavLink>

                            </ul>

                            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-none d-lg-flex">
                            
                                <li className="nav-item me-2">
                                    <NavLink href={route('index.notes')} className="nav-link d-flex align-items-center me-2" active={route().current('index.notes')}>
                                        Notas
                                    </NavLink>
                                </li>

                                <li className="nav-item me-2">
                                    <NavLink href={route('profile.edit')} className="nav-link d-flex align-items-center me-2" active={route().current('profile.edit')}>
                                        {auth.user.username}
                                    </NavLink>
                                </li>

                                {(userRole === 'Reportero' || userRole === 'Editor') && (
                                    <li className="nav-item me-2">
                                        <NavLink href={route('workspace.index')} className="nav-link d-flex align-items-center me-2" active={route().current('workspace.index')}>
                                            Espacio de trabajo
                                        </NavLink>
                                    </li>
                                )}

                                {userRole === 'Administrador' && (
                                    <li className="nav-item me-2">
                                        <NavLink href={route('admin.panel')} className="nav-link d-flex align-items-center me-2" active={route().current('admin.panel')}>
                                            Panel de Control
                                        </NavLink>
                                    </li>
                                )}
                                
                                <li className="nav-item me-2">
                                    <NavLink href={route('index.aboutus')} className="nav-link d-flex align-items-center me-2" active={route().current('index.aboutus')}>
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
                            <form className="d-flex col-lg-4 d-none d-lg-block mt-3 mt-lg-0" onSubmit={submitSearch}> {/* w-auto para que se ajuste */}
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
                        </div>
                        

                    </div> {/* Fin del div colapsable */}

                </div>
            </nav>

            {/* El 'main' ahora necesita un padding-top (pt-5) mayor para compensar la altura de la navbar */}
            <main className={mainContainerClass}>
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