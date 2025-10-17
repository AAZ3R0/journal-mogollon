import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { MediaRenderer } from '@/Components/ViewNoteDetails';

export default function EditNoteForm({ note, sections = [], onClose }) {
    
    const { data, setData, post, processing, errors } = useForm({
        headline: note.headline || '',
        lead: note.lead || '',
        body: note.body || '',
        closing: note.closing || '',
        portrait_url: null,
        sections: note.sections ? note.sections.map((s) => s.section_id) : [],
        _method: 'PUT',
        media_files: [null, null],
        media_to_delete: [],
    });

    const [hiddenMediaIds, setHiddenMediaIds] = useState([]);

    // ✅✅✅ FUNCIÓN CORREGIDA ✅✅✅
    const handleFileChange = (index, file, existingMediaId = null) => {
        const newMediaFiles = [...data.media_files];
        newMediaFiles[index] = file;
        setData('media_files', newMediaFiles);

        if (existingMediaId) {
            // Leemos el estado actual directamente de 'data' y luego lo actualizamos.
            if (!data.media_to_delete.includes(existingMediaId)) {
                setData('media_to_delete', [...data.media_to_delete, existingMediaId]);
            }
        }
    };

    // ✅✅✅ FUNCIÓN CORREGIDA ✅✅✅
    const handleRemoveExistingMedia = (mediaId) => {
        // Leemos el estado actual directamente de 'data' y luego lo actualizamos.
        if (!data.media_to_delete.includes(mediaId)) {
            setData('media_to_delete', [...data.media_to_delete, mediaId]);
        }
        // El estado local de la UI sí puede usar el updater sin problema.
        setHiddenMediaIds((prev) => [...prev, mediaId]);
    };

    const handleSectionChange = (e) => {
        const sectionId = parseInt(e.target.value, 10);
        let updatedSections = [...data.sections];
        if (e.target.checked) {
            if (!updatedSections.includes(sectionId)) {
                updatedSections.push(sectionId);
            }
        } else {
            updatedSections = updatedSections.filter((id) => id !== sectionId);
        }
        setData('sections', updatedSections);
    };

    const submit = (e) => {
        e.preventDefault();
        // Vuelve a añadir el tercer argumento con la opción onSuccess
        post(route('notes.update', note.note_id),{
            onSuccess: () => onClose()
        });
    };

    const existingMedia1 = note.media && note.media[0] ? note.media[0] : null;
    const existingMedia2 = note.media && note.media[1] ? note.media[1] : null;

    return (
        <div>
            <div className="modal-header">
                <h3 className="modal-title">Editar Nota: {note.headline}</h3>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>

            <form onSubmit={submit}>
                <div className="modal-body">
                    
                    <div>
                        <InputLabel htmlFor="headline" value="Título" />
                        <TextInput id="headline" value={data.headline} className="form-control mt-1" onChange={(e) => setData('headline', e.target.value)} />
                        <InputError message={errors.headline} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="lead" value="Entrada" />
                        <TextInput id="lead" value={data.lead} className="form-control mt-1" onChange={(e) => setData('lead', e.target.value)} />
                        <InputError message={errors.lead} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="body" value="Cuerpo de la Nota" />
                        <textarea id="body" value={data.body} className="form-control mt-1" rows="5" onChange={(e) => setData('body', e.target.value)}></textarea>
                        <InputError message={errors.body} className="mt-2" />
                    </div>

                    <div className="mt-4 p-3 border rounded bg-light">
                        <InputLabel value="Contenido Multimedia 1" />
                        {existingMedia1 && !hiddenMediaIds.includes(existingMedia1.media_id) ? (
                            <div>
                                <MediaRenderer file={existingMedia1} index={0} />
                                <button type="button" onClick={() => handleRemoveExistingMedia(existingMedia1.media_id)} className="btn btn-sm btn-danger mt-2">
                                    Quitar archivo existente
                                </button>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) =>
                                        handleFileChange(
                                            0,
                                            e.target.files[0],
                                            existingMedia1 ? existingMedia1.media_id : null
                                        )
                                    }
                                />
                                <InputError message={errors['media_files.0']} className="mt-2" />
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4">
                        <InputLabel htmlFor="closing" value="Remate" />
                        <TextInput id="closing" value={data.closing} className="form-control mt-1" onChange={(e) => setData('closing', e.target.value)} />
                        <InputError message={errors.closing} className="mt-2" />
                    </div>

                    <div className="mt-4 p-3 border rounded bg-light">
                        <InputLabel value="Contenido Multimedia 2" />
                        {existingMedia2 && !hiddenMediaIds.includes(existingMedia2.media_id) ? (
                            <div>
                                <MediaRenderer file={existingMedia2} index={1} />
                                <button type="button" onClick={() => handleRemoveExistingMedia(existingMedia2.media_id)} className="btn btn-sm btn-danger mt-2">
                                    Quitar archivo existente
                                </button>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) =>
                                        handleFileChange(
                                            1,
                                            e.target.files[0],
                                            existingMedia2 ? existingMedia2.media_id : null
                                        )
                                    }
                                />
                                <InputError message={errors['media_files.1']} className="mt-2" />
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4">
                        <label className="form-label fw-bold">Secciones</label>
                        <div className="d-flex flex-wrap">
                            {sections.map((section) => (
                                <div className="form-check me-3" key={section.section_id}>
                                    <input className="form-check-input" type="checkbox" value={section.section_id} id={`edit-section-${section.section_id}`} onChange={handleSectionChange} checked={data.sections.includes(section.section_id)} />
                                    <label className="form-check-label" htmlFor={`edit-section-${section.section_id}`}>{section.name}</label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.sections} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="portrait_url" value="Cambiar Imagen de Portada (Opcional)" />
                        <input type="file" className="form-control mt-1" onChange={(e) => setData('portrait_url', e.target.files[0])} />
                        <InputError message={errors.portrait_url} className="mt-2" />
                    </div>
                </div>

                <div className="modal-footer">
                    <PrimaryButton type="submit" className="btn btn-warning" disabled={processing}>
                        {processing ? 'Actualizando...' : 'Guardar Cambios'}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}