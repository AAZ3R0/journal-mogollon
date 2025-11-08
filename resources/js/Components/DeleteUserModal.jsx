import React from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from './PrimaryButton';
import { TrashFill } from 'react-bootstrap-icons';

export default function DeleteUserModal({ user, onClose }) {
    // Usamos 'delete' de useForm, renombrado a 'destroy'
    const { delete: destroy, processing } = useForm();

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('admin.users.destroy', user.user_id), {
            preserveScroll: true,
            onSuccess: () => onClose(), // Cierra el modal al tener éxito
        });
    };

    return (

        <div>
        
            <div className='modal-header'>
                
                <h2 className="modal-title">Eliminar Usuario</h2>
                <button className='btn btn-lg btn-close' onClick={onClose}></button>
                
                
            </div>

            <div className='modal-body bg-light bg-opacity-50 rounded'>
                <h5 className="text-muted">
                    ¿Estás seguro de que quieres eliminar a <strong>{user.name}</strong> (@<strong>{user.username}</strong>)?
                    Esta acción es irreversible y borrará todos sus datos.
                </h5>
            </div>
            
            

            <div className="mt-4 d-flex justify-content-end align-items-center">
                <PrimaryButton className="btn btn-lg btn-danger col-12 col-lg-5 rounded-pill px-4" onClick={deleteUser} disabled={processing}>
                   <TrashFill className='fs-3 me-2'></TrashFill> {processing ? 'Eliminando...' : 'Eliminar'}
                </PrimaryButton>
            </div>
        </div>
    );
}