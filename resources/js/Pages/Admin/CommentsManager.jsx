import React, { useState, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardOptions from '@/Components/Dashboard';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import BootstrapPagination from '@/Components/BootstrapPagination';
import { TrashFill, Search } from 'react-bootstrap-icons';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Función para formatear fechas
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es });
};

export default function CommentsManager({ auth, comments, filters = {} }) {

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


    // --- Lógica de Filtros ---
    const { data, setData, get, processing: filterProcessing } = useForm({
        query_message: filters.query_message || '',
        query_user: filters.query_user || '',
    });

    const submitFilters = (e) => {
        e.preventDefault();
        // Hacemos una petición GET a esta misma página con los datos del formulario
        get(route('admin.comments'), {
            preserveState: true,
            replace: true,
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

                    {/* --- ✅ Panel de Filtros --- */}
                    <div className="p-4 mx-0 bg-light bg-opacity-50 rounded mb-4 shadow-sm">
                        <form onSubmit={submitFilters}>
                            <div className="row g-3 align-items-end">
                                <div className="col-md-6">
                                    <label htmlFor="query_message" className="form-label fw-bold">Buscar en Comentario</label>
                                    <div className='input-group'>
                                        <input
                                            type="text"
                                            id="query_message"
                                            className="form-control"
                                            placeholder="Contenido del mensaje..."
                                            value={data.query_message}
                                            onChange={(e) => setData('query_message', e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-accent2">
                                            <Search />
                                        </button>
                                    </div>
                                    
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="query_user" className="form-label fw-bold">Buscar por Usuario</label>
                                    <div className='input-group'>
                                        <input
                                            type="text"
                                            id="query_user"
                                            className="form-control"
                                            placeholder="Nombre, @usuario o email..."
                                            value={data.query_user}
                                            onChange={(e) => setData('query_user', e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-accent2">
                                            <Search />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>

                    {/* --- Tabla de Comentarios --- */}
                    <div className="table-responsive rounded shadow-sm">
                        <table className="table table-hover align-middle mb-0 table-bordered border-dark">
                            <thead className='bg-light'>
                                <tr className='text-center'>
                                    <th className='py-4 bg-warning text-dark h4' style={{width: '50%'}}>Comentario</th>
                                    <th className='py-4 bg-warning text-dark h4'>Usuario</th>
                                    <th className='py-4 bg-warning text-dark h4'>Fecha</th>
                                    <th className='py-4 bg-warning text-dark h4'>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comments.data.map((comment) => ( // .data porque usamos paginate
                                    <tr key={comment.comment_id} className='text-center'>
                                        <td className='p-3 bg-accent2 fs-5 bg-opacity-50 text-start'>
                                            <p className='mb-0'>{comment.message}</p>
                                        </td>
                                        <td className='p-3 bg-accent2 fs-5 bg-opacity-50'>
                                            {comment.user ? comment.user.name : 'Usuario Eliminado'}
                                        </td>
                                        <td className='p-3 bg-accent2 fs-5 bg-opacity-50 '>{formatDate(comment.publish_date)}</td>
                                        <td className='p-3 bg-accent2 fs-5 bg-opacity-50'>
                                            <button 
                                                className='btn btn-sm btn-outline-danger fs-5' 
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
                        {/* Mensaje si no hay resultados */}
                        {comments.data.length === 0 && (
                            <div className="alert bg-warning bg-opacity-75 text-center mt-3" role="alert">
                                No se encontraron comentarios que coincidan con los filtros.
                            </div>
                        )}
                    </div>
                    {/* ✅ Añadimos la Paginación */}
                    <BootstrapPagination links={comments.links} />
                </div>
            </div>

            {/* --- Modal de Confirmación de Borrado --- */}
            <Modal show={deletingComment !== null} onClose={closeDeleteModal} size="lg">
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