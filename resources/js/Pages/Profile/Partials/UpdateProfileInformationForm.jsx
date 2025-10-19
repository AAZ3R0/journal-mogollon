// resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx

import InputError from '@/Components/InputError';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useRef, useEffect } from 'react';

// Asumimos las props estándar que recibe este componente en Breeze
export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    // El código que enviaste usa 'username' y 'rol_id', los añadimos al formulario
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        username: user.username || '', // Asegúrate de que 'username' exista en tu modelo User
        email: user.email,
        rol_id: user.rol_id || 'Lector', // El 'rol_id' como en tu código
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    // Replicamos la funcionalidad 'isFocused' del <TextInput> original
    const nameInput = useRef();
    useEffect(() => {
        if (nameInput.current) {
            nameInput.current.focus();
        }
    }, []);

    return (
        // Usamos la estructura de 'card' de Bootstrap para el contenedor
        <div className={`card shadow-sm ${className}`}>
            <div className="card-body p-4 p-md-5">
                <header>
                    {/* Título de la tarjeta, como en la imagen */}
                    <h5 className="card-title fw-bold fs-3 mb-4">
                        Perfil de: {user.username || user.name}
                    </h5>
                </header>

                <form onSubmit={submit}>
                    {/* Fila de Formulario Horizontal: Nombre */}
                    <div className="row mb-3 align-items-center">
                        <label htmlFor="name" className="col-md-3 col-form-label text-md-end">
                            Nombre:
                        </label>
                        <div className="col-md-9">
                            <input
                                id="name"
                                type="text"
                                className="form-control"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                ref={nameInput} // Para el auto-focus
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>
                    </div>

                    {/* Fila de Formulario Horizontal: Username (del código) */}
                    <div className="row mb-3 align-items-center">
                        <label htmlFor="username" className="col-md-3 col-form-label text-md-end">
                            Usuario:
                        </label>
                        <div className="col-md-9">
                            <input
                                id="username"
                                type="text"
                                className="form-control"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                required
                                autoComplete="username"
                            />
                            <InputError className="mt-2" message={errors.username} />
                        </div>
                    </div>

                    {/* Fila de Formulario Horizontal: Correo */}
                    <div className="row mb-3 align-items-center">
                        <label htmlFor="email" className="col-md-3 col-form-label text-md-end">
                            Correo electrónico:
                        </label>
                        <div className="col-md-9">
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="email"
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>
                    </div>

                    {/* Lógica de Verificación de Email de Breeze */}
                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="row mb-3">
                            <div className="col-md-9 offset-md-3">
                                <p className="text-sm text-muted">
                                    Tu correo no está verificado.
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="btn btn-link p-0 ms-1 align-baseline"
                                    >
                                        Reenviar correo de verificación
                                    </Link>
                                </p>
                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-success">
                                        Se ha enviado un nuevo enlace de verificación.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Fila de Formulario Horizontal: Rol */}
                    <div className="row mb-3 align-items-center">
                        <label htmlFor="rol_id" className="col-md-3 col-form-label text-md-end">
                            Rol:
                        </label>
                        <div className="col-md-9">
                            <input
                                id="rol_id"
                                type="text"
                                // Usamos 'form-control-plaintext' para que no sea editable, como en la imagen
                                className="form-control-plaintext"
                                value={data.rol_id}
                                readOnly // El rol no debería ser editable por el usuario aquí
                            />
                            <InputError className="mt-2" message={errors.rol_id} />
                        </div>
                    </div>

                    {/* Botón de Guardar */}
                    <div className="row mt-4">
                        <div className="col-md-9 offset-md-3 d-flex align-items-center">
                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                Guardar Cambios
                            </button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-muted ms-3 mb-0">Guardado.</p>
                            </Transition>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}