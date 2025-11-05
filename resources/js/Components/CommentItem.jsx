// En resources/js/Components/CommentItem.jsx (o donde lo tengas)

import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import { PencilSquare, Send, TrashFill } from 'react-bootstrap-icons';
import Modal from '@/Components/Modal';

// ✅ Recibe la nueva prop 'authUserId'
export default function CommentItem({ comment, authUserId }) {
    // Estado para controlar si estamos en modo de edición
    const [isEditing, setIsEditing] = useState(false);

    const [confirmingDelete, setConfirmingDelete] = useState(false);

    // useForm para manejar la actualización
    const { data, setData, patch, delete: destroy, processing, errors, reset } = useForm({
        message: comment.message,
    });

    // Comprueba si el usuario actual es el autor del comentario
    const canEdit = authUserId === comment.user_id;

    const submitUpdate = (e) => {
        e.preventDefault();
        // Hacemos un PATCH a la nueva ruta 'comments.update'
        patch(route('comments.update', comment.comment_id), {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false), // Al éxito, salimos del modo edición
        });
    };

    const deleteComment = (e) => {
        e.preventDefault();
        destroy(route('comments.destroy', comment.comment_id), {
            preserveScroll: true,
            onSuccess: () => setConfirmingDelete(false), // Cierra el modal al borrar
        });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        reset(); // Resetea el formulario a su valor original
    };

    return (
        <>
        <div className="d-flex mb-3 ">
            <div className="flex-grow-1 ">
                <div className="row d-flex align-items-baseline mb-1">
                    
                    
                
                {/* --- RENDERIZADO CONDICIONAL --- */}
                    {isEditing ? (
                        
                        // --- MODO EDICIÓN ---
                        <form onSubmit={submitUpdate}>
                            <p className="fw-bold">{comment.user ? comment.user.username : 'Usuario Anónimo'}</p>
                            <textarea
                                className={`form-control mt-2 ${errors.message ? 'is-invalid' : ''}`}
                                rows="3"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                            ></textarea>
                            <InputError message={errors.message} className="mt-1" />
                            <div className="row g-0 mt-2 d-flex justify-content-end">
                                <PrimaryButton type="button" className="col-12 col-lg-2 btn btn-secondary btn-lg rounded-pill me-lg-2" onClick={cancelEdit} disabled={processing}>
                                    Cancelar
                                </PrimaryButton>
                                <PrimaryButton className="col-12 col-lg-2 btn btn-primary btn-lg rounded-pill" disabled={processing}>
                                   <Send className='fs-3'></Send> {processing ? 'Guardando...' : 'Guardar'}
                                </PrimaryButton>
                            </div>
                        </form>
                    ) : (
                        // --- MODO VISUALIZACIÓN ---
                        <>
                            <p className="fw-bold col-7">{comment.user ? comment.user.username : 'Usuario Anónimo'}</p>
                            
                            

                            
                            {/* El botón de editar solo se muestra si el usuario puede editar */}
                            {canEdit && (
                                <div className="text-end mt-1 col">
                                    <button 
                                        className="btn btn-sm btn-link text-muted"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <PencilSquare className='fs-3'></PencilSquare>
                                    </button>

                                    <button 
                                            className="btn btn-sm btn-link text-danger"
                                            onClick={() => setConfirmingDelete(true)}
                                        >
                                            <TrashFill className='fs-3'></TrashFill>
                                        </button>
                                </div>
                            )}
                            <p className="text-muted small d-none d-lg-block col text-end">
                                {comment.publish_date 
                                    ? formatDistanceToNow(new Date(comment.publish_date), { addSuffix: true, locale: es })
                                    : ''}
                            </p>
                            <div className='border-bottom border-dark mb-3'></div>
                            <p className="mb-0" style={{textAlign:'justify', textAlignLast:'left'}}>{comment.message}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
            {/* ✅ MODAL DE CONFIRMACIÓN DE BORRADO */}
            <Modal show={confirmingDelete} onClose={() => setConfirmingDelete(false)}>
                <form onSubmit={deleteComment} className="p-4 text-center">
                    <h5 className="fw-bold fs-4 text-dark mb-3">¿Eliminar Comentario?</h5>
                    <p className="text-muted">
                        ¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.
                    </p>
                    <div className="mt-4 d-flex justify-content-center">
                        <PrimaryButton type="button" className="btn btn-secondary rounded-pill me-3 px-4" onClick={() => setConfirmingDelete(false)} disabled={processing}>
                            Cancelar
                        </PrimaryButton>
                        <PrimaryButton className="btn btn-danger rounded-pill px-4" disabled={processing}>
                            {processing ? 'Eliminando...' : 'Sí, eliminar'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </>
    );
    
}