// resources/js/Layouts/GuestLayout.jsx
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function GuestLayout({ children }) {
    return (
        <div className="flex flex-col bg-gray">
            {/* Barra de Navegación en la parte superior */}
            <header>
                <Navbar />
            </header>

            {/* Contenido principal de la página */}
            <main className="flex-grow container mx-auto flex flex-col items-center">
                {/* Aquí es donde se renderizará el contenido de cada vista */}
                <div className="w-full sm:max-w-md  shadow-md overflow-hidden sm:rounded-lg">
                    {children}
                </div>
            </main>

            {/* Pie de página en la parte inferior */}
            <Footer />
        </div>
    );
}