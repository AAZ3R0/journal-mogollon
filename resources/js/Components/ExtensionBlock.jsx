import React from 'react';
import InputLabel from '@/Components/InputLabel';
import { TrashFill } from 'react-bootstrap-icons';
import InputError from '@/Components/InputError'; // Asegúrate de que InputError esté importado
import { MediaRenderer } from '@/Components/ViewNoteDetails'; // Importamos el renderer

export default function ExtensionBlock({ 
    type, 
    label, 
    extensions, 
    onAdd, 
    onContentChange, 
    onFileChange, 
    onRemove, 
    borderColorClass, 
    charLimit, // Prop para el límite de caracteres
    errors = {}, // Prop para los errores (con valor por defecto)
    isEditing = false // Prop para el modo de edición
}) {
    return (
        <div className={`mt-2 ms-4 border-start border-3 ${borderColorClass} ps-3`}>
            {extensions.map((ext, index) => {
                // Calcula si este párrafo excede el límite
                const isOverLimit = charLimit && (ext.content.length > charLimit);
                // Construye la clave de error que enviará Laravel (ej. "extensions.body.0.content")
                const errorKey = `extensions.${type}.${index}.content`;

                return (
                    <div key={index} className="mt-3 p-2 rounded bg-light bg-opacity-50">
                        <div className="d-flex justify-content-between align-items-center">
                            <InputLabel htmlFor={`ext_${type}_${index}`} value={`Párrafo extra de ${label} #${index + 1}`} />
                            <button 
                                type="button" 
                                onClick={() => onRemove(type, index)} 
                                className="btn btn-sm btn-outline-danger"
                                title={`Quitar párrafo #${index + 1}`}
                            >
                                <TrashFill />
                            </button>
                        </div>
                        
                        <textarea 
                            id={`ext_${type}_${index}`} 
                            value={ext.content} 
                            // Añade clase de error si excede el límite O si el backend devuelve un error
                            className={`form-control mt-1 ${isOverLimit || errors[errorKey] ? 'is-invalid' : ''}`}
                            rows="4" 
                            onChange={(e) => onContentChange(type, index, e.target.value)}
                        ></textarea>
                        
                        {/* Muestra el contador de caracteres si se proporcionó un límite */}
                        {charLimit && (
                            <div className={`text-end small ${isOverLimit ? 'text-danger fw-bold' : 'text-muted'}`}>
                                {ext.content.length} / {charLimit}
                            </div>
                        )}

                        {/* Muestra el error del backend si existe */}
                        <InputError message={errors[errorKey]} className="mt-2" />
                        
                        {/* Lógica para mostrar archivo existente o input para uno nuevo */}
                        {isEditing && ext.existing_media ? (
                            <div className='mt-2'>
                                <p className='small text-muted mb-1'>Archivo actual:</p>
                                <MediaRenderer file={ext.existing_media} index={index} />
                                <label className='small text-muted mt-2'>Reemplazar archivo (opcional):</label>
                                <input type="file" className="form-control form-control-sm" onChange={(e) => onFileChange(type, index, e.target.files[0])} accept="image/*,video/*,audio/*"/>
                            </div>
                        ) : (
                            <input 
                                type="file" 
                                className="form-control mt-2" 
                                onChange={(e) => onFileChange(type, index, e.target.files[0])} 
                                accept="image/*,video/*,audio/*"
                            />
                        )}
                    </div>
                );
            })}
            {extensions.length < 3 && (
                <button type="button" onClick={() => onAdd(type)} className={`btn btn-sm btn-outline-${borderColorClass.split('-')[1]} mt-3`}>
                    + Añadir párrafo extra a {label.toLowerCase()}
                </button>
            )}
        </div>
    );
}