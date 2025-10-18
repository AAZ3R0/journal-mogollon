import React from 'react';
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


    const charLimits = {
        headline: 50,
        lead: 200,
        body: 280,
        closing: 200,
    }

    const isHeadlineOverLimit = data.headline.length > charLimits.headline;
    const isLeadOverLimit = data.lead.length > charLimits.lead;
    const isBodyOverLimit = data.body.length > charLimits.body;
    const isClosingOverLimit = data.closing.length > charLimits.closing;
    const isFormInvalid = isHeadlineOverLimit || isLeadOverLimit || isBodyOverLimit || isClosingOverLimit;


    // Lógica simplificada: encuentra el archivo específico para cada posición
    const existingMedia1 = Array.isArray(note.media) ? note.media.find(m => m.position === 0) : null;
    const existingMedia2 = Array.isArray(note.media) ? note.media.find(m => m.position === 1) : null;

    const handleFileChange = (index, file) => {
        const newMediaFiles = [...data.media_files];
        newMediaFiles[index] = file;
        setData('media_files', newMediaFiles);
    };

    const handleRemoveExistingMedia = (mediaId) => {
        if (!data.media_to_delete.includes(mediaId)) {
            setData('media_to_delete', [...data.media_to_delete, mediaId]);
        }
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
        post(route('notes.update', note.note_id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div>
            <div className="modal-header">
                <h2 className="modal-title">Editar Nota</h2>
                <button type="button" className="btn-close btn btn-lg" onClick={onClose} aria-label="Close"></button>
            </div>

            <form onSubmit={submit}>
                <div className="modal-body">
                    <div>
                        <InputLabel htmlFor="headline" value="Título" />
                        <TextInput id="headline" value={data.headline} className="form-control mt-1" onChange={(e) => setData('headline', e.target.value)} />

                        <div className={`text-end small ${isHeadlineOverLimit ? 'text-danger fw-bold' : 'text-muted'}`}>
                            {data.headline.length} / {charLimits.headline}
                        </div>
                        <InputError message={errors.headline} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="lead" value="Entrada" />
                        <textarea id="lead" value={data.lead} className="form-control mt-1" rows='4' onChange={(e) => setData('lead', e.target.value)}></textarea>
                        <div className={`text-end small ${isLeadOverLimit ? 'text-danger fw-bold' : 'text-muted'}`}>
                            {data.lead.length} / {charLimits.lead}
                        </div>
                        <InputError message={errors.lead} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="body" value="Cuerpo de la Nota" />
                        <textarea id="body" value={data.body} className="form-control mt-1" rows="6" onChange={(e) => setData('body', e.target.value)}></textarea>
                        <div className={`text-end small ${isBodyOverLimit ? 'text-danger fw-bold' : 'text-muted'}`}>
                            {data.body.length} / {charLimits.body}
                        </div>
                        <InputError message={errors.body} className="mt-2" />
                    </div>

                    <div className="mt-4 p-3 rounded bg-light bg-opacity-50">
                        <InputLabel value="Contenido Multimedia 1" />
                        {existingMedia1 && !data.media_to_delete.includes(existingMedia1.media_id) ? (
                            <div>
                                <MediaRenderer file={existingMedia1} index={0} />
                                <button type="button" onClick={() => handleRemoveExistingMedia(existingMedia1.media_id)} className="btn btn-sm btn-danger mt-2">
                                    Quitar archivo existente
                                </button>
                            </div>
                        ) : (
                            <div>
                                <input type="file" className="form-control" onChange={(e) => handleFileChange(0, e.target.files[0])} />
                                <InputError message={errors['media_files.0']} className="mt-2" />
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4">
                        <InputLabel htmlFor="closing" value="Remate" />
                        <textarea id="closing" value={data.closing} className="form-control mt-1" rows='4' onChange={(e) => setData('closing', e.target.value)} />
                        <div className={`text-end small ${isClosingOverLimit ? 'text-danger fw-bold' : 'text-muted'}`}>
                            {data.closing.length} / {charLimits.closing}
                        </div>
                        <InputError message={errors.closing} className="mt-2" />
                    </div>

                    <div className="mt-4 p-3 rounded bg-light bg-opacity-50">
                        <InputLabel value="Contenido Multimedia 2" />
                        {existingMedia2 && !data.media_to_delete.includes(existingMedia2.media_id) ? (
                            <div>
                                <MediaRenderer file={existingMedia2} index={1} />
                                <button type="button" onClick={() => handleRemoveExistingMedia(existingMedia2.media_id)} className="btn btn-sm btn-danger mt-2">
                                    Quitar archivo existente
                                </button>
                            </div>
                        ) : (
                            <div>
                                <input type="file" className="form-control" onChange={(e) => handleFileChange(1, e.target.files[0])} />
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