// resources/js/Components/Footer.jsx
import ApplicationLogo from '@/Components/ApplicationLogo';
import React from 'react';

export default function Footer() {
    return (
        // La clase 'mt-auto' es clave aquí. Funciona junto con el 'd-flex flex-column'
        // del layout principal para empujar este footer al final de la página.
        <footer className="bg-accent1 bg-opacity-75 text-white text-center mt-auto">
            <div className="container">
                <ApplicationLogo style={{ height: '200px', width: 'auto' }}>

                </ApplicationLogo>
            </div>
        </footer>
    );
}