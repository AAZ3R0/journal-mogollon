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
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
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
        <AuthenticatedLayout containerType="container-fluid">
            <Head title="Administrar Comentarios" />
            <div className='row m-auto g-0'>
                <DashboardOptions />
                <div className="col-12 col-xl ms-lg-3">
                    <div className="bg-accent2 bg-opacity-50 rounded p-4 mb-4 text-center text-lg-start">
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

                    {/* --- 1. INICIA VISTA MÓVIL (TARJETAS) --- */}
                    {/* Se muestra solo en pantallas chicas (d-md-none) */}
                    <div className='bg-warning text-center p-3 mb-3 border border-dark d-block d-lg-none'>
                        <h2 className='fw-bold text-dark'>Comentarios </h2>
                    </div>
                    <div className="d-block d-md-none">
                        {comments.data.map((comment) => (
                            <div key={comment.comment_id} className="bg-accent2 bg-opacity-50 rounded shadow-sm p-3 mb-3">

                                {/* Fila Comentario */}
                                <div className="mb-2">
                                    <div className="col-4 fw-bold">Comentario:</div>
                                    <div className="col-12 mt-2" style={{ overflowWrap: 'break-word' }}>
                                        {comment.message}
                                    </div>
                                </div>

                                <hr className="my-2" />
                                {/* Fila Usuario */}
                                <div className="mb-2">
                                    <div className="col-4 fw-bold">Usuario:</div>
                                    <div className="col-8 mt-2">
                                        {comment.user ? comment.user.username : 'Usuario Eliminado'}
                                    </div>
                                </div>

                                <hr className="my-2" />
                                {/* Fila Fecha */}
                                <div className=" mb-2">
                                    <div className="col-4 fw-bold">Fecha:</div>
                                    <div className="col-8 mt-2">{formatDate(comment.publish_date)}</div>
                                </div>

                                {/* Fila Acciones */}
                                <hr className="my-2" />
                                <div className="d-flex justify-content-end align-items-center">
                                    <button
                                        className='btn fs-5 p-0'
                                        title="Eliminar comentario"
                                        onClick={() => openDeleteModal(comment)}
                                    >
                                        <TrashFill className='fs-1 text-dark' />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                    {/* --- FIN VISTA MÓVIL --- */}



                    {/* --- Tabla de Comentarios --- */}
                    <div className="table-responsive rounded shadow-sm d-none d-md-block">
                        <table className="table table-hover align-middle mb-0 table-bordered border-dark">
                            <thead className='bg-light'>
                                <tr className='text-center'>
                                    <th className='py-4 bg-warning text-dark h4' style={{ width: '50%' }}>Comentario</th>
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
                                            {comment.user ? comment.user.username : 'Usuario Eliminado'}
                                        </td>
                                        <td className='p-3 bg-accent2 fs-5 bg-opacity-50 '>{formatDate(comment.publish_date)}</td>
                                        <td className='p-3 bg-accent2 fs-5 bg-opacity-50'>
                                            <button
                                                className='btn fs-5'
                                                title="Eliminar comentario"
                                                onClick={() => openDeleteModal(comment)}
                                            >
                                                <TrashFill className='fs-2 text-dark' />
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

                    <div className='bg-light p-3 bg-opacity-50 mt-3'>
                        {/* ✅ Añadimos la Paginación */}
                        <BootstrapPagination links={comments.links} />
                    </div>

                </div>
            </div>

            {/* --- Modal de Confirmación de Borrado --- */}
            <Modal show={deletingComment !== null} onClose={closeDeleteModal} size="md">
                {deletingComment && (

                    <div>
                        <div className='modal-header'>
                            <h2 className="modal-title fw-bold fs-3 text-dark">Eliminar Comentario</h2>
                            <button className='btn btn-lg btn-close' onClick={closeDeleteModal}></button>
                        </div>

                        <div className='modal-body'>
                            <h5 className="text-muted">
                                ¿Estás seguro de que quieres eliminar este comentario?
                            </h5>
                            <div className='bg-light p-3 bg-opacity-50 rounded'>
                                <h6 className="text-dark fst-italic">"{deletingComment.message}"</h6>
                                <p> Del usuario: <strong>{deletingComment.user ? deletingComment.user.username : 'Usuario Eliminado'}</strong> </p>
                            </div>
                        </div>



                        <div className="mt-lg-2 d-flex justify-content-end align-items-center">
                            <PrimaryButton className="btn btn-lg col-12 col-lg-5 fw-bold btn-danger rounded-pill px-4 d-flex justify-content-center align-items-center" disabled={processing}>
                                <TrashFill className='fs-2 me-2'></TrashFill>  {processing ? 'Eliminando...' : 'Eliminar'}
                            </PrimaryButton>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}