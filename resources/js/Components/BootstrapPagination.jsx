import React from 'react';
import { Pagination } from 'react-bootstrap';
import { Link } from '@inertiajs/react';

// Función auxiliar para limpiar las etiquetas &laquo; y &raquo;
const cleanLabel = (label) => {
    return label.replace(/&laquo;/g, '‹').replace(/&raquo;/g, '›');
};

export default function BootstrapPagination({ links = [] }) {
    // No renderizar nada si no hay suficientes enlaces para paginar
    if (links.length < 3) {
        return null;
    }

    return (
        <Pagination className="justify-content-center mt-3 flex-wrap-wrap rounded-pill">
            {links.map((link, index) => (
                <Pagination.Item
                    key={index}
                    // Usa el componente <Link> de Inertia si hay una URL
                    // Usa un <span> si no hay URL (como en "...")
                    as={link.url ? Link : 'span'} 
                    href={link.url}
                    active={link.active}
                    disabled={!link.url}
                    preserveScroll // Mantiene la posición del scroll al cambiar de página
                >
                    {cleanLabel(link.label)}
                </Pagination.Item>
            ))}
        </Pagination>
    );
}