// resources/js/Pages/Profile/Partials/DeleteUserForm.jsx

import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

// ✅ Recibe 'show' y 'onClose' como props
export default function DeleteUserForm({ className = '', show, onClose }) {
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
        <Modal show={show} onClose={closeModal}>
            <form onSubmit={deleteUser} className="p-4 p-md-5">
                <h5 className="fw-bold fs-3 text-dark mb-4">
                    ¿Estás seguro de que quieres eliminar tu cuenta?
                </h5>

                <p className="mt-1 text-sm text-gray-600">
                    Una vez que tu cuenta sea eliminada, todos sus recursos y datos serán borrados permanentemente. 
                    Por favor, ingresa tu contraseña para confirmar que deseas eliminar tu cuenta de forma permanente.
                </p>

                <div className="mt-4">
                    <label htmlFor="delete_password" className="form-label fw-bold">Contraseña:</label>
                    <TextInput
                        id="delete_password"
                        type="password"
                        name="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="form-control rounded-pill"
                        isFocused
                        placeholder="Contraseña"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 d-flex justify-content-end">
                    <button
                        type="button"
                        className="btn btn-secondary rounded-pill me-3 px-4"
                        onClick={closeModal}
                        disabled={processing}
                    >
                        Cancelar
                    </button>
                    
                    {/* Usamos un botón de Bootstrap en lugar del DangerButton de Breeze/Tailwind */}
                    <button
                        type="submit"
                        className="btn btn-danger rounded-pill px-4"
                        disabled={processing}
                    >
                        {processing ? 'Eliminando...' : 'Eliminar Cuenta'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}