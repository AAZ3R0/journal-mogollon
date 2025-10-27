import React from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from './PrimaryButton';

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
        <form onSubmit={deleteUser} className="p-4 text-center">
            <h5 className="fw-bold fs-3 text-dark mb-3">Eliminar Usuario</h5>
            <p className="text-muted">
                ¿Estás seguro de que quieres eliminar a <strong>{user.name}</strong> (@{user.username})?
                Esta acción es irreversible y borrará todos sus datos.
            </p>

            <div className="mt-4 d-flex justify-content-center">
                <button typeNext="button" className="btn btn-secondary rounded-pill me-3 px-4" onClick={onClose} disabled={processing}>
                    Cancelar
                </button>
                <PrimaryButton className="btn btn-danger rounded-pill px-4" disabled={processing}>
                    {processing ? 'Eliminando...' : 'Sí, eliminar'}
                </PrimaryButton>
            </div>
        </form>
    );
}