import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        // Asumiendo que 'name' es tu primer campo
        // Esto reemplaza 'isFocused={true}'
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <GuestLayout>
             <Head title="Registrarse" />

            {/* Se usa la misma estructura de layout que en el Login */}
            <div className="container-fluid d-flex align-items-center justify-content-center">
                
                <div className="bg-accent2 bg-opacity-50  rounded col-12 col-sm-8 col-md-5 col-lg-4 p-4 p-md-5 rounded-3 shadow-sm form-card">
                    
                    <h1 className="text-center  fw-bold mb-4 text-dark">
                        Registrarse
                    </h1>

                    <form onSubmit={submit}>

                        {/* --- Errores */}

                        {hasErrors && (
                            <div className='alert bg-danger bg-opacity-75 text-light'>
                                <h5 className='fw-bold'>¡Ups! Algo salió mal.</h5>
                                <ul className='mb-0'>
                                    {/* Mapea sobre todas las claves de error y muestra el mensaje */}
                                    {Object.keys(errors).map((key, index) => (
                                        <li key={index}>{errors[key]}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* --- Campo de Nombre Completo --- */}
                        <div className="mb-3">
                            <TextInput
                                id="name"
                                name="nombre"
                                value={data.name}
                                className="bg- form-control form-control-lg"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="Nombre completo..."
                            />
                            
                        </div>

                        {/* --- Campo de Nombre de Usuario --- */}
                        <div className="mb-3">
                            <TextInput
                                id="username"
                                name="nombre de usuario"
                                value={data.username}
                                className="form-control form-control-lg"
                                autoComplete="username"
                                onChange={(e) => setData('username', e.target.value)}
                                required
                                placeholder="Nombre de usuario..."
                            />
                            
                        </div>

                        {/* --- Campo de Correo Electrónico --- */}
                        <div className="mb-3">
                            <TextInput
                                id="email"
                                type="email"
                                name="correo electrónico"
                                value={data.email}
                                className="form-control form-control-lg"
                                autoComplete="email"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="Correo electrónico..."
                            />
                            
                        </div>

                        {/* --- Campo de Contraseña --- */}
                        <div className="mb-3">
                            <TextInput
                                id="password"
                                type="password"
                                name="contraseña"
                                value={data.password}
                                className="form-control form-control-lg"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                placeholder="Contraseña..."
                            />

                        </div>

                        {/* --- Campo de Confirmar Contraseña --- */}
                        <div className="mb-4">
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="confirmación de contraseña"
                                value={data.password_confirmation}
                                className="form-control form-control-lg"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                placeholder="Confirmar contraseña..."
                            />
                        </div>

                        {/* --- Botón de Registrarse (Centrado) --- */}
                        <div className="d-flex justify-content-center mt-4">
                            <PrimaryButton className="btn btn-primary btn-lg rounded-pill px-5" disabled={processing}>
                                Registrarse
                            </PrimaryButton>
                        </div>

                        {/* --- Enlace para Iniciar Sesión --- */}
                        <div className="mt-4 text-center text-dark">
                            ¿Ya tienes una cuenta?{' '}
                            <Link
                                href={route('login')}
                                className="text-info fw-bold"
                            >
                                Iniciar sesión
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
