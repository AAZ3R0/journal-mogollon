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
export default function Dashboard({ auth, stats, recentNotes, recentUsers, recentComments}) {
    
    

    const Layout = auth.user? AuthenticatedLayout : GuestLayout;

    return (
        <Layout>
            <Head title="Panel de control" /> {/* Título cambiado */}
            <div className='d-flex'>
                <DashboardOptions/>

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
                        <table className='bg-accent1 bg-opacity-75 w-75 me-3'>
                            <thead className='bg-warning'>
                                <tr className='border border-dark'>
                                    <th className='p-3 h3'>Notas recientes</th>
                                </tr>
                            </thead>
                            <table className='w-100'>
                                <thead className='bg-secondary bg-opacity-50 border border-dark text-center'>
                                    <tr>
                                        <th className='p-2 border border-dark'>Portada</th>
                                        <th className='p-2 border border-dark'>Título</th>
                                        <th className='p-2 border border-dark'>Autor</th>
                                        <th className='p-2 border border-dark'>Secciones</th>
                                        <th className='p-2 border border-dark'>Fecha</th>
                                    </tr>
                                </thead>
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
                        </table>

                        <table className='bg-accent1 bg-opacity-75 w-25 '>
                            <thead className='bg-warning'>
                                <tr>
                                    <th className='p-3 border border-dark h3'>Usuarios nuevos</th>
                                </tr>
                            </thead>
                            <table className='w-100'>
                                <thead className='bg-secondary bg-opacity-50'>
                                    <tr className='text-center'>
                                        <th className='p-2 border border-dark'>Nombre</th>
                                        <th className='p-2 border border-dark'>Rol</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map((user) => (
                                        <tr key={user.user_id} className='text-center border border-dark'>
                                            <td className='p-5 border border-dark'>{user.name}</td>
                                            <td className='p-5 border border-dark'>{user.role?.name || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </table>
                    </div>
                        <table className='bg-accent1 bg-opacity-75 w-100 mt-3'>
                            <thead className='bg-warning'>
                                <tr>
                                    <th className='p-3 border border-dark h3'>Comentarios recientes</th>
                                </tr>
                            </thead>
                            <table className='w-100'>
                                <thead className='bg-secondary bg-opacity-50'>
                                    <tr className='text-center'>
                                        <th className='p-2 border border-dark'>Comentario</th>
                                        <th className='p-2 border border-dark'>Usuario</th>
                                        <th className='p-2 border border-dark'>Fecha</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentComments.map((comment) => (
                                        <tr key={comment.comment_id}>
                                            <td className='p-5 border border-dark'>{comment.message.substring(0, 100)}...</td>
                                            <td className='p-5 border border-dark'>{comment.user?.username || 'N/A'}</td>
                                            <td className='p-5 border border-dark'>{formatDate(comment.publish_date)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </table>
                    
                </div>
                
            </div>
            
        </Layout>
    );
}