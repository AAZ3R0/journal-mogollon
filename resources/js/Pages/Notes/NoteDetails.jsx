import React , { useState, useEffect } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout'; // Use your guest layout
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MediaRenderer } from '@/Components/ViewNoteDetails'; // Reuse the renderer
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import CommentItem from '@/Components/CommentItem';
import { formatDistanceToNow } from 'date-fns'; // Importa la función de date-fns
import { es } from 'date-fns/locale';


// Helper function (same as in Welcome.jsx)
const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Use 'long' month for detail page
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

export default function Show({ note, relatedNotes = [] }) { // Receives the 'note' prop from the controller

    const { auth } = usePage().props;

    // Hook useForm para el nuevo comentario
    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
    });

    // Función para enviar el nuevo comentario
    const submitComment = (e) => {
        e.preventDefault();
        post(route('comments.store', note.note_id), {
            preserveScroll: true, // Mantiene el scroll al recargar
            onSuccess: () => reset('message'), // Limpia el textarea después de enviar
        });
    };

    // Find media files by position (same logic as before)
    const mediaForSlot1 = Array.isArray(note.media) ? note.media.find(m => m.position === 0) : null;
    const mediaForSlot2 = Array.isArray(note.media) ? note.media.find(m => m.position === 1) : null;

    // Filter extensions by type (same logic as before)
    const leadExtensions = (note.extensions || []).filter(ext => ext.type === 'lead');
    const bodyExtensions = (note.extensions || []).filter(ext => ext.type === 'body');
    const closingExtensions = (note.extensions || []).filter(ext => ext.type === 'closing');


    const [relatedIndex, setRelatedIndex] = useState(0); // Índice del primer artículo visible (0, 2, 4...)
    const relatedItemsPerPage = 2; // Mostrar de 2 en 2

    // Reinicia el índice si las notas relacionadas cambian
    useEffect(() => {
        setRelatedIndex(0);
    }, [relatedNotes]);

    const nextRelated = () => {
        // Avanza al siguiente par, asegurándose de no pasar del final
        setRelatedIndex(prev => Math.min(prev + relatedItemsPerPage, relatedNotes.length - relatedItemsPerPage));
    };

    const prevRelated = () => {
        // Retrocede al par anterior, asegurándose de no ir antes del inicio
        setRelatedIndex(prev => Math.max(prev - relatedItemsPerPage, 0));
    };

    // Calcula qué notas mostrar en la página actual del carrusel
    const currentRelatedNotes = relatedNotes.slice(relatedIndex, relatedIndex + relatedItemsPerPage);

    const Layout = auth.user? AuthenticatedLayout : GuestLayout;

    return (
        <Layout>
            {/* Set the page title */}
            <Head title={note.headline} />

            <div className="container my-5">
                <article className="bg-white bg-opacity-50 p-4 p-md-5 rounded shadow-sm"> {/* Added styling */}
                    {/* Header Section */}
                    <header className="mb-4">
                        {/* Sections */}
                        <div className="mb-2">
                            {Array.isArray(note.sections) && note.sections.map((section) => (
                                <span key={section.section_id} className="badge bg-primary me-2 fs-6"> {/* Larger badge */}
                                    {section.name}
                                </span>
                            ))}
                        </div>
                        {/* Headline */}
                        <h1 className="fw-bold mb-3" style={{ fontSize: '2.8rem' }}>{note.headline}</h1>
                        {/* Author and Date */}
                        <div className="text-muted mb-3">
                            <strong>{note.user ? note.user.name : 'Desconocido'}</strong> | <strong>{formatDate(note.publish_date)}</strong> 
                        </div>
                        {/* Lead */}
                        <p className="fst-italic display-6" style={{fontSize:'1.5rem'}}>{note.lead}</p>

                        
                        {/* Portrait Image */}
                        <img src={`/storage/${note.portrait_url}`} className="img-fluid rounded mb-4" style={{width:'100%', height: '40rem'}} alt="Portada" />
                    </header>

                    {/* Content Section */}
                    <section className="fs-5" style={{ textAlign: 'justify' }}> {/* Increase font size */}

                        {leadExtensions.map(ext => (
                            <div key={ext.note_extension_id} className="ms-md-4 my-3 border-start border-2 ps-3">
                                <p>{ext.content}</p>
                                <div style={{width:'50%'}}>
                                    {ext.media && <MediaRenderer file={ext.media} index={ext.position} />}
                                </div>
                                
                            </div>
                        ))}

                        {/* Body */}
                        <p>{note.body}</p>
                        {mediaForSlot1 && <div className="my-3" style={{width:'75%'}}><MediaRenderer file={mediaForSlot1} index={0} /></div>}
                        {bodyExtensions.map(ext => (
                            <div key={ext.note_extension_id} className="ms-md-4 my-3 border-start border-2 ps-3">
                                <p>{ext.content}</p>
                                <div style={{width:'50%'}}>
                                    {ext.media && <MediaRenderer file={ext.media} index={ext.position} />}
                                </div>
                                
                            </div>
                        ))}

                        {/* Closing */}
                        <p>{note.closing}</p>
                        {mediaForSlot2 && <div className="my-3"><MediaRenderer file={mediaForSlot2} index={1} /></div>}
                        {closingExtensions.map(ext => (
                            <div key={ext.note_extension_id} className="ms-md-4 my-3 border-start border-2 ps-3">
                                <p>{ext.content}</p>
                                <div style={{width:'50%'}}>
                                    {ext.media && <MediaRenderer file={ext.media} index={ext.position} />}
                                </div>
                                
                            </div>
                        ))}
                    </section>
                    {/* You could add a comments section here later */}
                    <div className='bg-dark bg-opacity-25 rounded pb-5'>
                        <div className='container'>
                            <h3 className='fw-bold text-decoration-underline text-black p-3'>Notas relacionadas</h3>
                            <div className=''>
                                {/* Agregar un carrusel parecido al del home page con noticias relacionadas a esta nota a partir de sus secciones */}
                                {relatedNotes.length > 0 && (
                                    <div className='mt-5 pt-4 border-top rounded p-3'> {/* Contenedor Estilizado */}
                                        
                                        <div className="position-relative">
                                            <div className='row g-3 align-items-center justify-content-center'> {/* Fila principal */}
                                                
                                                {/* Botón Anterior */}
                                                <div className="col-auto bg-danger rounded-start py-5">
                                                    <button 
                                                        className='bg-danger border-0 text-white' 
                                                        onClick={prevRelated} 
                                                        disabled={relatedIndex === 0} // Deshabilitado si está al principio
                                                        style={{ width: '2.5rem', height: '10.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        aria-label="Notas relacionadas anteriores"
                                                    >
                                                        <h1>‹</h1>
                                                    </button>
                                                </div>

                                                {/* Contenedor de las Tarjetas (Ocupa el espacio restante) */}
                                                <div className="col">
                                                    <div className="row">
                                                        {currentRelatedNotes.map((relatedNote) => (
                                                            <div className='col-md-6' key={relatedNote.note_id}> 
                                                                <div className="card h-100 shadow-sm bg-light bg-opacity-50"> 
                                                                    <Link href={route('notes.public.show', relatedNote.note_id)}>
                                                                        <img src={`/storage/${relatedNote.portrait_url}`} className="card-img-top" alt={`Portada de ${relatedNote.headline}`} style={{ height:'9rem',objectFit: 'cover' }} />
                                                                    </Link>
                                                                    <div className="card-body d-flex flex-column">
                                                                        <h5 className="card-title fw-bold">
                                                                            <Link href={route('notes.public.show', relatedNote.note_id)} className="text-decoration-none text-dark stretched-link">
                                                                                {relatedNote.headline}
                                                                            </Link>
                                                                        </h5>
                                                                        <div className="mt-auto text-muted small">
                                                                            <span>{relatedNote.sections?.[0]?.name || 'General'}</span> | <span>{formatDate(relatedNote.publish_date)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {/* Relleno si solo hay una nota en la última página */}
                                                        {currentRelatedNotes.length === 1 && <div className="col-md-6 d-none d-md-block"></div>} 
                                                    </div>
                                                </div>

                                                {/* Botón Siguiente */}
                                                <div className="col-auto bg-danger rounded-end py-5">
                                                    <button 
                                                        className='bg-danger border-0 text-white' 
                                                        onClick={nextRelated} 
                                                        disabled={relatedIndex >= relatedNotes.length - relatedItemsPerPage} // Deshabilitado si está al final
                                                        style={{ width: '2.5rem', height: '10.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        aria-label="Notas relacionadas siguientes"
                                                    >
                                                        <h1>›</h1>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                    </div>

                    {/* SECCIÓN CAJA DE COMENTARIOS*/}

                    <div className='bg-dark bg-opacity-25 rounded pb-3 mt-5 pt-3'>
                        <div className='container'>
                            <h3 className='fw-bold text-black mb-4 p-3'>Comentarios ({note.comments ? note.comments.length : 0})</h3>

                            {/* Formulario para añadir comentario (solo si está autenticado) */}
                            {auth.user ? (
                                <div className='bg-accent1 p-3 rounded mb-4 shadow-sm'>
                                    <h5 className='mb-2'>Deja tu comentario:</h5>
                                    <form onSubmit={submitComment}>
                                        <textarea 
                                            className={`form-control ${errors.message ? 'is-invalid' : ''}`} 
                                            rows="4"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder='Escribe tu opinión...'
                                        ></textarea>
                                        <InputError message={errors.message} className="mt-2" />
                                        <div className='d-flex justify-content-end mt-2'>
                                            <PrimaryButton className='btn btn-primary rounded-pill' disabled={processing}>
                                                {processing ? 'Enviando...' : 'Comentar'}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="alert alert-secondary text-center">
                                    <Link href={route('login')}>Inicia sesión</Link> para dejar un comentario.
                                </div>
                            )}

                            {/* Lista de comentarios existentes */}
                            
                                
                                {note.comments && note.comments.length > 0 ? (
                                    note.comments.map(comment => (
                                        // ✅ Pasa el ID del usuario actual como prop
                                        <div className='bg-accent1 p-3 rounded shadow-sm mb-3'>
                                            <CommentItem 
                                                key={comment.comment_id} 
                                                comment={comment} 
                                                authUserId={auth.user?.user_id} // Pasa el ID (o null si es invitado)
                                            />
                                            </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted">Aún no hay comentarios. ¡Sé el primero!</p>
                                )}
                               


                            
                            
                        </div>
                    </div>
                </article>
            </div>
        </Layout>
    );
}