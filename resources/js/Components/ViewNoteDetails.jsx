// resources/js/Components/ViewNoteDetails.jsx

import React from 'react';

export default function ViewNoteDetails({ note, onClose }) {
    return (
        <div className="p-4">
            {/* Título de la nota */}
            <h2 className="h3 mb-3">{note.headline}</h2>

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

            {/* Cuerpo de la nota */}
            <p><strong>{note.lead}</strong></p>
            <p>{note.body}</p>
            <p>{note.closing}</p>
            
            {/* Botón de cierre */}
            <div className="text-end mt-4">
                <button onClick={onClose} className="btn btn-secondary">Cerrar</button>
            </div>
        </div>
    );
}