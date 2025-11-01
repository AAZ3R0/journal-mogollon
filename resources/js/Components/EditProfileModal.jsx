import React from 'react';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import { PencilSquare } from 'react-bootstrap-icons';
 
export default function EditProfileModal({ user, show, onClose }) {
    const { data, setData, patch, errors, processing, recentlySuccessful, reset } = useForm({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
    });
 
    const submitProfileUpdate = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => onClose(),
            preserveState: (page) => Object.keys(page.props.errors).length > 0,
        });
    };
 
    const handleClose = () => {
        onClose();
    };
 
    return (
        // --- CAMBIO 1: Hacemos el modal más grande con 'maxWidth' ---
        <Modal show={show} onClose={handleClose} size="xl" >
            <form onSubmit={submitProfileUpdate} className=" p-3">
                <div className='d-flex justify-content-end' >
                    <button type="button" className="btn fs-2 btn-close  mb-2" onClick={handleClose} disabled={processing}></button>
                </div>
                <div className="modal-header border-0 p-0 pt-2 mb-3">
                    <h5 className="fw-bold fs-1 text-dark px-0">Modificar Perfil</h5>
                </div>
                {/* --- CAMBIO 2: Reestructuración a formulario horizontal --- */}
 
                {/* --- CAMBIO 2: Padding interno agregado (p-3 -> p-5) --- */}
                <div className='bg-warning bg-opacity-50 p-5 rounded'>
                    {/* Campo Nombre */}
                    <div className="row mb-5 align-items-center ">
                        <label htmlFor="modal_name" className="col-md-3 fs-4 col-form-label fw-bold">Nombre:</label>
                        <div className="col-md-9">
                            <input
                                id="modal_name" type="text" className="form-control form-control-lg bg-light"
                                value={data.name} onChange={(e) => setData('name', e.target.value)}
                                required autoComplete="name"
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>
                    </div>
 
                    {/* Campo Usuario */}
                    <div className="row mb-5 align-items-center">
                        <label htmlFor="modal_username" className="col-md-3 fs-4 col-form-label fw-bold">Usuario:</label>
                        <div className="col-md-9">
                            <input
                                id="modal_username" type="text" className="form-control form-control-lg  bg-light"
                                value={data.username} onChange={(e) => setData('username', e.target.value)}
                                autoComplete="username"
                            />
                            <InputError className="mt-2" message={errors.username} />
                        </div>
                    </div>
 
                    {/* Campo Email */}
                    <div className="row align-items-center">
                        <label htmlFor="modal_email" className="col-md-3 fs-4 col-form-label fw-bold">Correo electrónico:</label>
                        <div className="col-md-9">
                            <input
                                id="modal_email" type="email" className="form-control form-control-lg bg-light"
                                value={data.email} onChange={(e) => setData('email', e.target.value)}
                                required autoComplete="email"
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>
                    </div>
 
                    {/* Mensaje de "Guardado" */}
                    
                </div>
                <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out" enterFrom="opacity-0"
                        leave="transition ease-in-out" leaveTo="opacity-0"
                    >
                        <p className="text-sm text-success mt-3">Guardado exitosamente.</p>
                    </Transition>
 
                    {/* Botones de Acción del Modal (Sin cambios) */}
                    <div className="mt-4 d-flex justify-content-end">
                        <button
                            type="submit" className="btn btn-warning btn-lg rounded-pill px-4"
                            disabled={processing}
                        >
                            <PencilSquare className='fs-5 me-2'></PencilSquare>
 
                            {processing ? 'Guardando...' : 'Actualizar'}
                        </button>
                    </div>
            </form>
        </Modal>
    );
}