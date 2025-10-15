import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react'; // Es buena práctica usar Head para el título de la página
import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';


export default function NoteList(){
    
    return (

        <div className="container p-5 m-auto bg-accent2">
                <h1>Lista de notas</h1>

                <div className="p-5 my-5 bg-accent1 rounded">
                    Aquí irán tus notas...
                </div>


                <PrimaryButton className='btn btn-primary'>
                    Prueba botón
                </PrimaryButton>
        </div>
    );
}