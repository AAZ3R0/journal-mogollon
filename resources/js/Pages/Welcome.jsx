import React, { useState, useEffect } from 'react'; // Importa useEffect
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

// Ayudante para formatear fechas (opcional pero buena práctica)
const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options); // Usar locale español
};

// Asegúrate de recibir las nuevas props 'featuredNote' y 'todayNotes'
export default function Welcome({ auth, featuredNote, todayNotes, laravelVersion, phpVersion }) {
    
    // Estado para el carrusel - Ahora basado en todayNotes
    const [currentSlide, setCurrentSlide] = useState(0);

    // Usa todayNotes directamente, ya no necesitas newsItems hardcodeado
    const newsItems = todayNotes || []; // Usa todayNotes, o un arreglo vacío si es null/undefined

    // Resetea el slide si las notas cambian (ej. al navegar atrás/adelante)
    useEffect(() => {
        setCurrentSlide(0);
    }, [todayNotes]);

    const nextSlide = () => {
        if (newsItems.length > 0) {
            setCurrentSlide((prev) => (prev + 1) % newsItems.length);
        }
    };

    const prevSlide = () => {
         if (newsItems.length > 0) {
            setCurrentSlide((prev) => (prev - 1 + newsItems.length) % newsItems.length);
         }
    };

    return (
        <GuestLayout>
            <Head title="Inicio" /> {/* Título cambiado */}
            <div className="container rounded p-5 my-5 bg-white bg-opacity-50">
                
                {/* --- Sección Principal (Nota Destacada) --- */}
                {/* Renderiza condicionalmente solo si existe featuredNote */}
                <Link href={route('notes.public.show', featuredNote.note_id)} className="text-decoration-none text-reset">
                  {featuredNote ? (
                      <div className="row g-0 align-items-center bg-warning bg-opacity-25 mb-5 shadow-sm rounded"> {/* Añadí shadow */}
                          <div className="col-md-5">
                              <img 
                                  src={`/storage/${featuredNote.portrait_url}`} 
                                  alt={`Portada de ${featuredNote.headline}`}
                                  className="img-fluid w-100 rounded-start" style={{ height: '18rem'}}
                                  
                              />
                          </div>
                          <div className="col-md-7 p-4 ps-md-5">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                  <span>
                                      {/* Muestra el nombre de la primera sección si está disponible */}

                                      {Array.isArray(featuredNote.sections) && featuredNote.sections.map((section) => (
                                                <span key={section.section_id} className="badge bg-secondary me-2 mb-1">
                                                    {section.name}
                                                </span>
                                      ))}
                                      
                                  </span>
                                  <span style={{ fontSize: '0.85rem'}}>
                                      {formatDate(featuredNote.publish_date)}
                                  </span>
                              </div>
                              <h1 className="fw-bold mb-3">
                                  {/* Usa Link para hacer el título clickeable (asume ruta 'notes.show') */}
                                  
                                      {featuredNote.headline}
                                  
                              </h1>
                              <p className="mb-0">
                                  <span style={{ fontWeight: '600' }}>Autor:</span> {featuredNote.user?.name || 'Desconocido'}
                              </p>
                              {/* Opcional: Añadir un fragmento del 'lead' */}
                              <p className="mt-2 display-6 fst-italic" style={{fontSize: "1.5rem"}}>{featuredNote.lead.substring(0, 100)}...</p> 
                          </div>
                      </div>
                  
                  ) : (
                      // Opcional: Muestra un mensaje si no hay nota destacada
                      <div className="alert alert-info text-center" role="alert">
                          No hay nota destacada en este momento.
                      </div>
                  )}
                </Link>
                {/* --- Sección Carrusel (Notas del Día) --- */}
                {/* Renderiza el carrusel solo si hay notas para hoy */}
                {newsItems.length > 0 ? (
                    <div className='py-2 rounded'> {/* Contenedor general del carrusel */}

                        {/* Fila para el CONTENIDO del carrusel */}
                        <div className="position-relative">
                            <div className="row align-items-center justify-content-center"> {/* justify-content-center ayuda */}
                                <h1 className='fw-bold'>Noticias del día</h1>

                                {/* Botón Anterior */}
                                <div className="col-auto bg-danger  rounded-start py-5"> {/* Usamos col-auto para que ocupe solo el espacio necesario */}
                                    <button className='bg-danger text-white border-0' onClick={prevSlide} style={{ width: '3rem', height:'8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h1>‹</h1></button>
                                </div>

                                {/* Contenido del Carrusel */}
                                <Link href={route('notes.public.show', newsItems[currentSlide].note_id)} className="text-decoration-none text-reset col">
                                  <div className="row g-0 align-items-center shadow-sm bg-warning bg-opacity-25 rounded" style={{ minHeight: '130px' }}>
                                      <div className="col-md-5">
                                          <img src={`/storage/${newsItems[currentSlide].portrait_url}`} alt={newsItems[currentSlide].headline} className='rounded-start' style={{ width: '25rem', height: '14rem', objectFit: 'cover' }} />
                                      </div>
                                      <div className="col-md px-3">
                                          <div className="d-flex justify-content-between mb-5">
                                              <span>

                                                  {Array.isArray(newsItems[currentSlide].sections) && newsItems[currentSlide].sections.map((section) => (
                                                              <span key={section.section_id} className="badge bg-secondary me-2 mb-1">
                                                                  {section.name}
                                                              </span>
                                                  ))}
                                              </span>
                                              <span style={{ fontSize: '0.85rem' }}>{formatDate(newsItems[currentSlide].publish_date)}</span>
                                          </div>
                                          <h3 className='fw-bold mb-5' style={{ fontSize: '1.5rem'}}>
                                              {newsItems[currentSlide].headline}
                                          </h3>
                                          <p style={{ fontSize: '0.85rem', margin: 0 }}>
                                              <span style={{ fontWeight: '600' }}>Autor:</span> {newsItems[currentSlide].user?.name || 'Desconocido'}
                                          </p>
                                      </div>
                                  </div>   
                                </Link>
                                {/* Botón Siguiente */}
                                <div className="col-auto rounded-end bg-danger py-5"> {/* Usamos col-auto */}
                                    <button className='bg-danger text-white border-0 ' onClick={nextSlide} style={{ width: '2.5rem', height:'8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h1>›</h1></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-secondary text-center" role="alert">
                        No hay noticias nuevas publicadas hoy.
                    </div>
                )}
            </div>
            {/* Aquí podrías añadir un footer u otras secciones */}
        </GuestLayout>
    );
}