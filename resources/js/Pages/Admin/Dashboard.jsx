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
                        <div className='bg-accent1 bg-opacity-75 rounded p-3 px-5 border border-dark'>
                            <h1>{stats.notes}</h1>
                            <p>Notas publicadas</p>
                        </div>
                        <div className='bg-accent1 bg-opacity-75 rounded p-3 px-5 border border-dark'>
                            <h1>{stats.users}</h1>
                            <p>Usuarios registrados</p>
                        </div>
                        <div className='bg-accent1 bg-opacity-75 rounded p-3 px-5 border border-dark'>
                            <h1>{stats.comments}</h1>
                            <p>Comentarios publicados</p>

                        </div>
                    </div>

                    <div className='d-flex'>
                        <table className=' bg-accent1 bg-opacity-75 w-75 me-3'>
                            <thead className='bg-warning'>
                                {/* Fila 1: Título */}
                                <tr className='border border-dark'>
                                    {/* 2. Añadimos colSpan="5" para que el título ocupe las 5 columnas */}
                                    <th className='p-3 h3' colSpan="5">Notas recientes</th>
                                </tr>
                                {/* Fila 2: Cabeceras de columna (movidas aquí desde la tabla anidada) */}
                                <tr className='bg-secondary bg-opacity-50 border border-dark text-center'>
                                    <th className='p-2 border border-dark'>Portada</th>
                                    <th className='p-2 border border-dark'>Título</th>
                                    <th className='p-2 border border-dark'>Autor</th>
                                    <th className='p-2 border border-dark'>Secciones</th>
                                    <th className='p-2 border border-dark'>Fecha</th>
                                </tr>
                            </thead>
                            {/* El <tbody> ahora es hijo directo de la tabla principal */}
                            <tbody>
                                {recentNotes.map((note) => (
                                    <tr key={note.note_id} className='border border-dark'>
                                        <td className='align-middle border border-dark'>
                                            <img src={`/storage/${note.portrait_url}`} alt={note.headline} style={{ width: '15.7rem', height: 'auto' }} />
                                        </td>
                                        <td className='p-2 align-middle border border-dark'>{note.headline}</td>
                                        <td className='p-2 align-middle border border-dark'>{note.user?.name || 'N/A'}</td>
                                        <td className='p-2 align-middle border border-dark'>
                                            {note.sections.slice(0, 2).map(s => s.name).join(', ')}
                                        </td>
                                        <td className='p-2 align-middle border border-dark'>{formatDate(note.publish_date)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* --- TABLA 2: USUARIOS NUEVOS (CORREGIDA) --- */}
                        {/* 1. Esta también es UNA sola tabla */}
                        <table className=' bg-accent1 bg-opacity-75 w-25 '>
                            <thead className='bg-warning'>
                                {/* Fila 1: Título */}
                                {/* 2. CORRECCIÓN DE DESFASE: El borde ahora está en el TR, igual que en la otra tabla */}
                                <tr className='border border-dark'>
                                    {/* 3. Añadimos colSpan="2" para que el título ocupe 2 columnas */}
                                    {/* 4. Quitamos el 'border' de aquí para alinear */}
                                    <th className='px-3 py-0 h3' colSpan="2">Usuarios nuevos</th>
                                </tr>
                                {/* Fila 2: Cabeceras */}
                                <tr className='bg-secondary bg-opacity-50 text-center'>
                                    <th className='px-2 py-0 border border-dark'>Nombre</th>
                                    <th className='px-2 py-0 border border-dark'>Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((user) => (
                                    <tr key={user.user_id} className='text-center border border-dark'>
                                        {/* 5. CORRECCIÓN ESPACIO VACÍO: Cambiamos 'p-5' por 'p-2' */}
                                        <td className='p-2 border border-dark'>{user.name}</td>
                                        <td className='p-2 border border-dark'>{user.role?.name || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- TABLA 3: COMENTARIOS RECIENTES (CORREGIDA) --- */}
                    {/* 1. Aplicamos la misma corrección estructural aquí */}
                    <table className=' bg-accent1 bg-opacity-75 w-100 mt-3'>
                        <thead className='bg-warning'>
                            {/* Fila 1: Título */}
                            <tr>
                                {/* 2. colSpan="3" para las 3 columnas */}
                                {/* 3. Añadimos 'border' al 'th' aquí para que sea consistente con las cabeceras de abajo */}
                                <th className='p-3 border border-dark h3' colSpan="3">Comentarios recientes</th>
                            </tr>
                            {/* Fila 2: Cabeceras */}
                            <tr className='bg-secondary bg-opacity-50 text-center'>
                                <th className='p-2 border border-dark'>Comentario</th>
                                <th className='p-2 border border-dark'>Usuario</th>
                                <th className='p-2 border border-dark'>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentComments.map((comment) => (
                                <tr key={comment.comment_id}>
                                    {/* 4. CORRECCIÓN ESPACIO VACÍO: Cambiamos 'p-5' por 'p-2' */}
                                    <td className='p-2 border border-dark'>{comment.message.substring(0, 100)}...</td>
                                    <td className='p-2 border border-dark'>{comment.user?.username || 'N/A'}</td>
                                    <td className='p-2 border border-dark'>{formatDate(comment.publish_date)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>

            </div>

        </Layout>
    );
}