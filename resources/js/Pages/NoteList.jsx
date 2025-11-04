import React, { useMemo } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import BootstrapPagination from '@/Components/BootstrapPagination';

// --- Listas para los dropdowns de fecha ---
const days = Array.from({ length: 31 }, (_, i) => i + 1); // [1, 2, 3, ..., 31]
const months = [
    { value: 1, name: 'Enero' }, { value: 2, name: 'Febrero' }, { value: 3, name: 'Marzo' },
    { value: 4, name: 'Abril' }, { value: 5, name: 'Mayo' }, { value: 6, name: 'Junio' },
    { value: 7, name: 'Julio' }, { value: 8, name: 'Agosto' }, { value: 9, name: 'Septiembre' },
    { value: 10, name: 'Octubre' }, { value: 11, name: 'Noviembre' }, { value: 12, name: 'Diciembre' }
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // [2025, 2024, ..., 2021]

export default function Notes({ auth, notes = { data: [] }, sections = [], filters = {} }) {
    
    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    // Usamos useMemo para mantener los filtros actuales en memoria
    const currentFilters = useMemo(() => ({
        section_id: filters.section_id || '',
        day: filters.day || '',
        month: filters.month || '',
        year: filters.year || '',
    }), [filters]);

    // ✅ Esta es la función clave. Se llama cada vez que un <select> cambia.
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = {
            ...currentFilters,
            [name]: value,
        };
        
        // ✅ CORRECCIÓN: Usamos Inertia.get() en lugar de router.get()
        router.get(route('index.notes'), newFilters, { // Asumiendo que esta es tu ruta de viewList
            preserveState: true,
            replace: true, // No añade una entrada nueva al historial del navegador
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <Layout>
            <Head title="Lista de Noticias" />

            {/* --- Panel de Filtros --- */}
            <div className='p-5 mx-lg-5 bg-light bg-opacity-50 rounded mb-5'>
                <h3 className='fw-bold mb-4'>Filtros de búsqueda</h3>
                
                {/* Usamos el sistema de Grid (row/col) */}
                <div className='row g-3'> {/* g-3 añade espacio entre las columnas */}
                    
                    {/* --- Columna de Sección (ocupa 4 de 12 columnas en pantallas medianas) --- */}
                    <div className='col col-lg col-md'>
                        <h4>Sección</h4>
                        <select className='form-select' name="section_id" value={currentFilters.section_id} onChange={handleFilterChange}>
                            <option value="">Todas las secciones</option>
                            {sections.map(section => (
                                <option key={section.section_id} value={section.section_id}>
                                    {section.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* --- Columna de Fecha (ocupa 8 de 12 columnas en pantallas medianas) --- */}
                    <div className='col-md-8'>
                        <h4>Fecha</h4>
                        {/* Usamos 'd-flex' aquí para alinear los 3 selectores de fecha */}
                        <div className='row g-0'>
                            <select className='col-lg col-md-12 mb-2 me-lg-2 mb-lg-0 form-select' name="day" value={currentFilters.day} onChange={handleFilterChange}>
                                <option value="">Cualquier día</option>
                                {days.map(day => <option key={day} value={day}>{day}</option>)}
                            </select>
                            
                            <select className='col-lg col-md-12 mb-2 me-lg-2 mb-lg-0 form-select' name="month" value={currentFilters.month} onChange={handleFilterChange}>
                                <option value="">Cualquier mes</option>
                                {months.map(month => <option key={month.value} value={month.value}>{month.name}</option>)}
                            </select>
                            
                            <select className='col-lg col-md-12 mb-2 mb-lg-0 form-select' name="year" value={currentFilters.year} onChange={handleFilterChange}>
                                <option value="">Cualquier año</option>
                                {years.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- Listado de Notas --- */}
            <div className="p-5 mx-lg-5 bg-light bg-opacity-50 rounded"> 
                <div className="h1 mb-4">
                    Lista de noticias
                </div>
                
                {/* ✅ 1. Reemplaza 'd-flex' por el 'row' de Bootstrap.
                    'g-4' añade un espaciado (gutter) uniforme.
                    'row-cols-1' = 1 columna en móvil
                    'row-cols-md-2' = 2 columnas en tablet
                    'row-cols-lg-4' = 4 columnas en escritorio (puedes cambiar este número)
                */}
                <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4'>
                        
                        {notes.data.map((note) => (
                            
                            <div className='col d-flex align-items-stretch' key={note.note_id}>
                                
                                <div className="card bg-light bg-opacity-50 h-100 w-100 shadow-sm">
                                    <Link href={route('notes.public.show', note.note_id)} className="text-decoration-none text-reset">
                                        <img src={`/storage/${note.portrait_url}`} className='card-img-top' alt={note.headline} style={{ height: '10rem', objectFit: 'cover' }} />
                                    </Link>
                                    <div className="card-body d-flex flex-column">
                                        <h6 className="card-subtitle mb-2 text-muted small">
                                            {Array.isArray(note.sections) && note.sections.map((section) => (
                                                <span key={section.section_id} className="badge bg-primary me-1 mb-1">{section.name}</span>
                                            ))}
                                        </h6>
                                        <p>
                                            {formatDate(note.publish_date)}
                                        </p>
                                        <h5 className="card-title">
                                            <Link href={route('notes.public.show', note.note_id)} className="text-decoration-none text-reset">
                                                {note.headline}
                                            </Link>
                                        </h5>
                                        <h6 className="card-subtitle mt-auto small"><b>Autor:</b> {note.user?.name || 'Desconocido'}</h6>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                
                {/* Si no hay resultados */}
                {notes.data.length === 0 && (
                    <div className="alert bg-warning bg-opacity-50 text-dark text-center mt-4" role="alert">
                        No se encontraron notas que coincidan con tus filtros.
                    </div>
                )}

                <BootstrapPagination links={notes.links} />
            </div>
        </Layout>
    )}