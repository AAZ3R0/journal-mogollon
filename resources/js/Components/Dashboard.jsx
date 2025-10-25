
import { Link } from '@inertiajs/react';
import { ChatLeftDots, ClipboardData, JournalText, PersonCircle } from 'react-bootstrap-icons';


export default function DashboardOptions(){


    return(

        <aside className='bg-light bg-opacity-50 rounded p-3 me-3 w-25'>
            <h2 className='mb-4 fw-bold'>Panel de control</h2>
            <Link href={route('admin.panel')} className='btn btn-warning btn-lg w-100 text-start mb-4'><ClipboardData className='fs-2 me-2 text-dark'></ClipboardData> Panel Principal</Link>
            <Link href={route('notes.index')} className='btn btn-warning btn-lg w-100 text-start mb-4'><JournalText className='fs-2 me-2 text-dark'></JournalText> Administrar notas</Link>
            <Link href={route('admin.users')} className='btn btn-warning btn-lg w-100 text-start mb-4'><PersonCircle className='fs-2 me-2 text-dark'></PersonCircle> Administrar usuarios</Link>
            <Link href={route('admin.comments')} className='btn btn-warning btn-lg w-100 text-start mb-4'><ChatLeftDots className='fs-2 me-2 text-dark'></ChatLeftDots> Administrar comentarios</Link>
        </aside>

    );
}




