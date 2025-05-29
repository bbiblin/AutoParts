export default function Footer() {
    return (
        <footer className="bg-[#1F3A93] text-gray-300 py-10 px-6 mt-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Marca */}
                <div>
                    <h2 className="text-xl font-bold text-[#F5F5F5] mb-4">AutoParts</h2>
                    <p className="text-sm text-[#F5F5F5]">
                        Tu tienda de repuestos y accesorios automotrices.
                    </p>
                </div>

                {/* Enlaces rápidos */}
                <div>
                    <h3 className="text-lg font-bold text-[#F5F5F5] mb-3">Enlaces</h3>
                    <ul className="space-y-2 text-sm text-[#F5F5F5]">
                        <li><a href="/productos" className="hover:text-[#535d73] transition">Productos</a></li>
                        <li><a href="/nosotros" className="hover:text-[#535d73] transition">Nosotros</a></li>
                        <li><a href="/contacto" className="hover:text-[#535d73] transition">Contacto</a></li>
                        <li><a href="/faq" className="hover:text-[#535d73] transition">Preguntas frecuentes</a></li>
                    </ul>
                </div>

                {/* Contacto */}
                <div>
                    <h3 className="text-lg font-bold text-[#F5F5F5] mb-3">Contáctanos</h3>
                    <p className="text-sm text-[#F5F5F5]">📞 +56 9 1234 5678</p>
                    <p className="text-sm text-[#F5F5F5]">📧 contacto@autoparts.cl</p>
                    <p className="text-sm text-[#F5F5F5]">📍 Santiago, Chile</p>
                </div>

                {/* Redes sociales */}
                <div>
                    <h3 className="text-lg font-bold text-[#F5F5F5] mb-3">Síguenos</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-[#F5F5F5] transition"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="hover:text-[#F5F5F5] transition"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="hover:text-[#F5F5F5] transition"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="hover:text-[#F5F5F5] transition"><i className="fab fa-linkedin"></i></a>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center text-[#F5F5F5]">
                &copy; {new Date().getFullYear()} AutoParts. Todos los derechos reservados.
            </div>
        </footer>
    );
};
