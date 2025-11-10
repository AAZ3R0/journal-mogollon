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

    // Limite de caracteres en los comentarios

    const commentCharLimit = 150;
    const isCommentOverLimit = data.message.length > commentCharLimit;

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
        <div className="d-flex">
            <div className="flex-grow-1 ">
                <div className="row d-flex align-items-baseline mb-1">
                    
                    
                
                {/* --- RENDERIZADO CONDICIONAL --- */}
                    {isEditing ? (
                        
                        // --- MODO EDICIÓN ---
                        <form onSubmit={submitUpdate}>
                            <p className="fw-bold">{comment.user ? comment.user.username : 'Usuario Anónimo'}</p>
                            <div className='border-bottom border-dark'></div>
                            <textarea
                                className={`form-control mt-2 ${errors.message ? 'is-invalid' : ''}`}
                                rows="4"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                            ></textarea>

                            <div className='d-flex justify-content-end'>
                                <div className={`mt-2 badge fs-6 ${isCommentOverLimit ? 'bg-danger fw-bold' : 'bg-secondary'}`}>
                                    {data.message.length} / {commentCharLimit}
                                </div>

                            </div>
                            
                            <div className='border-bottom border-dark pt-3'></div>
                            <InputError message={errors.message} className="mt-1" />
                            <div className="row g-0 mt-2 d-flex justify-content-end">
                                <PrimaryButton type="button" className="col-12 col-lg-2 me-lg-2 btn btn-secondary btn-lg rounded-pill me-lg-2 d-none d-lg-block" onClick={cancelEdit} disabled={processing}>
                                    Cancelar
                                </PrimaryButton>
                                <PrimaryButton className="col-12 col-lg-3 btn btn-primary btn-lg rounded-pill" disabled={processing}>
                                   <Send className='fs-3'></Send> {processing ? 'Guardando...' : 'Guardar'}
                                </PrimaryButton>
                                <PrimaryButton type="button" className="col-12 col-lg-3 btn btn-secondary btn-lg rounded-pill me-lg-2 d-block d-lg-none" onClick={cancelEdit} disabled={processing}>
                                    Cancelar
                                </PrimaryButton>
                                
                            </div>
                        </form>
                    ) : (
                        // --- MODO VISUALIZACIÓN ---
                        <>
                            <p className="fw-bold col-7">{comment.user ? comment.user.username : 'Usuario Anónimo'}</p>
                            
                            

                            
                            {/* El botón de editar solo se muestra si el usuario puede editar */}
                            <p className="text-muted small d-none d-lg-block col text-end">
                                {comment.publish_date 
                                    ? formatDistanceToNow(new Date(comment.publish_date), { addSuffix: true, locale: es })
                                    : ''}
                            </p>
                            <div className='border-bottom border-dark'></div>
                            
                            <p className="mb-0 pt-4" style={{textAlign:'justify', textAlignLast:'left'}}>{comment.message}</p>
                            <div className='border-bottom border-dark pb-4'></div>
                            {canEdit && (
                                <div className="text-end mt-3 col">
                                    <button 
                                        className="btn btn-sm btn-link text-muted p-0"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <PencilSquare className='fs-2 me-3'></PencilSquare>
                                    </button>

                                    <button 
                                            className="btn btn-sm btn-link text-danger p-0"
                                            onClick={() => setConfirmingDelete(true)}
                                        >
                                            <TrashFill className='fs-2'></TrashFill>
                                        </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
            {/* ✅ MODAL DE CONFIRMACIÓN DE BORRADO */}
            <Modal show={confirmingDelete} onClose={() => setConfirmingDelete(false)}>

                <div className='modal-header'>
                    <h2 className="fw-bold fs-4 text-dark m-0">¿Eliminar Comentario?</h2>
                    <button className='btn btn-lg btn-close' onClick={() => setConfirmingDelete(false)}></button>
                </div>
                
                <div className='modal-body bg-light bg-opacity-50 rounded'>
                    <h6 className="text-muted">
                        ¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.
                    </h6>
                </div>
                
                
                <div className="mt-4 row g-0 d-flex justify-content-end">
                    <PrimaryButton type="button" className="col-12 col-lg-4 btn btn-secondary rounded-pill me-lg-3 px-4 d-none d-lg-block" onClick={() => setConfirmingDelete(false)} disabled={processing}>
                        Cancelar
                    </PrimaryButton>
                    <PrimaryButton className="col-12 col-lg-4 btn btn-lg btn-danger rounded-pill px-4 d-flex justify-content-center align-items-center" onClick={deleteComment} disabled={processing}>
                        <TrashFill className='fs-3'></TrashFill>
                        {processing ? 'Eliminando...' : 'Eliminar'}
                    </PrimaryButton>
                    <PrimaryButton type="button" className="btn btn-lg btn-secondary rounded-pill me-lg-3 px-4 d-lg-none" onClick={() => setConfirmingDelete(false)} disabled={processing}>
                        Cancelar
                    </PrimaryButton>
                </div>
                
            </Modal>
        </>
    );
    
}