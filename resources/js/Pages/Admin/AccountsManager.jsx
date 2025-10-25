import React, { useState } from 'react';
import { Link, Head, useForm, usePage } from '@inertiajs/react'; // <-- Importa useForm AQUÍ
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DashboardOptions from '@/Components/Dashboard';


export default function CommentsManager() {

    return (
        <AuthenticatedLayout>
            <Head title="Administrador de Notas" />

            <div className='d-flex'>

                <DashboardOptions/>
                <div className="container-fluid">
                    <div className="bg-accent2 bg-opacity-50 rounded p-4 mb-4">
                        <h1 className="h2"><b>ADMINISTRAR USUARIOS</b></h1>
                        
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}