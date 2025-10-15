import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            {/* Contenedor principal con la clase para el fondo */}
            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center page-background">
                <div className="bg-accent2 bg-opacity-50 rounded col-12 col-sm-8 col-md-5 col-lg-4">

                    {/* Contenedor del formulario con clase personalizada */}
                    <div className="p-4 p-md-5 rounded-3 shadow-sm form-card">

                        <h1 className="text-center fw-bold mb-4 text-dark">
                            Iniciar sesión
                        </h1>

                        {status && (
                            <div className="alert alert-success">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className=" mb-3">
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="form-control form-control-lg"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Nombre de usuario o correo..."
                                    isFocused={true}
                                    autoComplete="username"
                                />
                                <InputError message={errors.email} className="mt-2 text-danger" />
                            </div>

                            <div className="mb-4">
                                <TextInput
                                    id="password"
                                    type="password"
                                    className="form-control form-control-lg"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Contraseña..."
                                    autoComplete="current-password"
                                />
                                <InputError message={errors.password} className="mt-2 text-danger" />
                            </div>

                            <div className="d-flex justify-content-center mt-4">
                                <PrimaryButton className="btn btn-primary btn-lg rounded-5" disabled={processing}>
                                    Iniciar sesión
                                </PrimaryButton>
                            </div>

                            <div className="mt-4 text-center text-dark">
                                ¿No tienes cuenta?{' '}
                                <Link
                                    href={route('register')}
                                    className="text-info fw-bold"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
