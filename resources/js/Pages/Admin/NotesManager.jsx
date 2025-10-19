import React, { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import CreateNoteForm from '@/Components/CreateNoteForm';
import ViewNoteDetails from '@/Components/ViewNoteDetails';
import EditNoteForm from '@/Components/EditNoteForm';
import DeleteNoteConfirmation from '@/Components/DeleteNoteConfirmation';
import axios from 'axios';
import { CircleFill, Newspaper, Paperclip, PencilFill, PencilSquare, PlusCircleFill, Trash2Fill, TrashFill } from 'react-bootstrap-icons';

export default function NotesManager({auth, notes, sections, success }) {

    // Modal de Creación
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const openCreateModal = () => setCreateModalOpen(true);
    const closeCreateModal = () => setCreateModalOpen(false);

    // Modal de Visualización
    const [viewingNote, setViewingNote] = useState(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);

    const openViewModal = (note) => {
        axios.get(route('notes.show', note.note_id)).then(response => {
            setViewingNote(response.data);
            setViewModalOpen(true);
        });
    }

    const closeViewModal = () => {
        setViewModalOpen(false);
        setViewingNote(null);
    }

    // Modal de Edición
    const [editingNote, setEditingNote] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    
    // ✅✅✅ ESTA ES LA ÚNICA CORRECCIÓN NECESARIA ✅✅✅
    const openEditModal = (note) => {
        // Debe llamar a 'notes.show' para OBTENER los datos, no a 'notes.update'.
        axios.get(route('notes.show', note.note_id)).then(response => {
            setEditingNote(response.data); // Ahora sí recibe el objeto 'note' con su arreglo 'media'
            setEditModalOpen(true);
        });
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditingNote(null);
    };

    // Modal de Eliminación
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
            
            <div className="container py-5">
                <div className="bg-accent2 bg-opacity-50 rounded p-4 mb-4">
                    <h1 className="h2"><b>ADMINISTRAR NOTAS</b></h1>
                    <PrimaryButton onClick={openCreateModal} className='btn btn-success btn-lg text-dark mt-3 rounded-pill d-flex align-items-stretch'>
                        <PlusCircleFill className='fs-3 mx-2'/>CREAR NOTA
                    </PrimaryButton>
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered border-dark">
                        <thead className='text-center'>
                            <tr>
                                <th className='bg-warning text-dark h4'>Foto de portada</th>
                                <th className='bg-warning text-dark h4'>Título</th>
                                <th className='bg-warning text-dark h4'>Secciones</th>
                                <th className='bg-warning text-dark h4'>Fecha</th>
                                <th className='bg-warning text-dark h4'>Autor</th>
                                <th className='bg-warning text-dark h4'>Operaciones</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {notes.map((note) => (
                                <tr key={note.note_id}> 
                                    <td className='bg-accent2 bg-opacity-50 '><img src={`/storage/${note.portrait_url}`} className='img-thumbnail' style={{width:"20rem",height:"auto"}}/></td>
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
                                        <button onClick={() => openViewModal(note)} className='text-dark btn btn-transparent'><Newspaper className='fs-1'/></button> 
                                        <button onClick={() => openEditModal(note)} className='badge text-dark btn btn-transparent'><PencilSquare className='fs-1'/></button> 
                                        <button onClick={() => openDeleteModal(note)} className='badge text-dark btn btn-transparent'><TrashFill className='fs-1'/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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