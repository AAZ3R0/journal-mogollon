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
        <div className="p-4 text-center">
            <h2 className="h4 mb-3">¿Estás seguro?</h2>
            
            <p className="mb-4">
                Estás a punto de eliminar permanentemente la nota:
                <br />
                <strong>"{note.headline}"</strong>
                <br />
                Esta acción no se puede deshacer.
            </p>

            <div className="d-flex justify-content-center">
                <button type="button" onClick={onClose} className="btn btn-secondary me-3">
                    Cancelar
                </button>
                <PrimaryButton className="btn btn-danger" onClick={deleteNote} disabled={processing}>
                    {processing ? 'Eliminando...' : 'Sí, eliminar'}
                </PrimaryButton>
            </div>
        </div>
    );
}