import React, { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout'; // O tu layout principal
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal'; // Crearemos este componente a continuación
import CreateNoteForm from '@/Components/CreateNoteForm'; // Y este también


export default function NotesManager({auth, notes, success }) { // Recibes las notas y mensajes flash
    
    // Estado para controlar la visibilidad del modal
    

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const openCreateModal = () => setCreateModalOpen(true);
    const closeCreateModal = () => setCreateModalOpen(false);


    return (
        <AuthenticatedLayout>
            <Head title="Administrador de Notas" />
            
            <div className="container p-5 m-auto my-5 bg-accent2 bg-opacity-50 rounded">
                <h1><b>ADMINISTRAR NOTAS</b></h1>

                {/* Este botón ahora abre el modal */}
                <PrimaryButton onClick={openCreateModal} className='btn btn-success btn-lg my-3'>
                    <b>CREAR NOTA</b>
                </PrimaryButton>
            </div>

            
            {/* Aquí renderizas la lista de notas como antes */}
            {/* ... tu <table> ... */}

            <table className="container m-auto table table-bordered border-dark">
            {/* ... thead ... */}

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
                        <tr key={note.id}>
                            {/* Muestra la imagen desde la carpeta storage */}
                            <td className='bg-accent2 bg-opacity-50'><img src={`/storage/${note.portrait_url}`} className='img-thumbnail' style={{width:"15rem",height:"10rem"}}/></td>
                            <td className='bg-accent2 bg-opacity-50 text-dark h5'>{note.headline}</td>
                            <td className='bg-accent2 bg-opacity-50 text-dark h5'>Secciones...</td> {/* Necesitarás cargar las secciones con la nota */}
                            <td className='bg-accent2 bg-opacity-50 text-dark h5'>{new Date(note.publish_date).toLocaleDateString()}</td>
                            <td className='bg-accent2 bg-opacity-50 text-dark h5'>{note.user.name}</td> {/* Accedes al nombre del autor */}
                            <td className='bg-accent2 bg-opacity-50 text-dark h5'>
                                <a href="" className='btn btn-info text-accent2'>Ver</a> 
                                <a href="" className='btn btn-warning text-accent2'>Editar</a> 
                                <a href="" className='btn btn-danger text-accent2'>eliminar</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {/* EL MODAL */}
            <Modal show={isCreateModalOpen} onClose={closeCreateModal}>
                <CreateNoteForm onClose={closeCreateModal} />
            </Modal>

            
        </AuthenticatedLayout>
    );
}