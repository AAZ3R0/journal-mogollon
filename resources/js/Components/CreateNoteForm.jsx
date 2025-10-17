// resources/js/Pages/Admin/Partials/CreateNoteForm.jsx

import React from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Textarea } from '@headlessui/react';

// Recibimos la función para cerrar el modal como una prop
export default function CreateNoteForm({ onClose, sections = [] }) { 
    const { data, setData, post, processing, errors, reset } = useForm({
        headline: '',
        lead: '',
        body: '',
        closing: '',
        portrait_url: null,
        sections: [],
        media_files: [],
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

    const handleSectionChange = (e) => {
        const sectionId = parseInt(e.target.value, 10);
        let updatedSections = [...data.sections];

        if (e.target.checked) {
            // Si se marca, añade el ID al arreglo
            updatedSections.push(sectionId);
        } else {
            // Si se desmarca, quita el ID del arreglo
            updatedSections = updatedSections.filter((id) => id !== sectionId);
        }
        setData('sections', updatedSections);
    };

    const handleFileChange = (index, file) => {

        const newMediaFiles = [...data.media_files];

        newMediaFiles[index] = file;

        setData('media_files', newMediaFiles);
    }

    return ( 
        <div>
            <div className='modal-header'>
                <h3 className="modal-title">Crear Nueva Nota</h3>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            
            {/* ✅ LA ETIQUETA <form> ENVUELVE TODO EL CONTENIDO Y EL FOOTER */}
            <form onSubmit={submit}>
                <div className='modal-body'>
                    
                    {/* Campo: Título */}
                    <div>
                        <InputLabel htmlFor="headline" value="Título" />
                        <TextInput
                            id="headline" value={data.headline} className="form-control mt-1"
                            onChange={(e) => setData('headline', e.target.value)}
                        />
                        <InputError message={errors.headline} className="mt-2" />
                    </div>

                    {/* Campo: Entrada */}
                    <div className="mt-4">
                        <InputLabel htmlFor="lead" value="Entrada" />
                        <TextInput
                            id="lead" value={data.lead} className="form-control mt-1"
                            onChange={(e) => setData('lead', e.target.value)}
                        />
                        <InputError message={errors.lead} className="mt-2" />
                    </div>

                    {/* ✅ Campo: Cuerpo (Restaurado y en orden) */}
                    <div className="mt-4">
                        <InputLabel htmlFor="body" value="Cuerpo de la Nota" />
                        <textarea
                            id="body" value={data.body} className="form-control mt-1" rows="5"
                            onChange={(e) => setData('body', e.target.value)}
                        ></textarea>
                        <InputError message={errors.body} className="mt-2" />
                    </div>

                    {/* --- PRIMER INPUT DE ARCHIVO --- */}
                    <div className="mt-4 p-3 border rounded bg-light">
                        <InputLabel value="Contenido Multimedia 1 (después del cuerpo)" />
                        <input type="file" className="form-control mt-1"
                            // Llama al handler con el índice 0
                            onChange={(e) => handleFileChange(0, e.target.files[0])}
                            accept="image/*,video/*,audio/*" 
                        />
                        <InputError message={errors['media_files.0']} className="mt-2" />
                    </div>
                    
                    {/* ✅ Campo: Remate (Restaurado y en orden) */}
                    <div className="mt-4">
                        <InputLabel htmlFor="closing" value="Remate" />
                        <TextInput
                            id="closing" value={data.closing} className="form-control mt-1"
                            onChange={(e) => setData('closing', e.target.value)}
                        />
                        <InputError message={errors.closing} className="mt-2" />
                    </div>

                    <div className="mt-4 p-3 border rounded bg-light">
                        <InputLabel value="Contenido Multimedia 2 (después del remate)" />
                        <input type="file" className="form-control mt-1"
                            // Llama al handler con el índice 1
                            onChange={(e) => handleFileChange(1, e.target.files[0])}
                            accept="image/*,video/*,audio/*" 
                        />
                        <InputError message={errors['media_files.1']} className="mt-2" />
                    </div>

                    {/* Campo: Secciones */}
                    <div className="mt-4">
                        <label className="form-label fw-bold">Secciones</label>
                        <div className="d-flex flex-wrap">
                            {sections.map((section) => (
                                <div className="form-check me-3" key={section.section_id}>
                                    <input
                                        className="form-check-input" type="checkbox" value={section.section_id}
                                        id={`section-${section.section_id}`} onChange={handleSectionChange}
                                        checked={data.sections.includes(section.section_id)}
                                    />
                                    <label className="form-check-label" htmlFor={`section-${section.section_id}`}>
                                        {section.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.sections} className="mt-2" />
                    </div>

                    {/* Campo: Imagen de Portada */}
                    <div className="mt-4">
                        <InputLabel htmlFor="portrait_url" value="Imagen de Portada" />
                        <input
                            type="file" className="form-control mt-1"
                            onChange={(e) => setData('portrait_url', e.target.files[0])}
                        />
                        <InputError message={errors.portrait_url} className="mt-2" />
                    </div>

                </div>

                {/* ✅ EL FOOTER CON EL BOTÓN AHORA ESTÁ DENTRO DEL FORM */}
                <div className="modal-footer">
                    <PrimaryButton type="submit" className='btn btn-success rounded-pill' disabled={processing}>
                        {processing ? 'Guardando...' : 'Guardar Nota'}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}