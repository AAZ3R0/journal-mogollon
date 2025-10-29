// resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx

import InputError from '@/Components/InputError';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
// --- AÑADIR useState ---
import { useRef, useEffect, useState } from 'react';
// --- AÑADIR Modal ---
import Modal from '@/Components/Modal';
import EditProfileModal from '@/Components/EditProfileModal';
import { PencilSquare, Trash2Fill, TrashFill } from 'react-bootstrap-icons';
import DeleteUserForm from './DeleteUserForm';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    // --- ESTADO PARA EL MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        username: user.username || '',
        email: user.email,
        role_name: user.role ? user.role.name : 'Rol no asignado',
    });

    const nameInput = useRef();
    useEffect(() => {
        if (nameInput.current) {
            nameInput.current.focus();
        }
    }, []);

    // --- FUNCIONES PARA EL MODAL ---
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        // Opcional: Resetear errores si se cierra sin guardar
        // reset(); 
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    return (
        // El div principal ahora necesita un <></> o <Fragment> si pones el Modal fuera
        // Lo mantendremos simple y pondremos el Modal dentro del div principal.
        <div className={`w-75 m-auto bg-light bg-opacity-50 shadow-sm ${className}`}>
            <div className="p-5">

                {/* --- Contenedor para reducir el ancho del formulario --- */}
                <div className="row justify-content-center">

                    {/* --- CONTENEDOR 1: FORMULARIO (VISUALIZACIÓN) --- */}
                    <div className=" bg-light bg-opacity-50 p-4 rounded">
                        <h1 className="fw-bold text-dark mb-5" style={{ fontSize: '4.5rem' }}>
                            Perfil de: {user.username || user.name}
                        </h1>

                        {/* Formulario de solo lectura */}
                        <form>
                            {/* Fila: Nombre */}
                            <div className="row mb-3 align-items-middle">
                                <label htmlFor="name" className="col-md-4 col-form-label text-md-start fw-bold fs-3">
                                    Nombre:
                                </label>
                                <div className="col-md-7 offset-md-1 mb-5">
                                    <input
                                        id="name"
                                        type="text"
                                        className="form-control px-4 py-2 border-0 bg-secondary bg-opacity-50 rounded-pill fs-3"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)} // Mantenemos esto por si acaso
                                        required
                                        autoComplete="name"
                                        ref={nameInput}
                                        readOnly
                                        disabled
                                    />
                                    <InputError className="mt-2" message={errors.name} />
                                </div>
                            </div>

                            {/* Fila: Usuario */}
                            <div className="row mb-3 align-items-middle">
                                <label htmlFor="username" className="text-dark col-md-4 col-form-label text-md-start fw-bold fs-3">
                                    Usuario:
                                </label>
                                <div className="col-md-7 offset-md-1 mb-5">
                                    <input
                                        id="username"
                                        type="text"
                                        className="form-control px-4 py-2 border-0 bg-secondary bg-opacity-50 rounded-pill fs-3"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        autoComplete="username"
                                        readOnly
                                        disabled
                                    />
                                    <InputError className="mt-2" message={errors.username} />
                                </div>
                            </div>

                            {/* Fila: Correo */}
                            <div className="row mb-3 align-items-middle">
                                <label htmlFor="email" className="text-dark col-md-4 col-form-label text-md-start fw-bold fs-3">
                                    Correo electrónico:
                                </label>
                                <div className="col-md-7 offset-md-1 mb-5">
                                    <input
                                        id="email"
                                        type="email"
                                        className="form-control px-4 py-2 border-0 bg-secondary bg-opacity-50 rounded-pill fs-3"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="email"
                                        readOnly
                                        disabled
                                    />
                                    <InputError className="mt-2" message={errors.email} />
                                </div>
                            </div>

                            {/* Verificación de Email */}
                            {mustVerifyEmail && user.email_verified_at === null && (
                                <div className="row mb-3">
                                    <div className="col-md-8 offset-md-4">
                                        {/* ... (código de verificación sin cambios) ... */}
                                    </div>
                                </div>
                            )}

                            {/* Fila: Rol */}
                            <div className="row mb-3 align-items-middle">
                                <label htmlFor="rol_id" className="text-dark col-md-4 col-form-label text-md-start fw-bold fs-3">
                                    Rol:
                                </label>
                                <div className="col-md-7 offset-md-1 mb-5">
                                    <input
                                        id="rol_name_display" // Cambiamos el ID para claridad
                                        type="text"
                                        className="form-control px-4 py-2 border-0 bg-secondary bg-opacity-50 rounded-pill fs-3"
                                        // ✅ Mostramos el nombre del rol aquí
                                        value={user.role ? user.role.name : 'Rol no asignado'}
                                        readOnly // Sigue siendo de solo lectura en esta vista
                                        disabled

                                    />
                                    <InputError className="mt-2" message={errors.rol_id} />
                                </div>
                            </div>
                        </form>
                    </div> {/* --- FIN DEL CONTENEDOR 1 --- */}

                    {/* --- CONTENEDOR 2: BOTONES DE ACCIÓN --- */}
                    <div className="bg-light rounded py-4 px-4 bg-opacity-50 mt-4 d-flex justify-content-end">
                        {/* --- MODIFICACIÓN AQUÍ: Añadir onClick --- */}
                        <button
                            type="button"
                            className="btn btn-warning fw-bold btn-lg rounded-pill me-3 px-4 text-dark"
                            onClick={openModal} // <-- AÑADIDO
                        >
                            <PencilSquare className='fs-3 mx-2'></PencilSquare>
                            Editar perfil
                        </button>

                        <button
                            type="button"
                            className="btn btn-danger fw-bold btn-lg rounded-pill px-4"
                            onClick={openDeleteModal}
                        >
                            <TrashFill className='fs-3 mx-2'></TrashFill>
                            Eliminar perfil
                        </button>
                    </div>

                </div>
            </div>

            <EditProfileModal
                user={user}
                show={isModalOpen}
                onClose={closeModal}
            />

            <DeleteUserForm
                user={user}
                show={isDeleteModalOpen}
                onClose={closeDeleteModal}
            />



        </div>
    );
}