import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
             <Head title="Registrarse" />

            {/* Se usa la misma estructura de layout que en el Login */}
            <div className="container-fluid min-vh-100  d-flex align-items-center justify-content-center">
                
                <div className="bg-accent2 bg-opacity-50  rounded col-12 col-sm-8 col-md-5 col-lg-4 p-4 p-md-5 rounded-3 shadow-sm form-card">
                    
                    <h1 className="text-center  fw-bold mb-4 text-dark">
                        Registrarse
                    </h1>

                    <form onSubmit={submit}>
                        {/* --- Campo de Nombre Completo --- */}
                        <div className="mb-3">
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="bg- form-control form-control-lg"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="Nombre completo..."
                            />
                            <InputError message={errors.name} className="mt-2 text-danger" />
                        </div>

                        {/* --- Campo de Nombre de Usuario --- */}
                        <div className="mb-3">
                            <TextInput
                                id="username"
                                name="username"
                                value={data.username}
                                className="form-control form-control-lg"
                                autoComplete="username"
                                onChange={(e) => setData('username', e.target.value)}
                                required
                                placeholder="Nombre de usuario..."
                            />
                            <InputError message={errors.username} className="mt-2 text-danger" />
                        </div>

                        {/* --- Campo de Correo Electrónico --- */}
                        <div className="mb-3">
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="form-control form-control-lg"
                                autoComplete="email"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="Correo electrónico..."
                            />
                            <InputError message={errors.email} className="mt-2 text-danger" />
                        </div>

                        {/* --- Campo de Contraseña --- */}
                        <div className="mb-3">
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="form-control form-control-lg"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                placeholder="Contraseña..."
                            />
                            <InputError message={errors.password} className="mt-2 text-danger" />
                        </div>

                        {/* --- Campo de Confirmar Contraseña --- */}
                        <div className="mb-4">
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="form-control form-control-lg"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                placeholder="Confirmar contraseña..."
                            />
                            <InputError message={errors.password_confirmation} className="mt-2 text-danger" />
                        </div>

                        {/* --- Botón de Registrarse (Centrado) --- */}
                        <div className="d-flex justify-content-center mt-4">
                            <PrimaryButton className="btn btn-primary btn-lg rounded-5" disabled={processing}>
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
