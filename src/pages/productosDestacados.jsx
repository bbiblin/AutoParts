import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddToCartButton from '../components/addToCartButton';
import { useAuth } from '../contexts/authContext';

export default function ProductosDestacados() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const fetchDestacados = async () => {
            try {
                const res = await axios.get('http://localhost:5374/productos/destacados');
                setProductos(res.data);
            } catch (err) {
                console.error('Error al obtener productos destacados:', err);
                setError('No se pudieron cargar los productos destacados.');
            } finally {
                setLoading(false);
            }
        };

        fetchDestacados();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-gray-600">Cargando productos destacados...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-red-500 font-semibold">{error}</p>
            </div>
        );
    }

    if (productos.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-gray-500">No hay productos destacados disponibles.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-gray-800">
                    Productos Destacados
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {productos.map(producto => (
                        <div
                            key={producto.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
                        >
                            <Link to={`/detalles_producto/${producto.id}`} className="block overflow-hidden">
                                <img
                                    src={producto.image_url}
                                    alt={producto.product_name}
                                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </Link>

                            <div className="p-4 flex flex-col flex-grow">
                                <Link to={`/detalles_producto/${producto.id}`}>
                                    <h2 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition mb-2 truncate">
                                        {producto.product_name}
                                    </h2>
                                </Link>

                                <p className="text-gray-600 text-sm flex-grow line-clamp-3 mb-4">{producto.description}</p>

                                <div className="mb-4">
                                    {producto.discount_price ? (
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-red-600 font-bold text-xl">${producto.discount_price}</span>
                                            <span className="line-through text-gray-400">${producto.retail_price}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-900 font-bold text-xl">${producto.retail_price}</span>
                                    )}
                                </div>

                                <div className="mb-4 flex items-center space-x-2">
                                    <span
                                        className={`w-3 h-3 rounded-full ${producto.stock > 10
                                            ? 'bg-green-500'
                                            : producto.stock > 0
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                            }`}
                                    ></span>
                                    <span
                                        className={`text-sm font-semibold ${producto.stock > 10
                                            ? 'text-green-600'
                                            : producto.stock > 0
                                                ? 'text-yellow-600'
                                                : 'text-red-600'
                                            }`}
                                    >
                                        {producto.stock} unidades
                                    </span>
                                </div>

                                {isLoggedIn ? (
                                    <AddToCartButton product={producto} className="w-full mt-auto" />
                                ) : (
                                    <p className="text-sm text-red-500 font-medium text-center">
                                        Debes iniciar sesión para comprar.
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
