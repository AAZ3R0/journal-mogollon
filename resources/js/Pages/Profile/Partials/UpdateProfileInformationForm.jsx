// resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx

import InputError from '@/Components/InputError';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
// --- AÑADIR useState ---
import { useRef, useEffect, useState } from 'react';
// --- AÑADIR Modal ---
import Modal from '@/Components/Modal';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    // --- ESTADO PARA EL MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        username: user.username || '',
        email: user.email,
        rol_id: user.rol_id || 'Lector',
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

    const submitProfileUpdate = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => closeModal(), // Cierra el modal si la actualización es exitosa
        });
    };


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
                                            id="rol_id"
                                            type="text"
                                            className="form-control bg-accent3 rounded-pill"
                                            value={data.rol_id}
                                            readOnly
                                        />
                                        <InputError className="mt-2" message={errors.rol_id} />
                                    </div>
                                </div>
                            </form>
                        </div> {/* --- FIN DEL CONTENEDOR 1 --- */}

                        {/* --- CONTENEDOR 2: BOTONES DE ACCIÓN --- */}
                        <div className="text-end bg-light py-3 px-4 bg-opacity-50 mt-4">
                            {/* --- MODIFICACIÓN AQUÍ: Añadir onClick --- */}
                            <button
                                type="button"
                                className="btn btn-warning btn-md rounded-pill me-3 px-4"
                                onClick={openModal} // <-- AÑADIDO
                            >
                                <i className="bi bi-pencil-square me-1"></i>
                                Editar perfil
                            </button>
                            
                            <button type="button" className="btn btn-danger btn-md rounded-pill px-4">
                                <i className="bi bi-trash me-1"></i>
                                Eliminar perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- INICIO DEL MODAL DE EDICIÓN --- */}
            <Modal show={isModalOpen} onClose={closeModal}>
                {/* Usamos el padding de Bootstrap (p-4 o p-5) */}
                <form onSubmit={submitProfileUpdate} className="p-4 p-md-5">
                    <h5 className="fw-bold fs-3 text-dark mb-4">Modificar Perfil</h5>

                    {/* Campo Nombre */}
                    <div className="mb-3">
                        <label htmlFor="modal_name" className="form-label fw-bold">Nombre:</label>
                        <input
                            id="modal_name"
                            type="text"
                            className="form-control rounded-pill" // Usamos inputs normales
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    {/* Campo Usuario */}
                    <div className="mb-3">
                        <label htmlFor="modal_username" className="form-label fw-bold">Usuario:</label>
                        <input
                            id="modal_username"
                            type="text"
                            className="form-control rounded-pill"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            autoComplete="username"
                        />
                        <InputError className="mt-2" message={errors.username} />
                    </div>

                    {/* Campo Email */}
                    <div className="mb-3">
                        <label htmlFor="modal_email" className="form-label fw-bold">Correo electrónico:</label>
                        <input
                            id="modal_email"
                            type="email"
                            className="form-control rounded-pill"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="email"
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    {/* Mensaje de "Guardado" */}
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-success mt-3">Guardado exitosamente.</p>
                    </Transition>

                    {/* Botones de Acción del Modal */}
                    <div className="mt-4 d-flex justify-content-end">
                        <button
                            type="button"
                            className="btn btn-secondary rounded-pill me-3 px-4"
                            onClick={closeModal}
                            disabled={processing}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary rounded-pill px-4" // Asumiendo que tienes btn-primary
                            disabled={processing}
                        >
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </Modal>
            {/* --- FIN DEL MODAL --- */}

        </div>
    );
}