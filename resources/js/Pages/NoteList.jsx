import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Notes({auth, notes = [], section}) {

    const Layout = auth.user? AuthenticatedLayout : GuestLayout;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <Layout>
            <div className="p-5 bg-light bg-opacity-50 rounded">   
                <div className="h1 mb-4">
                    Lista de noticias
                </div>
                <div className='d-flex flex-row flex-wrap justify-content-start gap-3'>
                        {notes.map((note)=>
                            <Link href={route('notes.public.show', note.note_id)} className="text-decoration-none text-reset">
                                <div className="card bg-light bg-opacity-50" style={{width:'18rem'}}>
                                    <img src={`/storage/${note.portrait_url}`} className='card-img-top'/>
                                    <div class="card-body">

                                        <h6>{Array.isArray(note.sections) && note.sections.map((section) => (
                                                    <span key={section.section_id} className="badge bg-primary me-1 mb-1">
                                                        {section.name}
                                                    </span>
                                                ))} - {formatDate(note.publish_date)}</h6>

                                        <h5 class="card-title">{note.headline}</h5>

                                        <h6><b>Autor:</b> {note.user?.name}</h6>
                                    </div>
                                </div>
                            </Link>
                        )}
                         
                    
                                                                                                                         
                </div> 
            </div>
        </Layout>
    );
}
