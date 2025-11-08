
import { Link } from '@inertiajs/react';
import { ChatLeftDots, ClipboardData, JournalText, PersonCircle } from 'react-bootstrap-icons';


export default function DashboardOptions(){

    

    return(

        <aside className='bg-light bg-opacity-50 rounded p-3 col-3 d-none d-xl-block'>
            <h2 className='mb-4 fw-bold'>Panel de control</h2>
            <Link href={route('admin.panel')} className='btn btn-warning btn-lg text-start text-dark mb-4 d-flex align-items-center fw-bold'><ClipboardData className='fs-2 me-3 text-dark'></ClipboardData>Panel Principal</Link>
            <Link href={route('notes.index')} className='btn btn-warning btn-lg text-start text-dark mb-4 d-flex align-items-center fw-bold'><JournalText className='fs-2 me-3 text-dark'></JournalText> Administrar notas</Link>
            <Link href={route('admin.users')} className='btn btn-warning btn-lg text-start text-dark mb-4 d-flex align-items-center fw-bold'><PersonCircle className='fs-2 me-3 text-dark'></PersonCircle> Administrar usuarios</Link>
            <Link href={route('admin.comments')} className='btn btn-warning btn-lg text-start text-dark mb-4 d-flex align-items-center fw-bold'><ChatLeftDots className='fs-2 me-3 text-dark '></ChatLeftDots> Administrar comentarios</Link>
        </aside>

    );
}




