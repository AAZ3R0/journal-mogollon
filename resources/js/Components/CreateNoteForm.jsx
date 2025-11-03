import React, {useState, useRef} from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import ExtensionBlock from '@/Components/ExtensionBlock';
import { PlusCircle, PlusCircleDotted, PlusCircleFill, EyeFill } from 'react-bootstrap-icons';
import Modal from '@/Components/Modal';
import ViewNoteDetails from '@/Components/ViewNoteDetails';


export default function CreateNoteForm({ 
    data, 
    setData, 
    errors, 
    processing, 
    onSubmit, 
    onClose, 
    sections = [] 
}) { 

    // --- Lógica de Previsualización (Sigue viviendo aquí) ---
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null); 
    const blobUrlsRef = useRef([]); 
    
    const createBlobUrl = (file) => {
        if (!file || !(file instanceof File)) { return null; }
        const url = URL.createObjectURL(file);
        blobUrlsRef.current.push(url); 
        return { url: url, type: file.type };
    };
    
    const generatePreviewData = () => {
        blobUrlsRef.current.forEach(URL.revokeObjectURL);
        blobUrlsRef.current = [];
        const previewNote = {
            headline: data.headline,
            lead: data.lead,
            body: data.body,
            closing: data.closing,
            portrait_url: data.portrait_url ? createBlobUrl(data.portrait_url)?.url : null, 
            user: { name: 'Vista Previa' }, 
            publish_date: new Date().toISOString(),
            sections: sections.filter(s => data.sections.includes(s.section_id)), 
            media: [
                data.media_files[0] ? { ...createBlobUrl(data.media_files[0]), position: 0 } : null,
                data.media_files[1] ? { ...createBlobUrl(data.media_files[1]), position: 1 } : null,
            ].filter(m => m !== null),
            extensions: Object.entries(data.extensions).flatMap(([type, group]) => 
                group.map((ext, index) => ({
                    note_extension_id: `preview_${type}_${index}`,
                    type: type,
                    content: ext.content,
                    position: index,
                    media: ext.media_file ? createBlobUrl(ext.media_file) : null, 
                }))
            ),
        };
        // (Tu lógica para añadir media de extensiones al arreglo 'media' principal)
        return previewNote;
    };

    const openPreviewModal = () => {
        const previewNoteData = generatePreviewData();
        setPreviewData(previewNoteData);
        setIsPreviewOpen(true);
    };
    
    const closePreviewModal = () => {
        setIsPreviewOpen(false);
        blobUrlsRef.current.forEach(URL.revokeObjectURL);
        blobUrlsRef.current = [];
        setPreviewData(null);
    };
    // --- Fin Previsualización ---

    //Limite de caracteres
    const charLimits = {
        headline: 50,
        lead: 200,
        body: 280,
        closing: 200,
        leadExtension: 200,
        bodyExtension: 280,
        closingExtension: 200,
    };

    // --- Funciones 'handle' ahora usan 'setData' de las props ---
    const handleSectionChange = (e) => {
        const sectionId = parseInt(e.target.value, 10);
        let updatedSections = [...data.sections];
        if (e.target.checked) {
            updatedSections.push(sectionId);
        } else {
            updatedSections = updatedSections.filter((id) => id !== sectionId);
        }
        setData('sections', updatedSections); // Llama a la función del padre
    };

    const addExtension = (type) => {
        const currentExtensions = data.extensions[type];
        if (currentExtensions.length < 3) {
            setData('extensions', { // Llama a la función del padre
                ...data.extensions,
                [type]: [...currentExtensions, { content: '', media_file: null }],
            });
        }
    };
    
    const removeExtension = (type, index) => {
        const currentExtensions = data.extensions[type];
        const updatedExtensions = currentExtensions.filter((_, i) => i !== index);
        setData('extensions', { // Llama a la función del padre
            ...data.extensions,
            [type]: updatedExtensions,
        });
    };

    const handleExtensionContentChange = (type, index, value) => {
        const updatedExtensions = { ...data.extensions };
        updatedExtensions[type][index].content = value;
        setData('extensions', updatedExtensions); // Llama a la función del padre
    };

    const handleExtensionFileChange = (type, index, file) => {
        const updatedExtensions = { ...data.extensions };
        updatedExtensions[type][index].media_file = file;
        setData('extensions', updatedExtensions); // Llama a la función del padre
    };

    const handleFileChange = (index, file) => {
        const newMediaFiles = [...data.media_files];
        newMediaFiles[index] = file;
        setData('media_files', newMediaFiles); // Llama a la función del padre
    };

    // ... (Lógica de validación 'isFormInvalid' no cambia) ...
    const isTitleOverLimit = data.headline.length > charLimits.headline;
    const isLeadOverLimit = data.lead.length > charLimits.lead;
    const isBodyOverLimit = data.body.length > charLimits.body;
    const isClosingOverLimit = data.closing.length > charLimits.closing;
    const isAnyExtensionOverLimit = 
        data.extensions.lead.some(ext => ext.content.length > charLimits.leadExtension) ||
        data.extensions.body.some(ext => ext.content.length > charLimits.bodyExtension) ||
        data.extensions.closing.some(ext => ext.content.length > charLimits.closingExtension);
    const isFormInvalid = isTitleOverLimit || isLeadOverLimit || isBodyOverLimit || isClosingOverLimit || isAnyExtensionOverLimit;

    // ... (Lógica de 'isReportajeSelected' no cambia) ...
    const reportajeSection = sections.find(section => section.name.toLowerCase() === 'reportaje');
    const isReportajeSelected = reportajeSection ? data.sections.includes(reportajeSection.section_id) : false;

    return ( 
        <div>
            <div className='modal-header'>
                <h2 className="modal-title">Crear Nueva Nota</h2>
                <button type="button" className="btn-close btn btn-lg" onClick={onClose} aria-label="Close"></button>
            </div>
            
            {/* ✅ El formulario ahora llama a 'onSubmit' de las props */}
            <form onSubmit={onSubmit}>
                <div className='modal-body'>
                    
                    {/* Botón de Previsualizar */}
                    <button 
                        type="button" 
                        className="btn btn-lg btn-primary rounded-pill m-auto mt-3 col-12"
                        onClick={openPreviewModal}
                        disabled={!data.headline || !data.lead || !data.body || !data.closing || !data.portrait_url}
                    >
                        <EyeFill className='me-1'/> Previsualizar
                    </button>
                    
                    {/* Campo: Título */}
                    <div className='mt-4 p-3 rounded bg-warning bg-opacity-50'>
                        <InputLabel htmlFor="título" value="Título" />
                        <TextInput
                            id="headline" value={data.headline} 
                            className={`form-control mt-1 ${isTitleOverLimit ? 'is-invalid' : ''}`}
                            onChange={(e) => setData('headline', e.target.value)}
                        />
                        <div className={`text-end small ${isTitleOverLimit ? 'text-danger fw-bold' : 'text-muted'}`}>{data.headline.length} / {charLimits.headline}</div>
                        <InputError message={errors.headline} className="mt-2" />

                        {/* Campo: Imagen de Portada */}
                        <div className="mt-4 p-3 rounded bg-light bg-opacity-50">
                            <InputLabel htmlFor="foto de portada" value="Imagen de Portada" />
                            <input
                                type="file" className="form-control mt-1"
                                onChange={(e) => setData('portrait_url', e.target.files[0])}
                            />
                            <InputError message={errors.portrait_url} className="mt-2" />
                        </div>
                    </div>
                    
                    {/* Campo: Secciones */}
                    <div className="mt-4 p-3 rounded bg-warning bg-opacity-50">
                        <InputLabel htmlFor="sections" value="Secciones" />
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

                    {/* Campo: Entrada */}
                    <div className="mt-4 p-3 rounded bg-warning bg-opacity-50">
                        <InputLabel htmlFor="lead" value="Entrada" />
                        <textarea
                            id="lead" value={data.lead} 
                            className={`form-control mt-1 ${isLeadOverLimit ? 'is-invalid' : ''}`} 
                            rows='4'
                            onChange={(e) => setData('lead', e.target.value)}
                        ></textarea>
                        <div className={`text-end small ${isLeadOverLimit ? 'text-danger fw-bold' : 'text-muted'}`}>{data.lead.length} / {charLimits.lead}</div>
                        <InputError message={errors.lead} className="mt-2" />
                        
                        {isReportajeSelected && (
                            <ExtensionBlock 
                                type="lead" label="Entrada" extensions={data.extensions.lead}
                                onAdd={addExtension} onRemove={removeExtension}
                                onContentChange={handleExtensionContentChange}
                                onFileChange={handleExtensionFileChange}
                                borderColorClass="border-secondary"
                                charLimit={charLimits.leadExtension}
                                errors={errors}
                            />
                        )}
                    </div>

                    {/* Campo: Cuerpo */}
                    <div className="mt-4 p-3 rounded bg-warning bg-opacity-50">
                        <InputLabel htmlFor="body" value="Cuerpo de la Nota" />
                        <textarea
                            id="body" value={data.body} 
                            className={`form-control mt-1 ${isBodyOverLimit ? 'is-invalid' : ''}`} 
                            rows="6"
                            onChange={(e) => setData('body', e.target.value)}
                        ></textarea>
                        <div className={`text-end small ${isBodyOverLimit ? 'text-danger fw-bold' : 'text-muted'}`}>{data.body.length} / {charLimits.body}</div>
                        <InputError message={errors.body} className="mt-2" />

                        <div className="mt-4 p-3 rounded bg-light bg-opacity-50">
                            <InputLabel value="Contenido Multimedia (después del cuerpo)" />
                            <input type="file" className="form-control mt-1"
                                onChange={(e) => handleFileChange(0, e.target.files[0])}
                                accept="image/*,video/*,audio/*" 
                            />
                            <InputError message={errors['media_files.0']} className="mt-2" />
                        </div>

                        {isReportajeSelected && (
                            <ExtensionBlock 
                                type="body" label="Cuerpo" extensions={data.extensions.body}
                                onAdd={addExtension} onRemove={removeExtension}
                                onContentChange={handleExtensionContentChange}
                                onFileChange={handleExtensionFileChange}
                                borderColorClass="border-info"
                                charLimit={charLimits.bodyExtension}
                                errors={errors}
                            />
                        )}
                    </div>
                    
                    {/* Campo: Remate */}
                    <div className="mt-4 p-3 rounded bg-warning bg-opacity-50">
                        <InputLabel htmlFor="closing" value="Remate" />
                        <textarea
                            id="closing" value={data.closing} 
                            className={`form-control mt-1 ${isClosingOverLimit ? 'is-invalid' : ''}`} 
                            rows='4'
                            onChange={(e) => setData('closing', e.target.value)}
                        ></textarea>
                        <div className={`text-end small ${isClosingOverLimit ? 'text-danger fw-bold' : 'text-muted'}`}>{data.closing.length} / {charLimits.closing}</div>
                        <InputError message={errors.closing} className="mt-2" />

                        <div className="mt-4 p-3 rounded bg-light bg-opacity-50">
                            <InputLabel value="Contenido Multimedia 2 (después del remate)" />
                            <input type="file" className="form-control mt-1"
                                onChange={(e) => handleFileChange(1, e.target.files[0])}
                                accept="image/*,video/*,audio/*" 
                            />
                            <InputError message={errors['media_files.1']} className="mt-2" />
                        </div>

                        {isReportajeSelected && (
                            <ExtensionBlock 
                                type="closing" label="Remate" extensions={data.extensions.closing}
                                onAdd={addExtension} onRemove={removeExtension}
                                onContentChange={handleExtensionContentChange}
                                onFileChange={handleExtensionFileChange}
                                borderColorClass="border-secondary"
                                charLimit={charLimits.closingExtension}
                                errors={errors}
                            />
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    <PrimaryButton type="submit" className='btn btn-success btn-lg rounded-pill d-flex align-items-center text-dark fw-bold' disabled={processing || isFormInvalid}>
                        <PlusCircleFill className='me-2 fs-3'/>
                        {processing ? 'Guardando...' : 'Crear nota'}
                    </PrimaryButton>
                </div>
            </form>

            <Modal show={isPreviewOpen} onClose={closePreviewModal} size="lg" closeable={true}>
                <div className="p-3"> 
                    <h2 className="fw-bold mb-3">Vista Previa</h2>
                    {previewData ? (
                        <ViewNoteDetails note={previewData} onClose={closePreviewModal} /> 
                    ) : (
                        <p>Cargando previsualización...</p> 
                    )}
                    <div className="text-end mt-3">
                        <button type="button" className="btn btn-secondary rounded-pill col-12" onClick={closePreviewModal}>
                            Cerrar Previsualización
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}