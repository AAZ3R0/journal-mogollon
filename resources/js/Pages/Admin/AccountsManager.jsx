import React, { useState, useMemo } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardOptions from '@/Components/Dashboard';
import Modal from '@/Components/Modal'; // <-- Importa el Modal
import ViewUserDetailsModal from '@/Components/ViewUserDetailsModal'; // <-- Importa el nuevo modal
import DeleteUserModal from '@/Components/DeleteUserModal'; // <-- Importa el nuevo modal
import { EyeFill, TrashFill, Search } from 'react-bootstrap-icons';
import BootstrapPagination from '@/Components/BootstrapPagination';
import axios from 'axios'; // <-- Importa axios

// (Función formatDate)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

// (Función getRoleBadge)
const getRoleBadge = (roleName) => {
    switch (roleName) {
        case 'Administrador': return 'bg-primary';
        case 'Editor': return 'bg-dark';
        case 'Reportero': return 'bg-dark';
        case 'Lector': return 'bg-secondary';
        default: return 'bg-light text-dark';
    }
};

export default function UsersManager({ auth, users = { data: [] }, roles = [], filters = {} }) {

    // --- Estado para el Modal de "Ver Detalles" ---
    const [viewingUser, setViewingUser] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const openViewModal = (user) => {
        // Usamos axios para obtener los datos más frescos (incluyendo los conteos)
        axios.get(route('admin.users.show', user.user_id)).then(response => {
            setViewingUser(response.data);
            setIsViewModalOpen(true);
        });
    };
    const closeViewModal = () => setIsViewModalOpen(false);

    // --- Estado para el Modal de "Eliminar" ---
    const [deletingUser, setDeletingUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openDeleteModal = (user) => {
        setDeletingUser(user);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    // --- Lógica de Filtros ---
    
    // Almacena los filtros actuales
    const currentFilters = useMemo(() => ({
        query: filters.query || '',
        role_id: filters.role_id || '',
    }), [filters]);

    // Estado local para el campo de búsqueda (para no buscar en cada tecla)
    const [searchQuery, setSearchQuery] = useState(currentFilters.query);

    // Se dispara al cambiar el dropdown de Rol
    const handleRoleChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...currentFilters, [name]: value };
        
        router.get(route('admin.users'), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    // Se dispara al enviar el formulario de búsqueda
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const newFilters = { ...currentFilters, query: searchQuery };
        router.get(route('admin.users'), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout containerType="container-fluid">
            <Head title="Administrar Usuarios" />
            <div className='row m-auto g-0'>
                <DashboardOptions/>
                <div className="col-12 col-xl ms-lg-3">
                    <div className="bg-accent2 bg-opacity-50 rounded p-4 mb-4 text-center text-lg-start">
                        <h1 className="h2"><b>ADMINISTRAR USUARIOS</b></h1>
                    </div>

                    {/* --- ✅ Panel de Filtros --- */}
                    <div className="p-4 mx-0 bg-light bg-opacity-50 rounded mb-4 shadow-sm">
                        <div className="row g-3 align-items-end">
                            {/* Columna de Búsqueda */}
                            <div className="col-md-8">
                                <form onSubmit={handleSearchSubmit}>
                                    <label htmlFor="search_query" className="form-label fw-bold">Buscar por nombre, usuario o correo</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            id="search_query"
                                            name="query"
                                            className="form-control"
                                            placeholder="Buscar..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-accent2">
                                            <Search />
                                        </button>
                                    </div>
                                </form>
                            </div>
                            {/* Columna de Rol */}
                            <div className="col-md-4">
                                <label htmlFor="role_filter" className="form-label fw-bold">Filtrar por Rol</label>
                                <select 
                                    id="role_filter"
                                    className='form-select' 
                                    name="role_id" 
                                    value={currentFilters.role_id} 
                                    onChange={handleRoleChange} // <-- Nota: handler diferente
                                >
                                    <option value="">Todos los roles</option>
                                    {roles.map(role => (
                                        <option key={role.rol_id} value={role.rol_id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>


                    

                    {/* --- 1. INICIA VISTA MÓVIL (TARJETAS) --- */}
                    {/* Se muestra solo en pantallas chicas (d-md-none) */}
                    <div className='bg-warning text-center p-3 mb-3 border d-block d-lg-none border-dark'>
                        <h2 className='fw-bold text-dark'>Usuarios </h2>
                    </div>
                    <div className="d-block d-md-none">
                        {users.data.map((user) => (
                            <div key={user.user_id} className="bg-accent2 bg-opacity-50 rounded shadow-sm p-3 mb-3">

                                {/* Fila Nombre */}
                                <div className="row g-2 mb-2 d-flex justify-content-between">
                                    <div className="col-4 fw-bold">Nombre:</div>
                                    <div className="col-8  text-end">
                                        {user.name}
                                        <div className='text-muted small'>@{user.username}</div>
                                    </div>
                                </div>

                                {/* Fila Correo */}
                                <div className="row g-2 mb-2 d-flex justify-content-between">
                                    <div className="col-4 fw-bold">Correo:</div>
                                    <div className="col-8 text-end" style={{ overflowWrap: 'break-word' }}>{user.email}</div>
                                </div>

                                {/* Fila Rol */}
                                <div className="row g-2 mb-2 d-flex justify-content-between">
                                    <div className="col-4 fw-bold">Rol:</div>
                                    <div className="col-8 text-end">
                                        <span className={`badge ${getRoleBadge(user.role?.name)}`}>
                                            {user.role?.name || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* Fila Registro */}
                                <div className="row g-2 mb-2 d-flex justify-content-between">
                                    <div className="col-4 fw-bold">Registro:</div>
                                    <div className="col-8  text-end">{formatDate(user.created_at)}</div>
                                </div>

                                {/* Fila Acciones */}
                                <hr className="my-2" />
                                <div className="d-flex justify-content-end align-items-center">
                                    <button
                                        className='btn p-0 pe-3'
                                        title="Ver detalles"
                                        onClick={() => openViewModal(user)}
                                    >
                                        <EyeFill className='fs-2 text-dark p-0' />
                                    </button>
                                    <button
                                        className='btn p-0'
                                        title="Eliminar usuario"
                                        onClick={() => openDeleteModal(user)}
                                        disabled={user.user_id === auth.user.user_id}
                                    >
                                        <TrashFill className='fs-2 text-dark p-0' />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                    {/* --- FIN VISTA MÓVIL --- */}

                    <div className="table-responsive rounded shadow-sm d-none d-md-block">
                        <table className="table table-hover align-middle mb-0 table-bordered border-dark">
                            <thead className='bg-light'>
                                <tr className='text-center'>
                                    <th className='bg-warning py-4 text-dark h4 '>Nombre</th>
                                    <th className='bg-warning py-4 text-dark h4'>Correo Electrónico</th>
                                    <th className='bg-warning py-4 text-dark h4 '>Rol</th>
                                    <th className='bg-warning py-4 text-dark h4'>Registro</th>
                                    <th className='bg-warning py-4 text-dark h4 '>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user) => (
                                    <tr key={user.user_id} className='text-center '>
                                        <td className='p-3 bg-accent2 fs-5 bg-opacity-50 text-start'>
                                            <strong>{user.name}</strong>
                                            <div className='text-muted small'>@{user.username}</div>
                                        </td>
                                        <td className='p-3 bg-accent2 fs-5 bg-opacity-50 text-start'>{user.email}</td>
                                        <td className='p-3 bg-accent2 fs-5 bg-opacity-50'>
                                            <span className={`badge  ${getRoleBadge(user.role?.name)}`}>
                                                {user.role?.name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className='p-3 bg-accent2 fs-5 bg-opacity-50'>{formatDate(user.created_at)}</td>
                                        <td className='p-3 bg-accent2 fs-5 bg-opacity-50 align-middle'>

                                            <div className='d-flex justify-content-center align-items-center'>
                                                {/* ✅ Botones conectados */}
                                                <button 
                                                    className='btn me-2' 
                                                    title="Ver detalles"
                                                    onClick={() => openViewModal(user)}
                                                >
                                                    <EyeFill className='fs-2 text-dark' />
                                                </button>
                                                <button 
                                                    className='btn' 
                                                    title="Eliminar usuario"
                                                    onClick={() => openDeleteModal(user)}
                                                    // Impide que te borres a ti mismo
                                                    disabled={user.user_id === auth.user.user_id} 
                                                >
                                                    <TrashFill className='fs-2 text-dark' />
                                                </button>
                                            </div>
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.data.length === 0 && (
                            <div className="alert bg-warning bg-opacity-75 text-dark text-center mt-4" role="alert">
                                No se encontró ningún usuario que coincidan con tus filtros.
                            </div>
                        )}
                    </div>
                    <div className='bg-light p-3 bg-opacity-50 mt-3'>
                        <BootstrapPagination links={users.links} />
                    </div>
                    
                </div>
                
            </div>


            {/* --- Modales --- */}
            <Modal show={isViewModalOpen} onClose={closeViewModal} size="md">
                {viewingUser && <ViewUserDetailsModal user={viewingUser} onClose={closeViewModal} />}
            </Modal>

            <Modal show={isDeleteModalOpen} onClose={closeDeleteModal} size="md">
                {deletingUser && <DeleteUserModal user={deletingUser} onClose={closeDeleteModal} />}
            </Modal>
        </AuthenticatedLayout>
    );
}