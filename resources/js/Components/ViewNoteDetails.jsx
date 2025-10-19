import React, { useMemo } from 'react';

// Este componente auxiliar no necesita cambios, pero se incluye para que el archivo esté completo.
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
            return <img src={fullUrl} className="img-fluid rounded my-3" alt={`Contenido multimedia ${index + 1}`} />;
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
                    <a href={fullUrl} target="_blank" rel="noopener noreferrer">Descargar archivo desconocido</a>
                </div>
            );
    }
};

export default function ViewNoteDetails({ note, onClose }) {

    const leadExtensions = useMemo(
        ()=> (note.extensions || []).filter(ext => ext.type === 'lead'),
        [note.extensions]
    );
    const bodyExtensions = useMemo(
        () => (note.extensions || []).filter(ext => ext.type === 'body'),
        [note.extensions]
    );
    const closingExtensions = useMemo(
        () => (note.extensions || []).filter(ext => ext.type === 'closing'),
        [note.extensions]
    );


    // Leemos los archivos directamente de los "espacios" (slots) que nos da el backend.
    const mediaForSlot1 = note.media_by_position ? (note.media_by_position['0'] || null) : null;
    const mediaForSlot2 = note.media_by_position ? (note.media_by_position['1'] || null) : null;

    return (
        <div>
            <div className="modal-header border-0 pb-0">
                <h2 className='modal-title'>Detalles de la nota</h2>
                 <button type="button" className="btn-close btn btn-lg" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <h4 className='mb-3'>{note.headline}</h4>
                <img src={`/storage/${note.portrait_url}`} className="img-fluid rounded mb-3" alt="Portada" />
                <div className="mb-3 text-muted">
                    Por: <strong>{note.user ? note.user.name : 'Desconocido'}</strong>
                    <br />
                    Publicado el: {new Date(note.publish_date).toLocaleDateString()}
                </div>
                <div className="mb-3">
                    {Array.isArray(note.sections) && note.sections.map((section) => (
                        <span key={section.section_id} className="badge bg-primary me-1">
                            {section.name}
                        </span>
                    ))}
                </div>
                <hr/>

                {/* SECCIÓN DE ENTRADA (LEAD) */}
                <p style={{textAlign: 'justify'}}><strong>{note.lead}</strong></p>
                {leadExtensions.map(ext => (
                    <div key={ext.note_extension_id} className="ms-4 border-start border-2 ps-3 mb-3">
                        <p>{ext.content}</p>
                        {ext.media && <MediaRenderer file={ext.media} index={ext.position} />}
                    </div>
                ))}
                {/* SECCIÓN DE CUERPO (BODY) */}
                <p style={{textAlign: 'justify'}}>{note.body}</p>
                {mediaForSlot1 && <MediaRenderer file={mediaForSlot1} index={0} />}
                {bodyExtensions.map(ext => (
                    <div key={ext.note_extension_id} className="ms-4 border-start border-2 ps-3 mb-3">
                        <p>{ext.content}</p>
                        {ext.media && <MediaRenderer file={ext.media} index={ext.position} />}
                    </div>
                ))}
                {/* SECCIÓN DE REMATE (CLOSING) */}
                <p style={{textAlign: 'justify'}}>{note.closing}</p>
                {mediaForSlot2 && <MediaRenderer file={mediaForSlot2} index={1} />}
                {closingExtensions.map(ext => (
                    <div key={ext.note_extension_id} className="ms-4 border-start border-2 ps-3 mb-3">
                        <p>{ext.content}</p>
                        {ext.media && <MediaRenderer file={ext.media} index={ext.position} />}
                    </div>
                ))}
            </div>
        </div>
    );
}