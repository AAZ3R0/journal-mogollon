// resources/js/Components/DeleteNoteConfirmation.jsx

import React from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from './PrimaryButton';

export default function DeleteNoteConfirmation({ note, onClose }) {
    // Usamos el hook useForm para manejar la petición DELETE
    const { delete: destroy, processing } = useForm();

    const deleteNote = (e) => {
        e.preventDefault();
        
        // Enviamos la petición DELETE a la ruta 'notes.destroy'
        destroy(route('notes.destroy', note.note_id), {
            preserveScroll: true,
            onSuccess: () => onClose(), // Cerramos el modal si la eliminación fue exitosa
        });
    };

    return (
        <div className="text-center">

            <div className='modal-header'>
                <h2 className='moda-title'>Eliminar nota</h2>
                <button type="button" className="btn-close btn btn-lg" onClick={onClose} ></button>
            </div>
            
            <p className="mb-4 bg-light bg-opacity-50 p-3 rounded">
                <h3 className='fw-bold'>¿Estás seguro?</h3>
                Estás a punto de eliminar permanentemente la nota:
                <br />
                <strong>"{note.headline}"</strong>
                <br />
                Esta acción no se puede deshacer.
            </p>

            <div className="d-flex justify-content-center">
                <PrimaryButton type="button" onClick={onClose} className="btn btn-secondary me-3 btn-lg rounded-pill">
                    Cancelar
                </PrimaryButton>
                <PrimaryButton className="btn btn-danger btn-lg rounded-pill" onClick={deleteNote} disabled={processing}>
                    {processing ? 'Eliminando...' : 'Sí, eliminar'}
                </PrimaryButton>
            </div>
        </div>
    );
}