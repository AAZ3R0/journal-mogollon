// resources/js/Layouts/GuestLayout.jsx
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function GuestLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray">
            {/* Barra de Navegación en la parte superior */}
            <header>
                <Navbar />
            </header>

            {/* Contenido principal de la página */}
            <main className="flex-grow container mx-auto p-6 flex flex-col items-center mt-5">
                {/* Aquí es donde se renderizará el contenido de cada vista */}
                <div className="w-full sm:max-w-md mt-6 px-6 py-4 shadow-md overflow-hidden sm:rounded-lg">
                    {children}
                </div>
            </main>

            {/* Pie de página en la parte inferior */}
            <Footer />
        </div>
    );
}