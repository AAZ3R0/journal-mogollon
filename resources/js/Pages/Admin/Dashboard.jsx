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
            <div className='row'>
                <DashboardOptions/>

                <div className='bg-light bg-opacity-50 rounded p-3 col ms-3'>


                    <div className='row g-0 d-flex justify-content-between mb-3 text-center'>
                        <div className='col-md-12 col-lg bg-accent1 bg-opacity-50 rounded-4 p-3 px-5 me-3 mb-3 mb-lg-0 border border-dark border-opacity-75 border-2'>
                            <h1 className='fw-bold'>{stats.notes}</h1>
                            <p className=''>Notas publicadas</p>
                        </div>
                        <div className='col-md-12 col-lg bg-accent1 bg-opacity-50 rounded-4 p-3 px-5 me-3 mb-3 mb-lg-0 border border-dark border-opacity-75 border-2'>
                            <h1 className='fw-bold'>{stats.users}</h1>
                            <p className=''>Usuarios registrados</p>
                        </div>
                        <div className='col-md-12 col-lg bg-accent1 bg-opacity-50 rounded-4 p-3 px-5 border border-dark border-opacity-75 border-2'>
                            <h1 className='fw-bold'>{stats.comments}</h1>
                            <p className=''>Comentarios publicados</p>

                        </div>
                    </div>

                    <div className='row g-0'>
                        <div className='rounded overflow-hidden me-3 d-none d-lg-block'>
                            <table className='table col align-middle mb-0 border border-dark border-opacity-25 border-2 mb-3'>
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

                        <div className='rounded overflow-hidden me-3 row g-0 d-none d-lg-block'>
                            <table className='table  border border-dark border-opacity-25 border-2 mb-3'>
                                <thead>
                                    {/* Fila 1: Título */}
                                    {/* 3. Quitamos el 'border', aumentamos padding a 'p-4', y añadimos 'mb-0' al h3 */}
                                    <tr>
                                        <th className='bg-warning p-3 px-3 h3 mb-0 fw-bold text-dark' colSpan="5">Usuarios recientes</th>
                                    </tr>
                                    {/* Fila 2: Cabeceras */}
                                    {/* 4. Quitamos 'border', aumentamos padding a 'p-3' y añadimos 'fw-bold' */}
                                    <tr className='text-center border-top border-dark border-opacity-25'>
                                        <th className='p-3 text-start bg-secondary bg-opacity-50 fw-bold text-dark'>Usuario</th>
                                        <th className='p-3 text-start bg-secondary bg-opacity-50 fw-bold text-dark'>Rol</th>
                                    </tr>
                                </thead>
                                {/* El <tbody> ahora es hijo directo de la tabla principal */}
                                <tbody className='fs-5'>
                                    {recentUsers.map((user) => (
                                        <tr key={user.user_id} className='text-center'>
                                            {/* 8. Padding 'p-3' para más espacio. Quitamos 'fs-5' (ya está en tbody) y 'border' */}
                                            <td className='p-3 text-start bg-accent1 bg-opacity-50'>{user.username}</td>
                                            <td className='p-3 text-start bg-accent1 bg-opacity-50'>{user.role?.name || 'N/A'}</td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* --- TABLA 3: COMENTARIOS RECIENTES (CORREGIDA) --- */}
                    {/* 1. Aplicamos la misma corrección estructural aquí */}
                    <div className='rounded shadow-sm overflow-hidden bg-opacity-75 mt-3 d-none d-lg-block'>
                        {/* 2. Tabla 'table-hover' y 'align-middle' */}
                        <table className='table align-middle mb-0 border border-dark border-opacity-25 border-2'>
                            <thead className=''>
                                {/* Fila 1: Título */}
                                {/* 3. Padding 'p-4' y 'mb-0' */}
                                <tr>
                                    <th className='bg-warning p-3 px-3 h3 mb-0 fw-bold text-dark' colSpan="5">Comentarios recientes</th>
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
                                    <tr key={comment.comment_id} className='text-center border-top border-dark border-opacity-25'>
                                        <td className='p-3 text-start bg-accent1 bg-opacity-50'>{comment.message.substring(0, 100)}...</td>
                                        <td className='p-3 text-start bg-accent1 bg-opacity-50'>{comment.user?.username || 'N/A'}</td>
                                        <td className='p-3 text-start bg-accent1 bg-opacity-50'>{formatDate(comment.publish_date)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>






                    {/*Vista mobile*/}
                    <div className='d-lg-none '>
                        <div className='bg-warning text-center p-3 border border-dark'>
                            <h2 className='fw-bold text-dark'>Notas Recientes</h2>
                        </div>
                        <div className='bg-accent1 bg-opacity-50 p-2 border border-dark'>
                            {recentNotes.map((note) => {
                                return (
                                    <div className='card bg-dark bg-opacity-25 shadow-sm mb-3' key={note.note_id}>
                                        <div className='row g-0 '>
                                            <div className='col-4'>
                                                <img
                                                    src={`/storage/${note.portrait_url}`}
                                                    className='img-fluid rounded-start h-100 '
                                                    alt={note.headline}
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className='col-8'>
                                                <div className='card-body d-flex flex-column h-100 p-2'>
                                                    <h5 className='card-title fw-bold small mb-1'>{note.headline}</h5>
                                                    <p className='card-text text-muted mb-0' style={{ fontSize: '0.8rem' }}>
                                                        {note.user ? note.user.name : 'N/A'}
                                                    </p>
                                                    <p className='card-text text-muted' style={{ fontSize: '0.8rem' }}>
                                                        {new Date(note.publish_date).toLocaleDateString()}
                                                    </p>
                                                    <p className='card-text text-muted'>
                                                        {Array.isArray(note.sections) && note.sections.map((section) => (
                                                            <span key={section.section_id} className='badge bg-primary me-1 mb-1 small'>
                                                                {section.name}
                                                            </span>
                                                        ))}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/*Usuarios nuevos*/}

                        <div className='bg-warning text-center p-3 border border-dark mt-5'>
                            <h2 className='fw-bold text-dark'>Usuarios Recientes</h2>
                        </div>
                        <div className='bg-accent1 bg-opacity-50 p-2 border border-dark'>
                            {recentUsers.map((user) => {
                                return (
                                    <div className='card bg-dark bg-opacity-25 shadow-sm mb-3' key={user.user_id}>
                                        <div className='row g-0 '>
                                            <div className='col'>
                                                <div className='card-body d-flex flex-column h-100 p-2'>
                                                    <div className='row g-0 mb-2'>
                                                        <h5 className='col card-title fw-bold small mb-1'>Nombre:</h5>
                                                        <p className='col card-text text-muted mb-0 d-flex justify-content-end' style={{ fontSize: '0.8rem' }}>
                                                            {user.name}
                                                        </p>
                                                    </div>
                                                    <div className='row g-0 '>
                                                        <h5 className='col card-title fw-bold small mb-1'>Rol:</h5>
                                                        <p className='col card-text text-muted d-flex justify-content-end' style={{ fontSize: '0.8rem' }}>
                                                            {user.role?.name || 'N/A'}
                                                        </p>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/*Comentarios nuevos*/}

                        <div className='bg-warning text-center p-3 border border-dark mt-5'>
                            <h2 className='fw-bold text-dark'>Comentarios Recientes</h2>
                        </div>
                        <div className='bg-accent1 bg-opacity-50 p-2 border border-dark'>
                            {recentComments.map((comment) => {
                                return (
                                    <div className='card bg-dark bg-opacity-25 shadow-sm mb-3' key={comment.comment_id}>
                                        <div className='row g-0 '>
                                            <div className='col'>
                                                <div className='card-body d-flex flex-column h-100 p-2'>
                                                    <div className='row g-0 mb-4'>
                                                        <p className='col card-text text-dark mb-0 d-flex justify-content-center' style={{textAlign:'justify', textAlignLast:'left', hyphens:'auto'}}>
                                                            {comment.message}
                                                        </p>
                                                    </div>
                                                    <div className='row g-0 mb-2'>
                                                        <h5 className='col card-title fw-bold small mb-1'>Usuario:</h5>
                                                        <p className='col card-text text-muted d-flex justify-content-end' style={{ fontSize: '0.8rem' }}>
                                                            {comment.user?.name || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div className='row g-0 '>
                                                        <h5 className='col card-title fw-bold small mb-1'>Fecha:</h5>
                                                        <p className='col card-text text-muted d-flex justify-content-end' style={{ fontSize: '0.8rem' }}>
                                                            {formatDate(comment.publish_date)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>

            </div >

        </Layout >
    );
}