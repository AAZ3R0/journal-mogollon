// resources/js/Pages/Admin/Partials/CreateNoteForm.jsx

import React from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import ExtensionBlock from '@/Components/ExtensionBlock';
import { PlusCircle, PlusCircleDotted, PlusCircleFill } from 'react-bootstrap-icons';

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
        </div>
    );
}