import React, { useState, useMemo } from 'react';
import { Link, Head, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import CreateNoteForm from '@/Components/CreateNoteForm';
import ViewNoteDetails from '@/Components/ViewNoteDetails';
import EditNoteForm from '@/Components/EditNoteForm';
import DeleteNoteConfirmation from '@/Components/DeleteNoteConfirmation';
import axios from 'axios';
import BootstrapPagination from '@/Components/BootstrapPagination';
import { CircleFill, Newspaper, Paperclip, PencilFill, PencilSquare, PlusCircleFill, Trash2Fill, TrashFill } from 'react-bootstrap-icons';
import DashboardOptions from '@/Components/Dashboard';


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


export default function NotesManager({ auth, notes, sections, featuredNote, success, filters = {} }) {

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

    // --- LÓGICA DE FILTROS DE BÚSQUEDA
    const currentFilters = useMemo(() => ({
        section_id: filters.section_id || '',
        day: filters.day || '',
        month: filters.month || '',
        year: filters.year || '',
    }), [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...currentFilters, [name]: value };

        router.get(route('notes.index'), newFilters, { // Usa la ruta del admin
            preserveState: true,
            replace: true,
        });
    };


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

            <div className='row'>

                <DashboardOptions />
                <div className="col">
                    <div className="bg-accent2 bg-opacity-50 rounded p-4 mb-4">
                        <h1 className="h2"><b>ADMINISTRAR NOTAS</b></h1>
                        <PrimaryButton onClick={openCreateModal} className='btn btn-primary btn-lg fw-bold mt-3 rounded-pill d-flex align-items-center'>
                            <PlusCircleFill className='fs-3 me-2' />CREAR NOTA
                        </PrimaryButton>
                    </div>

                    {/* --- ✅ Panel de Filtros --- */}
                    <div className='p-4 mx-0 bg-light bg-opacity-50 rounded mb-4 shadow-sm'>
                        <h3 className='fw-bold mb-3'>Filtrar Notas</h3>
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
                                            <button onClick={() => openViewModal(featuredNote)} className='btn btn-trasnparent btn-lg rounded-pill me-2 text-dark'><Newspaper className='fs-2'></Newspaper> Ver Detalles</button>
                                            <button onClick={() => openEditModal(featuredNote)} className='btn btn-trasnparent btn-lg rounded-pill me-2 text-dark'><PencilSquare className='fs-2'></PencilSquare> Editar</button>
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
                                {notes.data.map((note) => (
                                    // ✅ La lógica de permisos se ha ido.
                                    // Si estás en esta página, eres Admin y puedes hacerlo todo.
                                    <tr key={note.note_id}>
                                        <td className='bg-accent2 bg-opacity-50 align-middle'>
                                            <input
                                                className='form-check-input fs-3'
                                                type="checkbox"
                                                checked={note.is_featured}
                                                onChange={() => {
                                                    router.patch(
                                                        route('notes.toggleFeatured', note.note_id),
                                                        {}, // Puedes enviar datos aquí si es necesario
                                                        {
                                                            preserveState: true, // No resetea el estado local de React
                                                            preserveScroll: true, // No mueve el scroll de la página
                                                        }
                                                    );
                                                }}
                                            />
                                        </td>
                                        <td className='bg-accent2 bg-opacity-50 '><img src={`/storage/${note.portrait_url}`} className='img-thumbnail' style={{ width: "20rem", height: "auto" }} /></td>
                                        <td className='bg-accent2 bg-opacity-50 text-dark h5 align-middle'>{note.headline}</td>
                                        <td className='bg-accent2 bg-opacity-50 align-middle'>
                                            {Array.isArray(note.sections) && note.sections.map((section) => (
                                                <span key={section.section_id} className="badge bg-primary me-1 mb-1">
                                                    {section.name}
                                                </span>
                                            ))}
                                        </td>
                                        <td className='bg-accent2 bg-opacity-50 text-dark h5 align-middle'>{new Date(note.publish_date).toLocaleDateString()}</td>
                                        <td className='bg-accent2 bg-opacity-50 text-dark h5 align-middle'>{note.user ? note.user.name : 'Autor no encontrado'}</td>

                                        {/* ✅ MOSTRAR SIEMPRE LOS BOTONES */}
                                        <td className='bg-accent2 bg-opacity-50 text-dark h5 align-middle'>
                                            <div className='d-flex justify-content-center align-items-center'>
                                                <button onClick={() => openViewModal(note)} className='text-dark btn btn-transparent'><Newspaper className='fs-1' /></button>
                                                <button onClick={() => openEditModal(note)} className=' text-dark btn btn-transparent'><PencilSquare className='fs-1' /></button>
                                                <button onClick={() => openDeleteModal(note)} className=' text-dark btn btn-transparent'><TrashFill className='fs-1' /></button>
                                            </div>

                                        </td>
                                    </tr>
                                ))}


                            </tbody>
                            {/* Si no hay resultados */}

                        </table>
                        {notes.data.length === 0 && (
                            <div className="alert bg-warning bg-opacity-75 text-dark text-center mt-4" role="alert">
                                No se encontraron notas que coincidan con tus filtros.
                            </div>
                        )}
                    </div>

                    <div className='bg-light p-3 bg-opacity-50'>
                        {/* ✅ Añadimos la paginación */}
                        <BootstrapPagination links={notes.links} />
                    </div>

                    
                </div>

            </div>



            {/* --- Modales --- */}

            {/* ✅ Modal de Creación AHORA RECIBE PROPS */}
            <Modal show={isCreateModalOpen} onClose={closeCreateModal} size="lg">
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

            <Modal show={isViewModalOpen} onClose={closeViewModal} size="lg">
                {viewingNote && <ViewNoteDetails note={viewingNote} onClose={closeViewModal} />}
            </Modal>
            <Modal show={isEditModalOpen} onClose={closeEditModal} size="lg">
                {editingNote && <EditNoteForm note={editingNote} sections={sections} onClose={closeEditModal} />}
            </Modal>
            <Modal show={isDeleteModalOpen} onClose={closeDeleteModal} size="lg">
                {deletingNote && <DeleteNoteConfirmation note={deletingNote} onClose={closeDeleteModal} />}
            </Modal>
        </AuthenticatedLayout>
    );
}