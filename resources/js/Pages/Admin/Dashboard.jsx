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
export default function Dashboard({ auth, laravelVersion, phpVersion }) {
    
    

    const Layout = auth.user? AuthenticatedLayout : GuestLayout;

    return (
        <Layout>
            <Head title="Inicio" /> {/* Título cambiado */}
            <div className='bg-light bg-opacity-50 p-3 rounded'>
                <h1>Panel de control</h1>
            </div>
            
        </Layout>
    );
}