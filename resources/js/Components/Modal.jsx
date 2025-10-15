// resources/js/Components/Modal.jsx

import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap'; // Importamos el modal de la librería

// Recibimos las mismas props: show para mostrar/ocultar y onClose para la función de cierre.
export default function Modal({ children, show = false, onClose = () => {} }) {
    return (
        <BootstrapModal show={show} onHide={onClose} centered>
            {/* onHide es el evento de react-bootstrap para cuando se intenta cerrar el modal */}
            <BootstrapModal.Body>
                {/* Aquí renderizamos el formulario que pasamos como hijo */}
                {children}
            </BootstrapModal.Body>
        </BootstrapModal>
    );
}