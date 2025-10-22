import React from 'react';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';

export default function EditProfileModal({ user, show, onClose }) {
    // El hook useForm ahora vive aquí, inicializado con los datos del usuario
    const { data, setData, patch, errors, processing, recentlySuccessful, reset } = useForm({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        // No necesitamos el rol aquí si no se va a editar
    });

    const submitProfileUpdate = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
            // Al tener éxito, cerramos el modal llamando a la función onClose que recibimos
            onSuccess: () => onClose(), 
            // Si hay un error, reseteamos los campos modificados (opcional)
            // onError: () => reset('name', 'username', 'email'), 
            preserveState: (page) => Object.keys(page.props.errors).length > 0,
        });
    };

    // Usamos una función interna para manejar el cierre y limpiar el estado si es necesario
    const handleClose = () => {
        // Podrías resetear 'data' aquí si quieres que los cambios se descarten al cerrar
        // reset(); 
        onClose(); // Llama a la función onClose pasada desde el padre
    };

    return (
        <Modal show={show} onClose={handleClose}>
            <form onSubmit={submitProfileUpdate} className="p-4 p-md-5">
                <h5 className="fw-bold fs-3 text-dark mb-4">Modificar Perfil</h5>

                {/* Campo Nombre */}
                <div className="mb-3">
                    <label htmlFor="modal_name" className="form-label fw-bold">Nombre:</label>
                    <input
                        id="modal_name" type="text" className="form-control rounded-pill"
                        value={data.name} onChange={(e) => setData('name', e.target.value)}
                        required autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Campo Usuario */}
                <div className="mb-3">
                    <label htmlFor="modal_username" className="form-label fw-bold">Usuario:</label>
                    <input
                        id="modal_username" type="text" className="form-control rounded-pill"
                        value={data.username} onChange={(e) => setData('username', e.target.value)}
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.username} />
                </div>

                {/* Campo Email */}
                <div className="mb-3">
                    <label htmlFor="modal_email" className="form-label fw-bold">Correo electrónico:</label>
                    <input
                        id="modal_email" type="email" className="form-control rounded-pill"
                        value={data.email} onChange={(e) => setData('email', e.target.value)}
                        required autoComplete="email"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Mensaje de "Guardado" */}
                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out" enterFrom="opacity-0"
                    leave="transition ease-in-out" leaveTo="opacity-0"
                >
                    <p className="text-sm text-success mt-3">Guardado exitosamente.</p>
                </Transition>

                {/* Botones de Acción del Modal */}
                <div className="mt-4 d-flex justify-content-end">
                    <button
                        type="button" className="btn btn-secondary rounded-pill me-3 px-4"
                        onClick={handleClose} disabled={processing}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit" className="btn btn-primary rounded-pill px-4"
                        disabled={processing}
                    >
                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}