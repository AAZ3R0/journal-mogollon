// resources/js/Pages/Profile/Partials/DeleteUserForm.jsx

import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { PencilSquare, Trash2Fill, TrashFill } from 'react-bootstrap-icons';


// ✅ Recibe 'show' y 'onClose' como props
export default function DeleteUserForm({ className = '', user, show, onClose }) {

    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,

    } = useForm({
        password: '',
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        role_name: user.role ? user.role.name : 'Rol no asignado',
    });

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(), // Llama a closeModal interno
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        onClose(); // Llama a la función 'onClose' del padre
        clearErrors();
        reset();
    };

    return (
        // ✅ El <section> se elimina. El Modal se convierte en el contenedor raíz.

        <Modal show={show} onClose={closeModal} size="xl">

            <form onSubmit={deleteUser} className="p-3">
                <div className='d-flex justify-content-end'>
                    <button
                        type="button"
                        className="btn btn-lg btn-close mb-5 fs-2 "
                        onClick={closeModal}
                        disabled={processing}
                    >

                    </button>
                </div>
                <div className="modal-header border-0 p-0 pb-2">
                    <h5 className="fw-bold fs-1 text-dark px-0">¿Estás seguro que quieres eliminar la cuenta?</h5>


                </div>
                <div className='bg-warning bg-opacity-50 p-5 container rounded'>
                    <div className="row mb-5 align-items-center ">
                        <label htmlFor="modal_name" className="col-md-3 fs-4 txt-dark col-form-label fw-bold">Nombre:</label>
                        <div className="col-md-9">
                            <input
                                id="modal_name" type="text" className="form-control form-control-lg rounded-pill border-0 bg-secondary bg-opacity-75"
                                value={data.name} onChange={(e) => setData('name', e.target.value)}
                                required autoComplete="name"
                                disabled
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>
                    </div>

                    {/* Campo Usuario */}
                    <div className="row mb-5 align-items-center">
                        <label htmlFor="modal_username" className="col-md-3 fs-4 txt-dark col-form-label fw-bold">Usuario:</label>
                        <div className="col-md-9 ">
                            <input
                                id="modal_username" type="text" className="form-control form-control-lg rounded-pill border-0 bg-secondary bg-opacity-75"
                                value={data.username} onChange={(e) => setData('username', e.target.value)}
                                autoComplete="username"
                                disabled
                            />
                            <InputError className="mt-2" message={errors.username} />
                        </div>
                    </div>

                    {/* Campo Email */}
                    <div className="row mb-5 align-items-center">
                        <label htmlFor="modal_email" className="col-md-3 fs-4 txt-dark col-form-label fw-bold">Correo electrónico:</label>
                        <div className="col-md-9">
                            <input
                                id="modal_email" type="email" className="form-control form-control-lg rounded-pill border-0 bg-secondary bg-opacity-75"
                                value={data.email} onChange={(e) => setData('email', e.target.value)}
                                required autoComplete="email"
                                disabled
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>
                    </div>

                    {/* Campo Rol */}
                    <div className="row mb-5 align-items-center ">
                        <label htmlFor="modal_name" className="col-md-3 fs-4 txt-dark col-form-label fw-bold">Rol:</label>
                        <div className="col-md-9">
                            <input
                                id="modal_name" type="text" className="form-control form-control-lg rounded-pill border-0 bg-secondary bg-opacity-75"
                                value={user.role ? user.role.name : 'Rol no asignado'}
                                required autoComplete="name"
                                disabled
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>
                    </div>
                </div>
                <div className="mt-4 d-flex justify-content-end">


                    {/* Usamos un botón de Bootstrap en lugar del DangerButton de Breeze/Tailwind */}

                    <button
                        type="submit"
                        className="btn btn-lg btn-danger rounded-pill px-4"
                        disabled={processing}
                    >
                        <TrashFill className='fs-5 me-2'></TrashFill>

                        {processing ? 'Eliminando...' : 'Eliminar Cuenta'}
                    </button>
                </div>
            </form>
        </Modal >
    );
}