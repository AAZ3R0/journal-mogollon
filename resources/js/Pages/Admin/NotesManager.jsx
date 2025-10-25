import React, { useState } from 'react';
import { Link, Head, useForm, usePage } from '@inertiajs/react'; // <-- Importa useForm AQUÍ
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
import DashboardOptions from '@/Components/Dashboard';


export default function NotesManager({auth, notes, sections, featuredNote, success }) {

    // --- LÓGICA DEL FORMULARIO DE CREACIÓN (AHORA VIVE AQUÍ) ---
    const { 
        data: createFormData, 
        setData: setCreateFormData, 
        post: postCreateForm, 
        processing: createProcessing, 
        errors: createErrors, 
        reset: resetCreateForm 
    } = useForm({
        headline: '',
        lead: '',
        body: '',
        closing: '',
        portrait_url: null,
        sections: [],
        media_files: [null, null],
        extensions: {
            lead: [],
            body: [],
            closing: [],
        }
    });

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const openCreateModal = () => setCreateModalOpen(true);
    
    // Modificamos el cierre: ya no resetea el formulario
    const closeCreateModal = () => setCreateModalOpen(false);

    // La función 'submit' ahora vive aquí y usa los datos del estado padre
    const submitCreateNote = (e) => {
        e.preventDefault();
        postCreateForm(route('notes.store'), {
            preserveScroll: true,
            onSuccess: () => {
                resetCreateForm(); // Resetea el formulario SOLO si fue exitoso
                closeCreateModal(); // Cierra el modal
            },
        });
    };
    // --- FIN LÓGICA DEL FORMULARIO DE CREACIÓN ---


    // --- (Tus otros estados de modal no cambian) ---
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
    const [editingNote, setEditingNote] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const openEditModal = (note) => {
        axios.get(route('notes.show', note.note_id)).then(response => {
            setEditingNote(response.data);
            setEditModalOpen(true);
        });
    };
    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditingNote(null);
    };
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


    const user = auth.user;

    return (
        <AuthenticatedLayout>
            <Head title="Administrador de Notas" />

            <div className='d-flex'>

                <DashboardOptions/>
                <div className="container-fluid">
                    <div className="bg-accent2 bg-opacity-50 rounded p-4 mb-4">
                        <h1 className="h2"><b>ADMINISTRAR NOTAS</b></h1>
                        <PrimaryButton onClick={openCreateModal} className='btn btn-success btn-lg text-dark fw-bold mt-3 rounded-pill d-flex align-items-center'>
                            <PlusCircleFill className='fs-3 me-2'/>CREAR NOTA
                        </PrimaryButton>
                    </div>

                    {featuredNote && (
                        <div className="card mb-4 bg-light bg-opacity-50 border-primary shadow">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">⭐ Nota de Portada</h5>
                            </div>
                            <div className="row g-0">
                                <div className="col-md-4">
                                    <img 
                                        src={`/storage/${featuredNote.portrait_url}`} 
                                        className="img-fluid rounded-start" 
                                        alt={`Portada de ${featuredNote.headline}`} 
                                        style={{ objectFit: 'cover', height: '100%' }}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h4 className="card-title">{featuredNote.headline}</h4>
                                        <p className="card-text"><small className="text-muted">Por: {featuredNote.user?.name || 'Desconocido'} - {new Date(featuredNote.publish_date).toLocaleDateString()}</small></p>
                                        <p className="card-text">{featuredNote.lead}</p>
                                        <div className='d-flex'>
                                            <button onClick={() => openViewModal(featuredNote)} className='btn btn-lg btn-outline-info rounded-pill me-2 text-dark'><Newspaper className='fs-3'></Newspaper> Ver Detalles</button>
                                            <button onClick={() => openEditModal(featuredNote)} className='btn btn-lg btn-outline-warning rounded-pill me-2 text-dark'><PencilSquare className='fs-3'></PencilSquare> Editar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} 

                    <div className="table-responsive">
                        <table className="table table-bordered border-dark">
                            <thead className='text-center'>
                                <tr>
                                    <th className='bg-warning py-4 text-dark h4'>Portada</th>
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
                                    // ✅ La lógica de permisos se ha ido.
                                    // Si estás en esta página, eres Admin y puedes hacerlo todo.
                                    <tr key={note.note_id}>
                                        <td className='bg-accent2 bg-opacity-50 align-middle'>
                                            <a href={route('notes.toggleFeatured', note.note_id)} method="patch" as="button" /* ... */ >
                                                <input className='form-check-input fs-3' type="checkbox" checked={note.is_featured} />
                                            </a>
                                        </td> 
                                        <td className='bg-accent2 bg-opacity-50 '><img src={`/storage/${note.portrait_url}`} className='img-thumbnail' style={{width:"20rem",height:"auto"}}/></td>
                                        <td className='bg-accent2 bg-opacity-50 text-dark h5'>{note.headline}</td>
                                        <td className='bg-accent2 bg-opacity-50 align-middle'>
                                            {/* ... (mapeo de secciones) ... */}
                                        </td>
                                        <td className='bg-accent2 bg-opacity-50 text-dark h5'>{new Date(note.publish_date).toLocaleDateString()}</td>
                                        <td className='bg-accent2 bg-opacity-50 text-dark h5'>{note.user? note.user.name : 'Autor no encontrado'}</td>
                                        
                                        {/* ✅ MOSTRAR SIEMPRE LOS BOTONES */}
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

            </div>
            
            

            {/* --- Modales --- */}
            
            {/* ✅ Modal de Creación AHORA RECIBE PROPS */}
            <Modal show={isCreateModalOpen} onClose={closeCreateModal}>
                <CreateNoteForm
                    // Pasamos los datos y funciones al componente hijo
                    data={createFormData}
                    setData={setCreateFormData}
                    errors={createErrors}
                    processing={createProcessing}
                    onSubmit={submitCreateNote} // Pasamos la función de envío
                    onClose={closeCreateModal}  // Pasamos la función de cierre
                    sections={sections} // Sigue recibiendo las secciones
                />
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