// resources/js/Pages/Profile/Edit.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Details({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Perfil" />

            {/* Ya no necesitamos el 'header' prop, 
              porque el título "Perfil de: AZ3R0" 
              lo hemos puesto DENTRO del componente 'UpdateProfileInformationForm'.
            */}

            {/* Usamos la rejilla de Bootstrap para centrar el contenido.
              El 'container' principal ya viene en <AuthenticatedLayout>.
            */}
            <div className="row justify-content-center">
                {/* Definimos una columna de 8 (de 12) en pantallas grandes (lg)
                  y de 10 en medianas (md). Esto reemplaza a 'max-w-7xl'.
                  Esto centrará y dará el ancho deseado a tus tarjetas.
                */}
                

                {/* Este componente ya tiene la <div class="card"> DENTRO
                  gracias a la modificación anterior.
                  Añadimos un margen inferior 'mb-4' para separarlo del siguiente.
                */}
                <div className="mb-4">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                {/* Estos componentes aún no los hemos modificado internamente.
                  Así que los envolvemos en la misma estructura de tarjeta
                  para que se vean igual que el primero.
                */}
                
            </div>
        </AuthenticatedLayout>
    );
}