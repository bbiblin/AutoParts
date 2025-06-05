import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

//Mostrar confirmación de orden, exclusiva clientes mayoristas
export default function ConfirmarOrden() {

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
                <CheckCircle className="text-[#56ed3e] w-16 h-16 mx-auto mb-4" />
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">¡Tu cotización ha sido enviada!</h1>
                <p className="text-gray-600 mb-6">
                    Te hemos enviado un correo con los detalles de tu pedido. Nos pondremos en contacto contigo pronto.
                </p>
                <Link
                    to="/"
                    className="text-sm text-[#555555] hover:text-[#1E1E1E] transition-colors bg-transparent border-none cursor-pointer"
                >
                    ← Volver al inicio
                </Link>
            </div>
        </div>
    );
}
