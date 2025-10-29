import React, { useState, useEffect } from 'react'; // Importa useEffect
import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { ChatLeftDots, ClipboardData, JournalText, PersonCircle } from 'react-bootstrap-icons';
import DashboardOptions from '@/Components/Dashboard';

// Ayudante para formatear fechas (opcional pero buena práctica)
const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Asegúrate de recibir las nuevas props 'featuredNote' y 'todayNotes'
export default function Dashboard({ auth, stats, recentNotes, recentUsers, recentComments }) {



    const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout>
            <Head title="Panel de control" /> {/* Título cambiado */}
            <div className='d-flex'>
                <DashboardOptions />

                <div className='bg-light bg-opacity-50 rounded p-3 container-fluid'>


                    <div className='d-flex justify-content-between mb-3 text-center'>
                        <div className='bg-accent1 bg-opacity-50 rounded p-3 px-5 border border-dark border-opacity-75 border-2'>
                            <h1 className='fw-bold'>{stats.notes}</h1>
                            <p className='fs-5'>Notas publicadas</p>
                        </div>
                        <div className='bg-accent1 bg-opacity-50 rounded p-3 px-5 border border-dark border-opacity-75 border-2'>
                            <h1 className='fw-bold'>{stats.users}</h1>
                            <p className='fs-5'>Usuarios registrados</p>
                        </div>
                        <div className='bg-accent1 bg-opacity-50 rounded p-3 px-5 border border-dark border-opacity-75 border-2'>
                            <h1 className='fw-bold'>{stats.comments}</h1>
                            <p className='fs-5'>Comentarios publicados</p>

                        </div>
                    </div>

                    <div className='d-flex'>
                        <div className='rounded overflow-hidden w-75 me-3'>
                            <table className='table align-middle mb-0 border border-dark border-opacity-25 border-2'>
                                <thead>
                                    {/* Fila 1: Título */}
                                    {/* 3. Quitamos el 'border', aumentamos padding a 'p-4', y añadimos 'mb-0' al h3 */}
                                    <tr>
                                        <th className='bg-warning p-3 px-3 h3 mb-0 fw-bold text-dark' colSpan="5">Notas recientes</th>
                                    </tr>
                                    {/* Fila 2: Cabeceras */}
                                    {/* 4. Quitamos 'border', aumentamos padding a 'p-3' y añadimos 'fw-bold' */}
                                    <tr className='text-center border-top border-dark border-opacity-25'>
                                        <th className='p-3 text-start bg-secondary bg-opacity-50 fw-bold text-dark'>Portada</th>
                                        <th className='p-3 text-start bg-secondary bg-opacity-50 fw-bold text-dark'>Título</th>
                                        <th className='p-3 text-start bg-secondary bg-opacity-50 fw-bold text-dark'>Autor</th>
                                        <th className='p-3 text-start bg-secondary bg-opacity-50 fw-bold text-dark'>Secciones</th>
                                        <th className='p-3 text-start bg-secondary bg-opacity-50 fw-bold text-dark'>Fecha</th>
                                    </tr>
                                </thead>
                                {/* El <tbody> ahora es hijo directo de la tabla principal */}
                                <tbody className='fs-5'>
                                    {recentNotes.map((note) => (
                                        <tr key={note.note_id} className='text-center'>
                                            {/* 7. Quitamos 'border' y 'p-2'. 'p-0' para que la imagen toque el borde. */}
                                            <td className='p-0 bg-accent1 bg-opacity-50 '>
                                                <img src={`/storage/${note.portrait_url}`} alt={note.headline} style={{ width: '15.7rem', height: 'auto', display: 'block' }} />
                                            </td>
                                            {/* 8. Padding 'p-3' para más espacio. Quitamos 'fs-5' (ya está en tbody) y 'border' */}
                                            <td className='p-3 text-start bg-accent1 bg-opacity-50'>{note.headline}</td>
                                            <td className='p-3 text-start bg-accent1 bg-opacity-50'>{note.user?.name || 'N/A'}</td>
                                            <td className='p-3 text-start bg-accent1 bg-opacity-50'>
                                                {note.sections.slice(0, 2).map(s => s.name).join(', ')}
                                            </td>
                                            <td className='p-3 text-start bg-accent1 bg-opacity-50'>{formatDate(note.publish_date)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* --- TABLA 2: USUARIOS NUEVOS (CORREGIDA) --- */}
                        {/* 1. Esta también es UNA sola tabla */}

                        <div className='rounded shadow-sm overflow-hidden bg-opacity-75 w-25 d-flex flex-column'> {/* Mantenemos flexbox aquí */}
                            <table className='table align-middle mb-0 h-100 border border-dark border-opacity-25 border-2'> {/* Mantenemos h-100 aquí */}
                                <thead className='align-middle'>
                                    {/* Fila 1: Título */}
                                    {/* 3. Quitamos el 'border', aumentamos padding a 'p-4', y añadimos 'mb-0' al h3 */}
                                    <tr>
                                        <th className='bg-warning p-3 px-3 h3 mb-0 fw-bold text-dark' colSpan="5">Usuarios recientes</th>
                                    </tr>
                                    {/* Fila 2: Cabeceras */}
                                    {/* 4. Quitamos 'border', aumentamos padding a 'p-3' y añadimos 'fw-bold' */}
                                    <tr className='text-center border-top'>
                                        <th className='p-1 px-3 text-start bg-secondary bg-opacity-50 fw-bold text-dark'>Usuario</th>
                                        <th className='p-1 px-3 text-start bg-secondary bg-opacity-50 fw-bold text-dark'>Rol</th>
                                    </tr>
                                </thead>

                                {/* --- CAMBIO 1: Quitamos clases flex del tbody --- */}
                                <tbody className='fs-5'>
                                    {recentUsers.map((user) => (
                                        < tr key={user.user_id} className='text-center  ' >
                                            <td className='py-4 px-3 text-start align-middle bg-accent1 bg-opacity-50'> {user.name}</td>
                                            <td className='py-4 px-3 text-start align-middle bg-accent1 bg-opacity-50'>{user.role?.name || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- TABLA 3: COMENTARIOS RECIENTES (CORREGIDA) --- */}
                    {/* 1. Aplicamos la misma corrección estructural aquí */}
                    <div className='rounded shadow-sm overflow-hidden bg-opacity-75 w-100 mt-3 '>
                        {/* 2. Tabla 'table-hover' y 'align-middle' */}
                        <table className='table align-middle mb-0 border border-dark border-opacity-25 border-2'>
                            <thead className=''>
                                {/* Fila 1: Título */}
                                {/* 3. Padding 'p-4' y 'mb-0' */}
                                <tr>
                                    <th className='bg-warning p-3 px-3 h3 mb-0 fw-bold text-dark' colSpan="3">Comentarios recientes</th>
                                </tr>
                                {/* Fila 2: Cabeceras */}
                                {/* 4. Padding 'p-3' y 'fw-bold' */}
                                <tr className='bg-opacity-50 text-center border-top border-dark border-opacity-25'>
                                    <th className='p-3 text-start bg-secondary bg-opacity-50 fw-bold text-dark'>Comentario</th>
                                    <th className='p-3 text-start bg-secondary bg-opacity-50 fw-bold text-dark'>Usuario</th>
                                    <th className='p-3 text-start bg-secondary bg-opacity-50 fw-bold text-dark'>Fecha</th>
                                </tr>
                            </thead>
                            {/* 5. 'fs-5' en el tbody */}
                            <tbody className='fs-5 '>
                                {recentComments.map((comment) => (
                                    <tr key={comment.comment_id} className='text-center  border-top border-dark border-opacity-25'>
                                        <td className='p-3 text-start bg-accent1 bg-opacity-50'>{comment.message.substring(0, 100)}...</td>
                                        <td className='p-3 text-start bg-accent1 bg-opacity-50'>{comment.user?.username || 'N/A'}</td>
                                        <td className='p-3 text-start bg-accent1 bg-opacity-50'>{formatDate(comment.publish_date)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div >

        </Layout >
    );
}