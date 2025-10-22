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
        <div className={`card bg-light bg-opacity-50 shadow-sm ${className}`}>
            <div className="card-body p-4 p-md-5">

                {/* --- Contenedor para reducir el ancho del formulario --- */}
                <div className="row justify-content-center">
                    <div className="col-lg-10">

                        {/* --- CONTENEDOR 1: FORMULARIO (VISUALIZACIÓN) --- */}
                        <div className=" bg-light bg-opacity-50 p-4 rounded">
                            <header>
                                <h5 className="card-title fw-bold fs-1 text-dark mb-4">
                                    Perfil de: {user.username || user.name}
                                </h5>
                            </header>

                            {/* Formulario de solo lectura */}
                            <form>
                                {/* Fila: Nombre */}
                                <div className="row mb-3 align-items-center">
                                    <label htmlFor="name" className="col-md-4 col-form-label text-md-start fw-bold fs-5">
                                        Nombre:
                                    </label>
                                    <div className="col-md-7 offset-md-1">
                                        <input
                                            id="name"
                                            type="text"
                                            className="form-control bg-accent3 rounded-pill"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)} // Mantenemos esto por si acaso
                                            required
                                            autoComplete="name"
                                            ref={nameInput}
                                            readOnly
                                        />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>
                                </div>

                                {/* Fila: Usuario */}
                                <div className="row mb-3 align-items-center">
                                    <label htmlFor="username" className="text-dark col-md-4 col-form-label text-md-start fw-bold fs-5">
                                        Usuario:
                                    </label>
                                    <div className="col-md-7 offset-md-1">
                                        <input
                                            id="username"
                                            type="text"
                                            className="form-control bg-accent3 rounded-pill"
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value)}
                                            autoComplete="username"
                                            readOnly
                                        />
                                        <InputError className="mt-2" message={errors.username} />
                                    </div>
                                </div>

                                {/* Fila: Correo */}
                                <div className="row mb-3 align-items-center">
                                    <label htmlFor="email" className="text-dark col-md-4 col-form-label text-md-start fw-bold fs-5">
                                        Correo electrónico:
                                    </label>
                                    <div className="col-md-7 offset-md-1">
                                        <input
                                            id="email"
                                            type="email"
                                            className="form-control bg-accent3 rounded-pill"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            autoComplete="email"
                                            readOnly
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
                                <div className="row mb-3 align-items-center">
                                    <label htmlFor="rol_id" className="text-dark col-md-4 col-form-label text-md-start fw-bold fs-5">
                                        Rol:
                                    </label>
                                    <div className="col-md-7 offset-md-1">
                                        <input
                                            id="rol_name_display" // Cambiamos el ID para claridad
                                            type="text"
                                            className="form-control bg-accent3 rounded-pill"
                                            // ✅ Mostramos el nombre del rol aquí
                                            value={user.role ? user.role.name : 'Rol no asignado'}
                                            readOnly // Sigue siendo de solo lectura en esta vista
                                        />
                                        <InputError className="mt-2" message={errors.rol_id} />
                                    </div>
                                </div>
                            </form>
                        </div> {/* --- FIN DEL CONTENEDOR 1 --- */}

                        {/* --- CONTENEDOR 2: BOTONES DE ACCIÓN --- */}
                        <div className="bg-light py-3 px-4 bg-opacity-50 mt-4 d-flex justify-content-end">
                            {/* --- MODIFICACIÓN AQUÍ: Añadir onClick --- */}
                            <button
                                type="button"
                                className="btn btn-warning btn-lg rounded-pill me-3 px-4"
                                onClick={openModal} // <-- AÑADIDO
                            >
                                <PencilSquare className='fs-3 mx-2'></PencilSquare>
                                Editar perfil
                            </button>
                            
                            <button 
                                type="button" 
                                className="btn btn-danger btn-lg rounded-pill px-4"
                                onClick={openDeleteModal}
                            >
                                <TrashFill className='fs-3 mx-2'></TrashFill>
                                Eliminar perfil
                            </button>
                        </div>
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