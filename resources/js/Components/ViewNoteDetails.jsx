// resources/js/Components/ViewNoteDetails.jsx

import React from 'react';

// Función auxiliar para determinar el tipo de archivo y renderizar el elemento correcto.
// La hacemos un componente reutilizable para no repetir código.
export const MediaRenderer = ({ file, index }) => {
    if (!file) {
        return null;
    }

    const getFileType = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
        if (['mp4', 'webm', 'mov'].includes(extension)) return 'video';
        if (['mp3', 'wav', 'ogg'].includes(extension)) return 'audio';
        return 'unknown';
    };

    const fileType = getFileType(file.url);
    const fullUrl = `/storage/${file.url}`;

    switch (fileType) {
        case 'image':
            return (
                <img src={fullUrl} className="img-fluid rounded my-3" alt={`Contenido multimedia ${index + 1}`} />
            );
        case 'video':
            return (
                <video controls className="w-100 rounded my-3">
                    <source src={fullUrl} type={`video/${file.url.split('.').pop()}`} />
                    Tu navegador no soporta la etiqueta de video.
                </video>
            );
        case 'audio':
            return (
                <div className="my-3">
                    <audio controls className="w-100">
                        <source src={fullUrl} type={`audio/${file.url.split('.').pop()}`} />
                        Tu navegador no soporta la etiqueta de audio.
                    </audio>
                </div>
            );
        default:
            return (
                <div className="my-3">
                    <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                        Descargar archivo desconocido
                    </a>
                </div>
            );
    }
};

export default function ViewNoteDetails({ note, onClose }) {
    return (
        <div>
            {/* Título de la nota */}
            <div className='modal-header'>
                <h2>{note.headline}</h2>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            

            {/* Imagen de portada */}
            <img src={`/storage/${note.portrait_url}`} className="img-fluid rounded mb-3" alt="Portada" />

            {/* Detalles (Autor y Fecha) */}
            <div className="mb-3 text-muted">
                Por: <strong>{note.user ? note.user.name : 'Desconocido'}</strong>
                <br />
                Publicado el: {new Date(note.publish_date).toLocaleDateString()}
            </div>

            {/* Secciones */}
            <div className="mb-3">
                {Array.isArray(note.sections) && note.sections.map((section) => (
                    <span key={section.section_id} className="badge bg-primary me-1">
                        {section.name}
                    </span>
                ))}
            </div>
            <hr/>
            
            {/* Cuerpo de la nota */}
            <p><strong>{note.lead}</strong></p>
            <p>{note.body}</p>

            {/* ✅ RENDERIZA EL PRIMER ARCHIVO MULTIMEDIA AQUÍ */}
            {/* Comprobamos que el arreglo 'media' exista y que tenga un elemento en la posición 0 */}
            {Array.isArray(note.media) && note.media[0] && (
                <MediaRenderer file={note.media[0]} index={0} />
            )}

            <p>{note.closing}</p>
            
            {/* ✅ RENDERIZA EL SEGUNDO ARCHIVO MULTIMEDIA AQUÍ */}
            {/* Comprobamos que el arreglo 'media' exista y que tenga un elemento en la posición 1 */}
            {Array.isArray(note.media) && note.media[1] && (
                 <MediaRenderer file={note.media[1]} index={1} />
            )}
            
            {/* Botón de cierre */}
            <div className="text-end mt-4">
                <button onClick={onClose} className="btn btn-secondary">Cerrar</button>
            </div>
        </div>
    );
}