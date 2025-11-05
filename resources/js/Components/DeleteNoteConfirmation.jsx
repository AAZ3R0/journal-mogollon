// resources/js/Components/DeleteNoteConfirmation.jsx

import React from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from './PrimaryButton';
import { Trash, Trash2, Trash2Fill, Trash3, TrashFill } from 'react-bootstrap-icons';

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

            <div className='modal-header border-0'>
                <h2 className='moda-title fw-bold  mb-2'>Eliminar nota</h2>
                <button type="button" className="btn-close btn btn-lg" onClick={onClose} ></button>
            </div>
            
            <p className="mb-4 bg-light bg-opacity-50 p-3 rounded">
                <h3 className='fw-bold mb-2'>¿Estás seguro?</h3>
                <p>Estás a punto de eliminar permanentemente la nota:</p>
                <h4 className='mb-3 fw-bold'>"{note.headline}"</h4>
                <h6 className='fst-italic'>Esta acción no se puede deshacer.</h6>
                
            </p>

            <div className="d-flex justify-content-end">
                <PrimaryButton className="col-12 col-lg-4 btn btn-lg btn-danger d-flex justify-content-center align-items-center fw-bold rounded-pill" onClick={deleteNote} disabled={processing}>
                    <TrashFill className='fs-3 me-2'></TrashFill>
                    {processing ? 'Eliminando...' : 'Eliminar'}
                </PrimaryButton>
            </div>
        </div>
    );
}