import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="p-2">
                <div className="">
                    <div className="">
                        <div className="">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
