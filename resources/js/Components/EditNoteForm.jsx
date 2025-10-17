import React from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

// Recibimos la nota a editar, las secciones disponibles y la función de cierre
export default function EditNoteForm({ note, sections = [], onClose }) {
    
    // ✅ CORRECCIÓN 1: Destructuramos 'post' porque es lo que usaremos en submit
    const { data, setData, post, processing, errors, reset } = useForm({
        headline: note.headline || '',
        lead: note.lead || '',
        body: note.body || '',
        closing: note.closing || '',
        portrait_url: null, // Para la nueva imagen, empezamos en null
        sections: note.sections ? note.sections.map(s => s.section_id) : [],
        _method: 'PUT', // Method spoofing para que Laravel lo trate como PUT
    });

    const submit = (e) => {
        e.preventDefault();
        // Usamos 'post' para que la subida de archivos (multipart/form-data) funcione correctamente
        post(route('notes.update', note.note_id), {
            onSuccess: () => onClose(), // Cerramos el modal al tener éxito
        });
    };
    
    // ✅ CORRECCIÓN 2: Añadimos la función que faltaba para manejar los checkboxes
    const handleSectionChange = (e) => {
        const sectionId = parseInt(e.target.value, 10);
        let updatedSections = [...data.sections];

        if (e.target.checked) {
            // Si se marca, añade el ID al arreglo
            if (!updatedSections.includes(sectionId)) {
                updatedSections.push(sectionId);
            }
        } else {
            // Si se desmarca, quita el ID del arreglo
            updatedSections = updatedSections.filter((id) => id !== sectionId);
        }
        setData('sections', updatedSections);
    };

    return (
        <form onSubmit={submit} className="p-4 container">
            <h2 className="text-lg font-medium mb-4">
                Editar Nota: {note.headline}
            </h2>
            
            {/* Campo: Título */}
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

            {/* Campo: Entrada */}
            <div className="mt-4">
                <InputLabel htmlFor="lead" value="Entrada" />
                <TextInput
                    id="lead"
                    value={data.lead}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('lead', e.target.value)}
                />
                <InputError message={errors.lead} className="mt-2" />
            </div>

            {/* Campo: Cuerpo */}
            <div className="mt-4">
                <InputLabel htmlFor="body" value="Cuerpo" />
                <textarea
                    id="body"
                    value={data.body}
                    className="form-control mt-1" // Usando clase de bootstrap para textarea
                    rows="5"
                    onChange={(e) => setData('body', e.target.value)}
                ></textarea>
                <InputError message={errors.body} className="mt-2" />
            </div>

            {/* Campo: Remate */}
            <div className="mt-4">
                <InputLabel htmlFor="closing" value="Remate" />
                <TextInput
                    id="closing"
                    value={data.closing}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('closing', e.target.value)}
                />
                <InputError message={errors.closing} className="mt-2" />
            </div>

            {/* Campo: Secciones */}
            <div className="mt-4">
                <label className="form-label fw-bold">Secciones</label>
                <div className="d-flex flex-wrap">
                    {sections.map((section) => (
                        <div className="form-check me-3" key={section.section_id}>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value={section.section_id}
                                id={`edit-section-${section.section_id}`} // ID único para el modo de edición
                                onChange={handleSectionChange}
                                checked={data.sections.includes(section.section_id)}
                            />
                            <label className="form-check-label" htmlFor={`edit-section-${section.section_id}`}>
                                {section.name}
                            </label>
                        </div>
                    ))}
                </div>
                <InputError message={errors.sections} className="mt-2" />
            </div>

            {/* Campo: Imagen */}
            <div className="mt-4">
                <InputLabel htmlFor="portrait_url" value="Cambiar Imagen de Portada (Opcional)" />
                <input
                    type="file"
                    className="form-control mt-1" // Usando clase de bootstrap para input de archivo
                    onChange={(e) => setData('portrait_url', e.target.files[0])}
                />
                <InputError message={errors.portrait_url} className="mt-2" />
            </div>

            {/* Botones de acción */}
            <div className="mt-6 d-flex justify-content-end">
                <button type="button" onClick={onClose} className="btn btn-secondary me-3">
                    Cancelar
                </button>
                <PrimaryButton className="btn btn-primary" disabled={processing}>
                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                </PrimaryButton>
            </div>
        </form>
    );
}