import { useAuth } from "../contexts/authContext";

export default function Footer() {
    const { user } = useAuth();

    // Determinar si es distribuidor
    const isDistributor = user?.isDistribuitor;

    const footerBg = isDistributor ? 'bg-[#D72638]' : 'bg-[#1F3A93]';
    const hoverColor = isDistributor ? 'hover:text-red-200' : 'hover:text-[#535d73]';
    const borderColor = isDistributor ? 'border-red-700' : 'border-gray-700';

    return (
        <footer className={`${footerBg} text-gray-300 py-10 px-6 mt-10 transition-colors duration-500`}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

                <div>
                    <h2 className="text-xl font-bold text-[#F5F5F5] mb-4">
                        AutoParts
                        {isDistributor && (
                            <span className="ml-2 text-sm bg-white text-red-600 px-2 py-1 rounded-md font-semibold">
                                Mayoristas
                            </span>
                        )}
                    </h2>
                    <p className="text-sm text-[#F5F5F5]">
                        {isDistributor
                            ? "Tu proveedor mayorista de repuestos y accesorios automotrices."
                            : "Tu tienda de repuestos y accesorios automotrices."
                        }
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-[#F5F5F5] mb-3">Enlaces</h3>
                    <ul className="space-y-2 text-sm text-[#F5F5F5]">
                        <li>
                            <a href={isDistributor ? "/catalogo_mayorista" : "/productos"}
                                className={`${hoverColor} transition`}>
                                {isDistributor ? "Catálogo Mayorista" : "Productos"}
                            </a>
                        </li>
                        <li><a href="/productos_destacados" className={`${hoverColor} transition`}>Productos Destacados</a></li>
                        <li><a href="/aboutUs" className={`${hoverColor} transition`}>Nosotros</a></li>
                        <li><a href="/contacto" className={`${hoverColor} transition`}>Contacto</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-[#F5F5F5] mb-3">Contáctanos</h3>
                    <p className="text-sm text-[#F5F5F5]">📞 +56 9 1234 5678</p>
                    <p className="text-sm text-[#F5F5F5]">
                        📧 {isDistributor ? "mayoristas@autoparts.cl" : "contacto@autoparts.cl"}
                    </p>
                    <p className="text-sm text-[#F5F5F5]">📍 Santiago, Chile</p>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-[#F5F5F5] mb-3">Síguenos</h3>
                    <div className="flex space-x-4">
                        <a href="#" className={`${hoverColor} transition`}>
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className={`${hoverColor} transition`}>
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className={`${hoverColor} transition`}>
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className={`${hoverColor} transition`}>
                            <i className="fab fa-linkedin"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div className={`border-t ${borderColor} mt-8 pt-6 text-sm text-center text-[#F5F5F5]`}>
                &copy; {new Date().getFullYear()} AutoParts{isDistributor ? " Mayoristas" : ""}. Todos los derechos reservados.
            </div>
        </footer>
    );
};