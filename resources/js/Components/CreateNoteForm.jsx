// resources/js/Pages/Admin/Partials/CreateNoteForm.jsx

import React, {useState, useRef} from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import ExtensionBlock from '@/Components/ExtensionBlock';
import { PlusCircle, PlusCircleDotted, PlusCircleFill, EyeFill } from 'react-bootstrap-icons';
import Modal from '@/Components/Modal';
import ViewNoteDetails from '@/Components/ViewNoteDetails'; // Importa el componente de visualización


// Recibimos la función para cerrar el modal como una prop
export default function CreateNoteForm({ onClose, sections = [] }) { 
    const { data, setData, post, processing, errors, reset } = useForm({
        headline: '',
        lead: '',
        body: '',
        closing: '',
        portrait_url: null,
        sections: [],
        media_files: [null, null],
        //Extensiones
        extensions: {
            lead: [],
            body: [],
            closing: [],
        }
    });

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    // Guarda los datos formateados para la previsualización (incluye URLs blob:)
    const [previewData, setPreviewData] = useState(null); 
    // Guarda una referencia a las URLs blob: creadas para poder limpiarlas después
    const blobUrlsRef = useRef([]); 

    const createBlobUrl = (file) => {
        if (!file || !(file instanceof File)) {
            return null; // Si no es un archivo válido, devuelve null
        }
        const url = URL.createObjectURL(file);
        blobUrlsRef.current.push(url); // Guarda la URL para revocarla después
        
        // ✅ Devuelve un objeto con la URL y el tipo
        return {
            url: url,
            type: file.type // ej. "image/jpeg", "video/mp4"
        };
    };

    // Genera el objeto 'nota falsa' para la previsualización
    const generatePreviewData = () => {
        // ... (limpieza de blobUrlsRef - sin cambios) ...
        blobUrlsRef.current.forEach(URL.revokeObjectURL);
        blobUrlsRef.current = [];

        const previewNote = {
            headline: data.headline,
            lead: data.lead,
            body: data.body,
            closing: data.closing,
            
            // ✅ Pasamos la URL blob: directamente a 'portrait_url'
            portrait_url: data.portrait_url ? createBlobUrl(data.portrait_url)?.url : null, 
            
            user: { name: 'Vista Previa' }, 
            publish_date: new Date().toISOString(),
            sections: sections.filter(s => data.sections.includes(s.section_id)), 
            
            // Procesa los archivos multimedia principales
            media: [
                // ✅ Pasamos el objeto { url, type }
                data.media_files[0] ? { ...createBlobUrl(data.media_files[0]), position: 0 } : null,
                data.media_files[1] ? { ...createBlobUrl(data.media_files[1]), position: 1 } : null,
            ].filter(m => m !== null),

            // Procesa las extensiones y sus archivos
            extensions: Object.entries(data.extensions).flatMap(([type, group]) => 
                group.map((ext, index) => ({
                    note_extension_id: `preview_${type}_${index}`,
                    type: type,
                    content: ext.content,
                    position: index,
                    // ✅ Pasamos el objeto { url, type }
                    media: ext.media_file ? createBlobUrl(ext.media_file) : null, 
                }))
            ),
        };
        
        // ... (Tu lógica para añadir media de extensiones al arreglo 'media' principal) ...
        
        return previewNote;
    };

    // Abre el modal de previsualización
    const openPreviewModal = () => {
        const previewNoteData = generatePreviewData();
        setPreviewData(previewNoteData); // Guarda los datos formateados
        setIsPreviewOpen(true); // Abre el modal
    };

    // Cierra el modal de previsualización y limpia las URLs blob:
    const closePreviewModal = () => {
        setIsPreviewOpen(false); // Cierra el modal
        // Limpia todas las URLs blob: que se crearon
        blobUrlsRef.current.forEach(URL.revokeObjectURL);
        blobUrlsRef.current = []; // Resetea la referencia
        setPreviewData(null); // Limpia los datos de previsualización
    };
    // --- Fin Funciones de Previsualización ---


    //Limite de caracteres
    const charLimits = {
        headline: 50,
        lead: 200,
        body: 280,
        closing: 200,
    };

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


    //Funciones de las secciones
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

    //Funciones de las extensiones

    // Añade un nuevo bloque de extensión a un tipo específico (entrada, cuerpo, remate)
    const addExtension = (type) => {
        const currentExtensions = data.extensions[type];
        if (currentExtensions.length < 3) {
            setData('extensions', {
                ...data.extensions,
                [type]: [...currentExtensions, { content: '', media_file: null }],
            });
        }
    };

    const removeExtension = (type, index) => {
        const currentExtensions = data.extensions[type];
        
        // Crea un nuevo arreglo excluyendo el elemento en la posición 'index'
        const updatedExtensions = currentExtensions.filter((_, i) => i !== index);
        
        setData('extensions', {
            ...data.extensions,
            [type]: updatedExtensions,
        });
    };

    // Actualiza el texto de una extensión específica
    const handleExtensionContentChange = (type, index, value) => {
        const updatedExtensions = { ...data.extensions };
        updatedExtensions[type][index].content = value;
        setData('extensions', updatedExtensions);
    };

    // Actualiza el archivo de una extensión específica
    const handleExtensionFileChange = (type, index, file) => {
        const updatedExtensions = { ...data.extensions };
        updatedExtensions[type][index].media_file = file;
        setData('extensions', updatedExtensions);
    };

    //Funciones de archivos
    const handleFileChange = (index, file) => {

        const newMediaFiles = [...data.media_files];

        newMediaFiles[index] = file;

        setData('media_files', newMediaFiles);
    }


    //Calcula si algún campo excede el límite de caracteres

    const isTitleOverLimit = data.headline.length > charLimits.headline;
    const isLeadOverLimit = data.lead.length > charLimits.lead;
    const isBodyOverLimit = data.body.length > charLimits.body;
    const isClosingOverLimit = data.closing.length > charLimits.closing;
    const isFormInvalid = isTitleOverLimit || isLeadOverLimit || isBodyOverLimit || isClosingOverLimit;

    // 1. Buscamos la sección "Reportaje" en las props una sola vez.
    const reportajeSection = sections.find(section => section.name.toLowerCase() === 'reportaje');
    // 2. Usamos su ID para la comprobación. Si no se encuentra, la funcionalidad se deshabilita de forma segura.
    const isReportajeSelected = reportajeSection ? data.sections.includes(reportajeSection.section_id) : false;

    return ( 
        <div>
            <div className='modal-header'>
                
                <h2 className="modal-title">Crear Nueva Nota</h2>
                <button type="button" className="btn-close btn btn-lg" onClick={onClose} aria-label="Close"></button>
            </div>

            
            
            {/* ✅ LA ETIQUETA <form> ENVUELVE TODO EL CONTENIDO Y EL FOOTER */}
            <form onSubmit={submit}>
                <div className='modal-body'>


                    {/* ✅ Botón de Previsualizar */}
                    <button 
                        type="button" 
                        className="btn btn-lg btn-primary rounded-pill m-auto mt-3" // Lo ponemos a la izquierda
                        onClick={openPreviewModal}
                        disabled={!data.headline || !data.lead || !data.body || !data.closing || !data.portrait_url} // Deshabilitado si faltan campos clave
                    >
                        <EyeFill className='me-1'/> Previsualizar
                    </button>
                    
                    {/* Campo: Título */}
                    <div className='mt-4 p-3 rounded bg-warning bg-opacity-50'>
                        <InputLabel htmlFor="título" value="Título" />
                        <TextInput
                            id="headline" value={data.headline} className="form-control mt-1"
                            onChange={(e) => setData('headline', e.target.value)}
                        />
                        <InputError message={errors.headline} className="mt-2" />

                        {/* Contador de caracteres */}
                        <div className={`text-end small ${isTitleOverLimit ? 'text-danger fw-bold' : 'text-muted'}`}>
                            {data.headline.length} / {charLimits.headline}
                        </div>

                        {/* Campo: Imagen de Portada */}
                        <div className="mt-4">
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
                            id="lead" value={data.lead} className="form-control mt-1" rows='4'
                            onChange={(e) => setData('lead', e.target.value)}
                        ></textarea>
                        <InputError message={errors.lead} className="mt-2" />
                        {/* Contador de caracteres */}
                        <div className={`text-end small ${isLeadOverLimit ? 'text-danger fw-bold' : 'text-muted'}`}>
                            {data.lead.length} / {charLimits.lead}
                        </div>
                        

                        {/* Renderizado condicional para las extensiones del lead */}
                        {isReportajeSelected && (
                            <ExtensionBlock 
                                type="lead"
                                label="Entrada"
                                extensions={data.extensions.lead}
                                onAdd={addExtension}
                                onRemove={removeExtension}
                                onContentChange={handleExtensionContentChange}
                                onFileChange={handleExtensionFileChange}
                                borderColorClass="border-secondary"
                            />
                        )}
                    </div>

                    {/* ✅ Campo: Cuerpo (Restaurado y en orden) */}
                    <div className="mt-4 p-3 rounded bg-warning bg-opacity-50">
                        <InputLabel htmlFor="body" value="Cuerpo de la Nota" />
                        <textarea
                            id="body" value={data.body} className="form-control mt-1" rows="6"
                            onChange={(e) => setData('body', e.target.value)}
                        ></textarea>
                        <InputError message={errors.body} className="mt-2" />
                        {/* Contador de caracteres */}
                        <div className={`text-end small ${isBodyOverLimit ? 'text-danger fw-bold' : 'text-muted'}`}>
                            {data.body.length} / {charLimits.body}
                        </div>
                        

                        {/* --- PRIMER INPUT DE ARCHIVO --- */}
                        <div className="mt-4 p-3 border rounded bg-light">
                            <InputLabel value="Contenido Multimedia (después del cuerpo)" />
                            <input type="file" className="form-control mt-1"
                                // Llama al handler con el índice 0
                                onChange={(e) => handleFileChange(0, e.target.files[0])}
                                accept="image/*,video/*,audio/*" 
                            />
                            <InputError message={errors['media_files.0']} className="mt-2" />
                        </div>

                        {/* Renderizado condicional para las extensiones del body*/}
                        {isReportajeSelected && (
                            <ExtensionBlock 
                                type="body"
                                label="Cuerpo"
                                extensions={data.extensions.body}
                                onAdd={addExtension}
                                onRemove={removeExtension}
                                onContentChange={handleExtensionContentChange}
                                onFileChange={handleExtensionFileChange}
                                borderColorClass="border-info"
                            />
                        )}

                    </div>
                    
                    {/* ✅ Campo: Remate (Restaurado y en orden) */}
                    <div className="mt-4 p-3 rounded bg-warning bg-opacity-50">
                        <InputLabel htmlFor="closing" value="Remate" />
                        <textarea
                            id="closing" value={data.closing} className="form-control mt-1" rows='4'
                            onChange={(e) => setData('closing', e.target.value)}
                        ></textarea>

                        <InputError message={errors.closing} className="mt-2" />

                        {/* Contador de caracteres */}

                        <div className={`text-end small ${isClosingOverLimit ? 'text-danger fw-bold' : 'text-muted'}`}>
                            {data.closing.length} / {charLimits.closing}
                        </div>
                        

                        {/* Renderizado condicional para las extensiones del closing*/}

                        {/* --- SEGUNDO INPUT DE ARCHIVO --- */}
                        <div className="mt-4 p-3 border rounded bg-light">
                            <InputLabel value="Contenido Multimedia 2 (después del remate)" />
                            <input type="file" className="form-control mt-1"
                                // Llama al handler con el índice 1
                                onChange={(e) => handleFileChange(1, e.target.files[0])}
                                accept="image/*,video/*,audio/*" 
                            />
                            <InputError message={errors['media_files.1']} className="mt-2" />
                        </div>

                        {isReportajeSelected && (
                            <ExtensionBlock 
                                type="closing"
                                label="Remate"
                                extensions={data.extensions.closing}
                                onAdd={addExtension}
                                onRemove={removeExtension}
                                onContentChange={handleExtensionContentChange}
                                onFileChange={handleExtensionFileChange}
                                borderColorClass="border-secondary"
                            />
                        )}
                        
                        
                    </div>

                </div>

                {/* ✅ EL FOOTER CON EL BOTÓN AHORA ESTÁ DENTRO DEL FORM */}
                <div className="modal-footer">
                    <PrimaryButton type="submit" className='btn btn-success btn-lg rounded-pill d-flex align-items-center text-dark fw-bold' disabled={processing}>
                        <PlusCircleFill className='mx-2 fs-3'/>
                        {processing ? 'Guardando...' : 'Crear nota'}
                    </PrimaryButton>
                </div>
            </form>


            {/* --- ✅ Modal de Previsualización --- */}
            {/* Usamos un Modal grande (lg o xl) y que pueda hacer scroll (scrollable) */}
            <Modal show={isPreviewOpen} onClose={closePreviewModal} maxWidth="xl" closeable={true}>
                {/* Añadimos padding y un fondo blanco para que se vea bien */}
                <div className="p-4"> 
                    <h4 className="fw-bold mb-3">Vista Previa</h4>
                    {/* Renderiza ViewNoteDetails solo si hay datos */}
                    {previewData ? (
                        <ViewNoteDetails note={previewData} onClose={closePreviewModal} /> 
                    ) : (
                        <p>Cargando previsualización...</p> 
                    )}
                    {/* Botón para cerrar la previsualización */}
                    <div className="text-end mt-3">
                        <button type="button" className="btn btn-secondary rounded-pill" onClick={closePreviewModal}>
                            Cerrar Previsualización
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}