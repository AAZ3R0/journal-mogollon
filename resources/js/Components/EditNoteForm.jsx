import React from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { MediaRenderer } from '@/Components/ViewNoteDetails';
import ExtensionBlock from '@/Components/ExtensionBlock';
import { PencilSquare } from 'react-bootstrap-icons';



const groupExtensionsByType = (extensions = []) => {
    const grouped = { lead: [], body: [], closing: [] };
    extensions.forEach(ext => {
        if (grouped[ext.type]) {
            grouped[ext.type].push({
                content: ext.content,
                media_file: null, // Los archivos existentes no se pueden pre-cargar, solo reemplazar
                existing_media: ext.media || null, // Guardamos la info del archivo existente
                existing_media_id: ext.media ? ext.media.media_id : null,
            });
        }
    });
    return grouped;
};

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
        // ✅ PASO 1: Inicializamos el estado de 'extensions' con los datos existentes de la nota
        extensions: groupExtensionsByType(note.extensions),
    });


    const charLimits = {
        headline: 50,
        lead: 500,
        body: 1280,
        closing: 500,
        leadExtension: 500,
        bodyExtension: 1280,
        closingExtension: 500,
    }

    const addExtension = (type) => {
        const currentExtensions = data.extensions[type];
        if (currentExtensions.length < 3) {
            setData('extensions', {
                ...data.extensions,
                [type]: [...currentExtensions, { content: '', media_file: null, existing_media: null }],
            });
        }
    };

    const removeExtension = (type, index) => {
        const extensionToRemove = data.extensions[type][index];

        // Si el párrafo que vamos a quitar tiene un archivo existente, lo añadimos a la lista de borrado.
        if (extensionToRemove && extensionToRemove.existing_media_id) {
            setData('media_to_delete', (prev) => [...prev, extensionToRemove.existing_media_id]);
        }

        const updatedExtensions = data.extensions[type].filter((_, i) => i !== index);
        setData('extensions', {
            ...data.extensions,
            [type]: updatedExtensions,
        });
    };

    const handleExtensionContentChange = (type, index, value) => {
        const updatedExtensions = { ...data.extensions };
        updatedExtensions[type][index].content = value;
        setData('extensions', updatedExtensions);
    };

    const handleExtensionFileChange = (type, index, file) => {
        const updatedExtensions = { ...data.extensions };
        // Al subir un archivo nuevo, borramos la referencia al viejo
        updatedExtensions[type][index].media_file = file;
        updatedExtensions[type][index].existing_media_id = null;
        setData('extensions', updatedExtensions);
    };

    const isHeadlineOverLimit = data.headline.length > charLimits.headline;
    const isLeadOverLimit = data.lead.length > charLimits.lead;
    const isBodyOverLimit = data.body.length > charLimits.body;
    const isClosingOverLimit = data.closing.length > charLimits.closing;
    const isAnyExtensionOverLimit = 
        data.extensions.lead.some(ext => ext.content.length > charLimits.leadExtension) ||
        data.extensions.body.some(ext => ext.content.length > charLimits.bodyExtension) ||
        data.extensions.closing.some(ext => ext.content.length > charLimits.closingExtension);
    const isFormInvalid = isHeadlineOverLimit || isLeadOverLimit || isBodyOverLimit || isClosingOverLimit || isAnyExtensionOverLimit;
    const isFormReportajeInvalid = isHeadlineOverLimit || isLeadOverLimit || isClosingOverLimit || isAnyExtensionOverLimit;


    // Lógica simplificada: encuentra el archivo específico para cada posición
    const existingMedia1 = Array.isArray(note.media) ? note.media.find(m => m.position === 0) : null;
    const existingMedia2 = Array.isArray(note.media) ? note.media.find(m => m.position === 1) : null;

    const reportajeSection = sections.find(section => section.name.toLowerCase() === 'reportaje');
    const isReportajeSelected = reportajeSection ? data.sections.includes(reportajeSection.section_id) : false;

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
                <h2 className="modal-title"><strong>Editar Nota</strong></h2>
                <button type="button" className="btn-close btn btn-lg" onClick={onClose} aria-label="Close"></button>
            </div>

            <form onSubmit={submit}>
                <div className="modal-body p-0">
                    <div className='bg-warning bg-opacity-50 p-3 rounded'>

                        {/* CAMPO TÍTULO */}
                        <InputLabel htmlFor="headline" value="Título" />
                        <TextInput id="headline" value={data.headline} className="form-control mt-1" onChange={(e) => setData('headline', e.target.value)} />
                        
                        <div className='d-flex justify-content-end'>
                            <div className={`mt-2 badge fs-6 ${isHeadlineOverLimit ? 'bg-danger fw-bold' : 'bg-secondary'}`}>
                                {data.headline.length} / {charLimits.headline}
                            </div>
                        </div>
                        
                        <InputError message={errors.headline} className="mt-2" />

                        {/* Imagen de PORTADA*/}        
                        <div className="mt-4 bg-light bg-opacity-50 p-3 rounded">
                            <InputLabel htmlFor="portrait_url" value="Cambiar Imagen de Portada (Opcional)" />
                            <img src={`/storage/${note.portrait_url}`} className="img-fluid rounded mb-3" alt="Portada" />
                            <input type="file" className="form-control mt-1" onChange={(e) => setData('portrait_url', e.target.files[0])} />
                            <InputError message={errors.portrait_url} className="mt-2" />
                        </div>

                    </div>

                    {/* LISTA DE SECCIONES */}
                    <div className="mt-4 bg-warning bg-opacity-50 p-3 rounded">
                        <InputLabel htmlFor="sections" value="Secciones" />
                        <div className="row g-0 d-flex flex-wrap justify-content-between">
                            {sections.map((section) => (
                                <div className="form-check me-3 fs-5 col-4 col-lg-2 mt-3 mt-lg-0" key={section.section_id}>
                                    <input className="form-check-input" type="checkbox" value={section.section_id} id={`edit-section-${section.section_id}`} onChange={handleSectionChange} checked={data.sections.includes(section.section_id)} />
                                    <label className="form-check-label" htmlFor={`edit-section-${section.section_id}`}>{section.name}</label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.sections} className="mt-2" />
                    </div>


                    {/* CAMPO ENTRADA */}
                    <div className="mt-4 bg-warning bg-opacity-50 p-3 rounded">
                        <InputLabel htmlFor="lead" value="Entrada" />
                        <textarea 
                            id="lead" 
                            value={data.lead} 
                            className={`form-control mt-1 ${isLeadOverLimit ? 'is-invalid' : ''}`} 
                            rows='6' 
                            onChange={(e) => setData('lead', e.target.value)}
                        ></textarea>

                        <div className='d-flex justify-content-end'>
                            <div className={`mt-2 badge fs-6 ${isLeadOverLimit ? 'bg-danger fw-bold' : 'bg-secondary'}`}>
                                {data.lead.length} / {charLimits.lead}
                            </div>
                        </div>
                        
                        <InputError message={errors.lead} className="mt-2" />
                    </div>

                    {/* CAMPO CUERPO */}

                    {!isReportajeSelected && (
                        <div className="mt-4 bg-warning bg-opacity-50 p-3 rounded">
                            <InputLabel htmlFor="body" value="Cuerpo de la Nota" />
                            <textarea 
                                id="body" 
                                value={data.body} 
                                className={`form-control mt-1 ${isBodyOverLimit ? 'is-invalid' : ''}`} 
                                rows="20" 
                                onChange={(e) => setData('body', e.target.value)}
                            ></textarea>

                            <div className='d-flex justify-content-end'>
                                <div className={`mt-2 badge fs-6 ${isBodyOverLimit ? 'bg-danger fw-bold' : 'bg-secondary'}`}>
                                    {data.body.length} / {charLimits.body}
                                </div>
                            </div>
                            
                            <InputError message={errors.body} className="mt-2" />

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
                        </div>
                    )}

                    {isReportajeSelected &&(
                        <div className="mt-4 bg-warning bg-opacity-50 p-3 rounded">
                            <InputLabel htmlFor="body" value="Cuerpo de la Nota" />
                            <textarea 
                                id="body" 
                                value={data.body} 
                                className={`form-control mt-1`} 
                                rows="20" 
                                onChange={(e) => setData('body', e.target.value)}
                            ></textarea>
                            
                            <InputError message={errors.body} className="mt-2" />

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
                        </div>
                    )}
                    

                    {/* CAMPO REMATE */}
                    
                    <div className="mt-4 bg-warning bg-opacity-50 p-3 rounded">
                        <InputLabel htmlFor="closing" value="Remate" />
                        <textarea 
                            id="closing" 
                            value={data.closing} 
                            className={`form-control mt-1" ${isClosingOverLimit? 'is-invalid' : '' }`}
                            rows='6' 
                            onChange={(e) => setData('closing', e.target.value)} />
                        
                        <div className='d-flex justify-content-end'>
                            <div className={`mt-2 badge fs-6 ${isClosingOverLimit ? 'bg-danger fw-bold' : 'bg-secondary'}`}>
                                {data.closing.length} / {charLimits.closing}
                            </div>
                        </div>
                        
                        <InputError message={errors.closing} className="mt-2" />

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
                    </div>
                    
                </div>

                <div className="modal-footer">

                    {!isReportajeSelected &&(
                        <PrimaryButton type="submit" className="btn btn-lg btn-warning col-12 col-lg-3 rounded-pill fw-bold text-dark d-flex justify-content-center align-items-center" disabled={processing || isFormInvalid}>
                            <PencilSquare className='me-2 fs-3' ></PencilSquare>
                            {processing ? 'Actualizando...' : 'Actualizar'}
                        </PrimaryButton>
                    )}

                    {isReportajeSelected &&(
                        <PrimaryButton type="submit" className="btn btn-lg btn-warning col-12 col-lg-3 rounded-pill fw-bold text-dark d-flex justify-content-center align-items-center" disabled={processing || isFormReportajeInvalid}>
                            <PencilSquare className='me-2 fs-3' ></PencilSquare>
                            {processing ? 'Actualizando...' : 'Actualizar'}
                        </PrimaryButton>
                    )}
                    
                </div>
            </form>
        </div>
    );
}