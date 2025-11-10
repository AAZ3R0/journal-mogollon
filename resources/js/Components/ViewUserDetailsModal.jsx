import React from 'react';

// Formateador de fecha
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

export default function ViewUserDetailsModal({ user, onClose }) {
    return (
        <div className="p-lg-4">
            <div className="modal-header border-0  pb-3">
                <h2 className="modal-title fw-bold">Detalles del usuario</h2>
                <button type="button" className="btn-close btn btn-lg" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body bg-light bg-opacity-50 rounded">
                <div className="row">
                    <div className="col-md-6">
                        <strong className="text-muted">Nombre de Usuario:</strong>
                        <p className="fs-5">@{user.username}</p>
                    </div>
                    <div className="col-md-6">
                        <strong className="text-muted">Rol:</strong>
                        <p className="fs-5">{user.role ? user.role.name : 'N/A'}</p>
                    </div>
                </div>
                <div className="row mt-3">
                    <div>
                        <strong className="text-muted">Nombre:</strong>
                        <p className='fs-5'>{user.name}</p>
                    </div>
                    <div className="col-12">
                        <strong className="text-muted">Correo Electrónico:</strong>
                        <p className="fs-5">{user.email}</p>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <strong className="text-muted">Miembro desde:</strong>
                        <p className="fs-5">{formatDate(user.created_at)}</p>
                    </div>
                </div>
                
                <hr />
                
                <div className="row mt-3 text-center">
                    <div className="col-6">
                        <h4 className="fw-bold">{user.notes_count}</h4>
                        <span className="text-muted">Notas Creadas</span>
                    </div>
                    <div className="col-6">
                        <h4 className="fw-bold">{user.comments_count}</h4>
                        <span className="text-muted">Comentarios Hechos</span>
                    </div>
                </div>
            </div>
        </div>
    );
}