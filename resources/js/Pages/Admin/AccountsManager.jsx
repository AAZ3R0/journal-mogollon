import React, { useState, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
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
        case 'Administrador': return 'bg-danger';
        case 'Editor': return 'bg-warning text-dark';
        case 'Reportero': return 'bg-info text-dark';
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
        
        Inertia.get(route('admin.users'), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    // Se dispara al enviar el formulario de búsqueda
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const newFilters = { ...currentFilters, query: searchQuery };
        Inertia.get(route('admin.users'), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Administrar Usuarios" />
            <div className='d-flex'>
                <DashboardOptions/>
                <div className="container-fluid">
                    <div className="bg-accent2 bg-opacity-50 rounded p-4 mb-4">
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

                    <div className="table-responsiv rounded shadow-sm">
                        <table className="table table-hover align-middle mb-0 table-bordered border-dark">
                            <thead className='bg-light'>
                                <tr className='text-center'>
                                    <th className='bg-warning py-4 text-dark h4 '>Nombre</th>
                                    <th className='bg-warning py-4 text-dark h4'>Correo Electrónico</th>
                                    <th className='bg-warning py-4 text-dark h4 '>Rol</th>
                                    <th className='bg-warning py-4 text-dark h4'>Registrado el</th>
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
                                        <td className='p-3 bg-accent2 fs-5 bg-opacity-50'>
                                            {/* ✅ Botones conectados */}
                                            <button 
                                                className='btn btn-sm fs-5 btn-outline-primary me-2' 
                                                title="Ver detalles"
                                                onClick={() => openViewModal(user)}
                                            >
                                                <EyeFill />
                                            </button>
                                            <button 
                                                className='btn btn-sm fs-5 btn-outline-danger' 
                                                title="Eliminar usuario"
                                                onClick={() => openDeleteModal(user)}
                                                // Impide que te borres a ti mismo
                                                disabled={user.user_id === auth.user.user_id} 
                                            >
                                                <TrashFill />
                                            </button>
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
                    <BootstrapPagination links={users.links} />
                </div>
            </div>

            {/* --- Modales --- */}
            <Modal show={isViewModalOpen} onClose={closeViewModal} size="lg">
                {viewingUser && <ViewUserDetailsModal user={viewingUser} onClose={closeViewModal} />}
            </Modal>

            <Modal show={isDeleteModalOpen} onClose={closeDeleteModal} size="lg">
                {deletingUser && <DeleteUserModal user={deletingUser} onClose={closeDeleteModal} />}
            </Modal>
        </AuthenticatedLayout>
    );
}