import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function Notes(auth) {

    const Layout = auth.user? GuestLayout : AuthenticatedLayout;
    return (
        <Layout>
            <div className="p-3 bg-light bg-opacity-50 rounded">
                <div className="">
                    <div className="">
                        <div className="h1">
                            Lista de noticias
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
