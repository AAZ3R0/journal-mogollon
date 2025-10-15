// resources/js/Pages/Admin/Partials/CreateNoteForm.jsx

import React from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

// Recibimos la función para cerrar el modal como una prop
export default function CreateNoteForm({ onClose }) { 
    const { data, setData, post, processing, errors, reset } = useForm({
        headline: '',
        lead: '',
        body: '',
        closing: '',
        portrait_url: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('notes.store'), {
            preserveScroll: true, // Mantiene la posición del scroll al recargar los datos
            onSuccess: () => {
                reset();    // Limpia los campos del formulario
                onClose();  // ✅ ¡Aquí cerramos el modal!
            },
        });
    };

    return (


        <form onSubmit={submit} className="p-4 container">
            <h2 className="text-lg font-medium mb-4">
                Crear Nueva Nota
            </h2>
            
            {/* ... Aquí van todos tus campos del formulario (TextInput, textarea, input file) ... */}
            {/* Ejemplo con un campo */}
            <div>
                <InputLabel htmlFor="headline" value="Título" />
                <TextInput
                    id="headline"
                    value={data.headline}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('headline', e.target.value)}
                />
                <InputError message={errors.headline} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="lead" value="Entrada" />
                <TextInput
                    id="lead"
                    value={data.lead}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('lead', e.target.value)}
                />
                <InputError message={errors.lead} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="body" value="Cuerpo" />
                <TextInput
                    id="body"
                    value={data.body}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('body', e.target.value)}
                />
                <InputError message={errors.body} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="closing" value="Remate" />
                <TextInput
                    id="closing"
                    value={data.closing}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('closing', e.target.value)}
                />
                <InputError message={errors.closing} className="mt-2" />
            </div>

            {/* Input para el archivo */}
            <div className="mt-4">
                <InputLabel htmlFor="portrait_url" value="Imagen de Portada" />
                <input
                    type="file"
                    className="mt-1 block w-full"
                    onChange={(e) => setData('portrait_url', e.target.files[0])}
                />
                <InputError message={errors.portrait_url} className="mt-2" />
            </div>


            <div className="mt-6 flex justify-end">
                <button type="button" onClick={onClose} className="btn btn-secondary mr-3">
                    Cancelar
                </button>
                <PrimaryButton disabled={processing}>
                    {processing ? 'Guardando...' : 'Guardar Nota'}
                </PrimaryButton>
            </div>
        </form>

        
    );
}