import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardOptions from '@/Components/Dashboard';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import { TrashFill } from 'react-bootstrap-icons';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Función para formatear fechas
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es });
};

export default function CommentsManager({ auth, comments }) { // ✅ Recibe 'comments'

    const { delete: destroy, processing } = useForm();
    const [deletingComment, setDeletingComment] = useState(null);

    const openDeleteModal = (comment) => setDeletingComment(comment);
    const closeDeleteModal = () => setDeletingComment(null);

    const deleteComment = (e) => {
        e.preventDefault();
        destroy(route('comments.destroy', deletingComment.comment_id), {
            preserveScroll: true,
            onSuccess: () => closeDeleteModal(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Administrar Comentarios" />
            <div className='d-flex'>
                <DashboardOptions/>
                <div className="container-fluid">
                    <div className="bg-accent2 bg-opacity-50 rounded p-4 mb-4">
                        <h1 className="h2"><b>ADMINISTRAR COMENTARIOS</b></h1>
                    </div>

                    {/* --- Tabla de Comentarios --- */}
                    <div className="table-responsive bg-white rounded shadow-sm">
                        <table className="table table-hover align-middle mb-0">
                            <thead className='bg-light'>
                                <tr className='text-center'>
                                    <th className='p-3' style={{width: '50%'}}>Comentario</th>
                                    <th className='p-3'>Usuario</th>
                                    <th className='p-3'>Fecha</th>
                                    <th className='p-3 text-end'>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comments.data.map((comment) => ( // .data porque usamos paginate
                                    <tr key={comment.comment_id} className='text-center'>
                                        <td className='p-3 text-start'>
                                            <p className='mb-0'>{comment.message}</p>
                                        </td>
                                        <td className='p-3'>
                                            {comment.user ? comment.user.name : 'Usuario Eliminado'}
                                        </td>
                                        <td className='p-3'>{formatDate(comment.publish_date)}</td>
                                        <td className='p-3 text-end'>
                                            <button 
                                                className='btn btn-sm btn-outline-danger' 
                                                title="Eliminar comentario"
                                                onClick={() => openDeleteModal(comment)}
                                            >
                                                <TrashFill />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Aquí puedes añadir la paginación si lo deseas */}

                </div>
            </div>

            {/* --- Modal de Confirmación de Borrado --- */}
            <Modal show={deletingComment !== null} onClose={closeDeleteModal}>
                {deletingComment && (
                    <form onSubmit={deleteComment} className="p-4 text-center">
                        <h5 className="fw-bold fs-3 text-dark mb-3">Eliminar Comentario</h5>
                        <p className="text-muted">
                            ¿Estás seguro de que quieres eliminar este comentario?
                        </p>
                        <blockquote className="text-dark fst-italic">"{deletingComment.message}"</blockquote>
                        <div className="mt-4 d-flex justify-content-center">
                            <button type="button" className="btn btn-secondary rounded-pill me-3 px-4" onClick={closeDeleteModal} disabled={processing}>
                                Cancelar
                            </button>
                            <PrimaryButton className="btn btn-danger rounded-pill px-4" disabled={processing}>
                                {processing ? 'Eliminando...' : 'Sí, eliminar'}
                            </PrimaryButton>
                        </div>
                    </form>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}