// resources/js/Layouts/GuestLayout.jsx
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function GuestLayout({ children }) {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Barra de Navegación en la parte superior */}
            <header>
                <Navbar />
            </header>

            {/* Contenido principal de la página */}
            <main className="container-fluid flex-grow-1 py-4">
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