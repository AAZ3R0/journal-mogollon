import React, { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout'; // O tu layout principal
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal'; // Crearemos este componente a continuación
import CreateNoteForm from '@/Components/CreateNoteForm'; // Y este también
import ViewNoteDetails from '@/Components/ViewNoteDetails';
import EditNoteForm from '@/Components/EditNoteForm';
import DeleteNoteConfirmation from '@/Components/DeleteNoteConfirmation';
import axios from 'axios';


export default function NotesManager({auth, notes, sections, success }) { // Recibes las notas y mensajes flash
    
    // Estado para controlar la visibilidad del modal
    

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const openCreateModal = () => setCreateModalOpen(true);
    const closeCreateModal = () => setCreateModalOpen(false);

    //-- MODAL DE VISUALIZACIÖN ---

    const [viewingNote, setViewingNote] = useState(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);

    const openViewModal = (note) => {
        axios.get(route('notes.show', note.note_id)).then(response => {
            
            setViewingNote(response.data);
            setViewModalOpen(true);
        })
    }

    const closeViewModal = () => {
        setViewModalOpen(false);
        setViewingNote(null);
    }

    // --- ESTADO PARA EL MODAL DE EDICIÓN ---
    const [editingNote, setEditingNote] = useState(null); // Guardará la nota a editar
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const openEditModal = (note) => {
        setEditingNote(note); // Guardamos la nota seleccionada en el estado
        setEditModalOpen(true); // Abrimos el modal
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditingNote(null); // Limpiamos el estado al cerrar
    };

    // --- ESTADO PARA EL MODAL DE ELIMINACIÓN ---
    const [deletingNote, setDeletingNote] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const openDeleteModal = (note) => {
        setDeletingNote(note);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setDeletingNote(null);
    };


    return (
        <AuthenticatedLayout>
            <Head title="Administrador de Notas" />
            
            {/* ✅ Contenedor principal ÚNICO que envuelve todo el contenido de la página */}
            <div className="container py-5">

                {/* --- Encabezado de la página --- */}
                {/* ❌ Se eliminó la clase .container y m-auto de este div */}
                <div className="bg-accent2 bg-opacity-50 rounded p-4 mb-4">
                    <h1 className="h2"><b>ADMINISTRAR NOTAS</b></h1>
                    <PrimaryButton onClick={openCreateModal} className='btn btn-success btn-lg mt-3'>
                        <b>CREAR NOTA</b>
                    </PrimaryButton>
                </div>

                {/* --- Tabla Responsiva --- */}
                {/* El div que la envuelve ya no necesita la clase .container */}
                <div className="table-responsive">
                    <table className="table table-bordered border-dark">
                        {/* ... tu thead y tbody no necesitan cambios ... */}
                        <thead className='text-center'>
                            <tr>
                                <th className='bg-warning py-4 text-dark h4'>Foto de portada</th>
                                <th className='bg-warning py-4 text-dark h4'>Título</th>
                                <th className='bg-warning py-4 text-dark h4'>Secciones</th>
                                <th className='bg-warning py-4 text-dark h4'>Fecha</th>
                                <th className='bg-warning py-4 text-dark h4'>Autor</th>
                                <th className='bg-warning py-4 text-dark h4'>Operaciones</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {notes.map((note) => (
                                <tr key={note.note_id}> 
                                    <td className='bg-accent2 bg-opacity-50'><img src={`/storage/${note.portrait_url}`} className='img-thumbnail' style={{width:"15rem",height:"10rem"}}/></td>
                                    <td className='bg-accent2 bg-opacity-50 text-dark h5'>{note.headline}</td>
                                    <td className='bg-accent2 bg-opacity-50 align-middle'>
                                        <div className="d-flex flex-wrap justify-content-center">
                                            {Array.isArray(note.sections) && note.sections.map((section) => (
                                                <span key={section.section_id} className="badge bg-primary me-1 mb-1">
                                                    {section.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className='bg-accent2 bg-opacity-50 text-dark h5'>{new Date(note.publish_date).toLocaleDateString()}</td>
                                    <td className='bg-accent2 bg-opacity-50 text-dark h5'>{note.user? note.user.name : 'Autor no encontrado'}</td>
                                    <td className='bg-accent2 bg-opacity-50 text-dark h5'>
                                        <button onClick={() => openViewModal(note)} className='btn btn-info text-accent2'>Ver</button> 
                                        <button onClick={() => openEditModal(note)} className='btn btn-warning text-accent2'>Editar</button> 
                                        <button onClick={() => openDeleteModal(note)} className='btn btn-danger text-accent2'>eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Modales --- */}
            {/* La posición de los modales en el JSX no afecta su layout visual */}
            <Modal show={isCreateModalOpen} onClose={closeCreateModal}>
                <CreateNoteForm onClose={closeCreateModal} sections={sections} />
            </Modal>

            <Modal show={isViewModalOpen} onClose={closeViewModal}>
                {viewingNote && <ViewNoteDetails note={viewingNote} onClose={closeViewModal} />}
            </Modal>
            
            <Modal show={isEditModalOpen} onClose={closeEditModal} >
                {editingNote && <EditNoteForm note={editingNote} sections={sections} onClose={closeEditModal} />}
            </Modal>

            <Modal show={isDeleteModalOpen} onClose={closeDeleteModal}>
                {deletingNote && <DeleteNoteConfirmation note={deletingNote} onClose={closeDeleteModal} />}
            </Modal>
            
        </AuthenticatedLayout>
    );
}