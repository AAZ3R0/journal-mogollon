import React, { useState, useMemo } from 'react';
import { Link, Head, useForm, router } from '@inertiajs/react'; // <-- Importa useForm AQUÍ
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import CreateNoteForm from '@/Components/CreateNoteForm';
import ViewNoteDetails from '@/Components/ViewNoteDetails';
import EditNoteForm from '@/Components/EditNoteForm';
import DeleteNoteConfirmation from '@/Components/DeleteNoteConfirmation';
import BootstrapPagination from '@/Components/BootstrapPagination';
import axios from 'axios';
import { CircleFill, Newspaper, Paperclip, PencilFill, PencilSquare, PlusCircleFill, Trash2Fill, TrashFill } from 'react-bootstrap-icons';


// --- Listas para los dropdowns de fecha ---
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
    { value: 1, name: 'Enero' }, { value: 2, name: 'Febrero' }, { value: 3, name: 'Marzo' },
    { value: 4, name: 'Abril' }, { value: 5, name: 'Mayo' }, { value: 6, name: 'Junio' },
    { value: 7, name: 'Julio' }, { value: 8, name: 'Agosto' }, { value: 9, name: 'Septiembre' },
    { value: 10, name: 'Octubre' }, { value: 11, name: 'Noviembre' }, { value: 12, name: 'Diciembre' }
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function Workspace({ auth, notes, sections, success, filters = {} }) {

    // --- LÓGICA DEL FORMULARIO DE CREACIÓN (MOVIDA AQUÍ) ---
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
    const closeCreateModal = () => setCreateModalOpen(false); // No resetea

    const submitCreateNote = (e) => {
        e.preventDefault();
        postCreateForm(route('notes.store'), {
            preserveScroll: true,
            onSuccess: () => {
                resetCreateForm(); // Resetea solo al guardar
                closeCreateModal();
            },
        });
    };
    // --- FIN DE LA LÓGICA DE CREACIÓN ---

    // --- Lógica de otros modales (sin cambios) ---
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

    // --- Lógica de Filtros ---
    const currentFilters = useMemo(() => ({
        section_id: filters.section_id || '',
        day: filters.day || '',
        month: filters.month || '',
        year: filters.year || '',
    }), [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...currentFilters, [name]: value };
        
        router.get(route('workspace.index'), newFilters, { // Usa la ruta del workspace
            preserveState: true,
            replace: true,
        });
    };

    const user = auth.user;

    return (
        <AuthenticatedLayout>
            <Head title="Mi Espacio de Trabajo" />
            
            <div className="container py-5">
                <div className="bg-accent2 bg-opacity-50 rounded p-4 mb-4">
                    <h1 className="h2"><b>MI ESPACIO DE TRABAJO</b></h1>
                    <PrimaryButton onClick={openCreateModal} className='btn btn-primary btn-lg col-lg-2 col-12 fw-bold mt-3 rounded-pill d-flex justify-content-center align-items-center'>
                        <PlusCircleFill className='fs-3 me-2'/>CREAR NOTA
                    </PrimaryButton>
                </div>

                {/* --- Panel de Filtros --- */}
                <div className='p-4 mx-0 bg-light bg-opacity-50 rounded mb-4 shadow-sm'>
                    <h5 className='fw-bold mb-3'>Filtrar Notas</h5>
                    <div className='row g-3'>
                        <div className='col-md-4'>
                            <label htmlFor="filter_section" className="form-label small fw-bold">Sección</label>
                            <select id="filter_section" className='form-select' name="section_id" value={currentFilters.section_id} onChange={handleFilterChange}>
                                <option value="">Todas las secciones</option>
                                {sections.map(section => (
                                    <option key={section.section_id} value={section.section_id}>{section.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='col-md-2'>
                            <label htmlFor="filter_day" className="form-label small fw-bold">Día</label>
                            <select id="filter_day" className='form-select' name="day" value={currentFilters.day} onChange={handleFilterChange}>
                                <option value="">Cualquier día</option>
                                {days.map(day => <option key={day} value={day}>{day}</option>)}
                            </select>
                        </div>
                        <div className='col-md-3'>
                            <label htmlFor="filter_month" className="form-label small fw-bold">Mes</label>
                            <select id="filter_month" className='form-select' name="month" value={currentFilters.month} onChange={handleFilterChange}>
                                <option value="">Cualquier mes</option>
                                {months.map(month => <option key={month.value} value={month.value}>{month.name}</option>)}
                            </select>
                        </div>
                        <div className='col-md-3'>
                            <label htmlFor="filter_year" className="form-label small fw-bold">Año</label>
                            <select id="filter_year" className='form-select' name="year" value={currentFilters.year} onChange={handleFilterChange}>
                                <option value="">Cualquier año</option>
                                {years.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered border-dark">
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
                            {notes.data.map((note) => {
                                let canUpdateOrDelete = false;
                                if (user.role.name === 'Editor') {
                                    if (note.user.rol_id === user.rol_id || note.user.role.name === 'Reportero') {
                                        canUpdateOrDelete = true;
                                    }
                                } else if (user.role.name === 'Reportero') {
                                    canUpdateOrDelete = (user.user_id === note.user_id);
                                }

                                return (
                                    <tr key={note.note_id}>
                                        <td className='bg-accent2 bg-opacity-50 '><img src={`/storage/${note.portrait_url}`} className='img-thumbnail' style={{width:"20rem",height:"auto"}}/></td>
                                        <td className='bg-accent2 bg-opacity-50 text-dark h5 align-middle'>{note.headline}</td>
                                        <td className='bg-accent2 bg-opacity-50 align-middle'>
                                            <div className="d-flex flex-wrap justify-content-center align-middle">
                                                {Array.isArray(note.sections) && note.sections.map((section) => (
                                                    <span key={section.section_id} className="badge bg-primary me-1 mb-1">
                                                        {section.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className='bg-accent2 bg-opacity-50 text-dark h5 align-middle'>{new Date(note.publish_date).toLocaleDateString()}</td>
                                        <td className='bg-accent2 bg-opacity-50 text-dark h5 align-middle'>{note.user? note.user.name : 'Autor no encontrado'}</td>
                                        <td className='bg-accent2 bg-opacity-50 text-dark h5 align-middle'>

                                            <div className='d-flex justify-content-center align-items-center'>
                                                <button onClick={() => openViewModal(note)} className='text-dark btn btn-transparent'><Newspaper className='fs-1'/></button> 
                                                {canUpdateOrDelete && (
                                                <button onClick={() => openEditModal(note)} className=' text-dark btn btn-transparent'><PencilSquare className='fs-1'/></button> 
                                                )}
                                                {canUpdateOrDelete && (
                                                <button onClick={() => openDeleteModal(note)} className=' text-dark btn btn-transparent'><TrashFill className='fs-1'/></button>
                                                )}
                                            </div>
                                            
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {/* Mensaje si no hay resultados */}
                    {notes.data.length === 0 && (
                        <div className="alert bg-warning bg-opacity-50 text-center mt-3" role="alert">
                            No se encontraron notas que coincidan con tus filtros.
                        </div>
                    )}
                </div>

                <BootstrapPagination links={notes.links} />
            </div>

            {/* --- Modales --- */}
            
            {/* ✅ Modal de Creación AHORA RECIBE PROPS */}
            <Modal show={isCreateModalOpen} onClose={closeCreateModal} unmountOnClose={false} size={"lg"}>
                <CreateNoteForm
                    // Pasamos los datos y funciones al componente hijo
                    data={createFormData}
                    setData={setCreateFormData}
                    errors={createErrors}
                    processing={createProcessing}
                    onSubmit={submitCreateNote} 
                    onClose={closeCreateModal}
                    sections={sections}
                />
            </Modal>

            <Modal show={isViewModalOpen} onClose={closeViewModal} size={"lg"}>
                {viewingNote && <ViewNoteDetails note={viewingNote} onClose={closeViewModal} />}
            </Modal>
            <Modal show={isEditModalOpen} onClose={closeEditModal} size={"lg"}>
                {editingNote && <EditNoteForm note={editingNote} sections={sections} onClose={closeEditModal} />}
            </Modal>
            <Modal show={isDeleteModalOpen} onClose={closeDeleteModal} size={"lg"}>
                {deletingNote && <DeleteNoteConfirmation note={deletingNote} onClose={closeDeleteModal} />}
            </Modal>
        </AuthenticatedLayout>
    );
}