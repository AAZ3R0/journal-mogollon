import React, { useState, useEffect } from 'react'; // Importa useEffect
import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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

    const Layout = auth.user? AuthenticatedLayout : GuestLayout;

    return (
        <Layout>
            <Head title="Inicio" /> {/* Título cambiado */}
            <div className="container rounded p-3 p-md-5 mx-md-2 mx-xlg-5 bg-white bg-opacity-50">
                
                {/* --- Sección Principal (Nota Destacada) --- */}
                {/* Renderiza condicionalmente solo si existe featuredNote */}

                  {featuredNote ? (
                    <Link href={route('notes.public.show', featuredNote.note_id)} className="text-decoration-none text-reset">
                      <div className="row g-0 align-items-center bg-warning bg-opacity-25 mb-5 shadow-sm rounded"> {/* Añadí shadow */}
                          <div className="col-md-5">
                              <img 
                                  src={`/storage/${featuredNote.portrait_url}`} 
                                  alt={`Portada de ${featuredNote.headline}`}
                                  className="img-fluid w-100 rounded-start"
                                  
                              />
                          </div>
                          <div className="col-md-7 p-4">
                              <div className="mb-2 d-flex justify-content-between">
                                  <span>
                                      {/* Muestra el nombre de la primera sección si está disponible */}

                                      {Array.isArray(featuredNote.sections) && featuredNote.sections.map((section) => (
                                                <span key={section.section_id} className="badge bg-secondary me-2">
                                                    {section.name}
                                                </span>
                                      ))}
                                      
                                  </span>
                                  <span>
                                      {formatDate(featuredNote.publish_date)}
                                  </span>
                              </div>
                              <h1 className="fw-bold">
                                  {/* Usa Link para hacer el título clickeable (asume ruta 'notes.show') */}
                                  
                                      {featuredNote.headline}
                                  
                              </h1>
                              <p className="">
                                  <span className='fw-bold'>Autor:</span> {featuredNote.user?.name || 'Desconocido'}
                              </p>
                              {/* Opcional: Añadir un fragmento del 'lead' */}
                              <p className="mt-2 h5 text-muted fst-italic">{featuredNote.lead.substring(0, 100)}...</p> 
                          </div>
                      </div>
                    </Link>
                  ) : (
                      // Opcional: Muestra un mensaje si no hay nota destacada
                      <div className="alert bg-warning bg-opacity-50 text-center" role="alert">
                          No hay nota una destacada en este momento.
                      </div>
                  )}
                
                {/* --- Sección Carrusel (Notas del Día) --- */}
                {/* Renderiza el carrusel solo si hay notas para hoy */}

                <h1 className='fw-bold'>Noticias del día</h1>
                {newsItems.length > 0 ? (
                    <div className='py-2 rounded'> {/* Contenedor general del carrusel */}
                        
                        {/* Fila para el CONTENIDO del carrusel */}
                        <div className="position-relative">
                            
                            <div className="row align-items-center justify-content-center "> {/* justify-content-center ayuda */}

                                {/* Botón Anterior */}
                                <div className="col-auto bg-danger rounded-start align-self-stretch d-flex align-items-center"> {/* Usamos col-auto para que ocupe solo el espacio necesario */}
                                    <button className='bg-danger text-white border-0 h-100' onClick={prevSlide} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h1>‹</h1></button>
                                </div>

                                <Link href={route('notes.public.show', newsItems[currentSlide].note_id)} className="text-decoration-none text-reset col">
                                    {/* ✅ PASO 1: Usamos 'align-items-stretch' (que es el default en .row) 
                                        para que ambas columnas (img y texto) tengan la misma altura.
                                        La imagen fija esa altura en '14rem'.
                                    */}
                                    <div className="row g-0 shadow-sm bg-warning bg-opacity-25 rounded" >
                                        <div className="col-md-4">
                                            <img src={`/storage/${newsItems[currentSlide].portrait_url}`} alt={newsItems[currentSlide].headline} className='rounded-start img-fluid h-100' style={{ width: '26rem', objectFit: 'cover' }} />
                                        </div>
                                        
                                        {/* ✅ PASO 2: Añadimos 'd-flex flex-column' para controlar el contenido verticalmente.
                                            Quitamos el padding 'mx-2 my-3' de adentro y lo ponemos aquí (ej: 'p-3').
                                        */}
                                        <div className="col-md-8 d-flex flex-column p-2"> 
                                            <div className="d-flex justify-content-between"> {/* Quitamos mx-2 my-3 */}
                                                <span>
                                                    {Array.isArray(newsItems[currentSlide].sections) && newsItems[currentSlide].sections.map((section) => (
                                                        <span key={section.section_id} className="badge bg-secondary me-2 mb-2">
                                                            {section.name}
                                                        </span>
                                                    ))}
                                                </span>
                                                <span>{formatDate(newsItems[currentSlide].publish_date)}</span>
                                            </div>
                                            
                                            {/* ✅ PASO 3: Aplicamos el clamp al título para evitar desbordamiento.
                                                Ajusta el 'WebkitLineClamp' a cuántas líneas MÁXIMO quieres.
                                            */}
                                            <h2 className='fw-bold mb-3' style={{ // Quitamos ps-2
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2, 
                                                WebkitBoxOrient: 'vertical'
                                            }}>
                                                {newsItems[currentSlide].headline}
                                            </h2>

                                            {/* ✅ PASO 4: 'mt-auto' (margin-top: auto) empuja esto al fondo.
                                            */}
                                            <p className='mt-auto mb-0'> {/* Quitamos ps-2, añadimos mt-auto y mb-0 */}
                                                <span className='fw-bold'>Autor:</span> {newsItems[currentSlide].user?.name || 'Desconocido'}
                                            </p>
                                        </div>
                                    </div>   
                                </Link>
                                {/* Botón Siguiente */}
                                <div className="col-auto rounded-end bg-danger align-self-stretch d-flex align-items-center"> {/* Usamos col-auto */}
                                    <button className='bg-danger text-white border-0 h-100 ' onClick={nextSlide} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h1>›</h1></button>
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
        </Layout>
    );
}