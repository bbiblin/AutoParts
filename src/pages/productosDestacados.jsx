import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddToCartButton from '../components/addToCartButton';
import { useAuth } from '../contexts/authContext';

export default function ProductosDestacados() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn, user } = useAuth();

    // Determinar si es distribuidor
    const isDistributor = user?.isDistribuitor;

    useEffect(() => {
        const fetchDestacados = async () => {
            try {
                const res = await axios.get('https://autoparts-i2gt.onrender.com/productos/destacados');
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 text-lg font-medium">Cargando productos destacados...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-100">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-red-600 font-semibold text-lg">{error}</p>
                </div>
            </div>
        );
    }

    if (productos.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <p className="text-slate-500 text-lg">No hay productos destacados disponibles.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f1f5f9]">

            <div className="bg-gradient-to-r from-[#697fb3] via-[#1e3a8a] to-[#222952] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/20 to-[#9333ea]/20"></div>
                <div className="max-w-7xl mx-auto px-6 py-16 relative">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white bg-clip-text text-transparent">
                            Productos Destacados
                        </h1>
                        <p className="text-xl text-[#dbeafe] max-w-3xl mx-auto leading-relaxed">
                            Descubre nuestra selección especial de {isDistributor ? 'productos mayoristas' : 'repuestos y accesorios'} más populares y mejor valorados
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold bg-gray-900 bg-clip-text text-transparent flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#ffe843] to-[#ff7a43] rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            Productos Destacados
                        </h2>
                        {productos.length > 0 && (
                            <div className="bg-gradient-to-r from-[#ffe843] to-[#ff7a43] text-[#ffff] px-6 py-3 rounded-3xl font-bold shadow-lg">
                                {productos.length} producto{productos.length !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {productos.map((producto, index) => (
                        <div
                            key={producto.id}
                            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:border-slate-200 transform hover:-translate-y-2"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >

                            <div className="absolute top-4 left-4 z-10">
                                <div className="bg-gradient-to-r from-[#ffe843] to-[#ff7a43] text-[#FFFF] px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                                    ⭐ Destacado
                                </div>
                            </div>


                            {isDistributor && (
                                <div className=" absolute top-16 left-4 z-10">
                                    <div className="bg-gradient-to-r from-[#a1e139] to-[#5ff495] text-[#FFFF] px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                                        Precio Mayorista
                                    </div>
                                </div>
                            )}


                            <Link to={`/detalles_producto/${producto.id}`} className="block relative overflow-hidden">
                                <div className="aspect-w-1 aspect-h-1 w-full">
                                    <img
                                        src={producto.image_url}
                                        alt={producto.product_name}
                                        className="w-full h-56 object-cover transition-all duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>


                            <div className="p-6 flex flex-col h-auto">
                                <Link to={`/detalles_producto/${producto.id}`}>
                                    <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-300 mb-3 line-clamp-2 leading-tight">
                                        {producto.product_name}
                                    </h2>
                                </Link>

                                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                                    {producto.description}
                                </p>


                                <div className="mb-4">
                                    {isDistributor ? (

                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl font-bold text-green-600">
                                                    ${new Intl.NumberFormat('es-CL').format(producto.wholesale_price)}
                                                </span>
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-m font-semibold">
                                                    Mayorista
                                                </span>
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                Precio retail: ${new Intl.NumberFormat('es-CL').format(producto.retail_price)}
                                            </div>
                                        </div>
                                    ) : (

                                        producto.discount_percentage > 0 ? (
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-2xl font-bold text-red-600">
                                                        ${new Intl.NumberFormat('es-CL').format(producto.retail_price_sale)}
                                                    </span>
                                                    <span className="bg-[#e13939] text-[#FFFF] px-2 py-1 rounded-lg text-xs font-bold">
                                                        {Math.round(((producto.retail_price - producto.retail_price_sale) / producto.retail_price) * 100)}% OFF
                                                    </span>
                                                </div>
                                                <span className="line-through text-slate-400 text-lg">
                                                    ${new Intl.NumberFormat('es-CL').format(producto.retail_price)}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-2xl font-bold text-slate-800">
                                                ${new Intl.NumberFormat('es-CL').format(producto.retail_price)}
                                            </span>
                                        )
                                    )}
                                </div>


                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-600">Stock disponible</span>
                                        <span className={`text-sm font-bold ${producto.stock > 10 ? 'text-green-600' :
                                            producto.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {producto.stock} unidades
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-sm transition-all duration-500 ${producto.stock > 10 ? 'bg-green-500' :
                                                producto.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${Math.min((producto.stock / 20) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>


                                <div className="space-y-3">

                                    <Link
                                        to={`/detalles_producto/${producto.id}`}
                                        className="w-full bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg border border-slate-200 hover:border-slate-300 flex items-center justify-center group"
                                    >
                                        <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Ver Detalles
                                    </Link>


                                    {isLoggedIn ? (
                                        producto.stock > 0 ? (
                                            <AddToCartButton
                                                product={producto}
                                                className="w-full bg-brand-darBlue hover:from-[#1d4ed8]  text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                            />
                                        ) : (
                                            <p className="text-[#64748b] text-sm mb-3">
                                                No hay stock del producto.
                                            </p>
                                        )

                                    ) : (
                                        <div className="text-center">
                                            <p className="text-slate-500 text-sm mb-3">
                                                Inicia sesión para comprar
                                            </p>
                                            <Link
                                                to="/users/login"
                                                className="inline-block w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
                                            >
                                                Iniciar Sesión
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                <div className="text-center mt-16">
                    <div className="bg-gradient-to-r from-[#eff6ff] to-[#faf5ff] rounded-3xl p-8 border border-[#b5bec9]">
                        <h3 className="text-2xl font-bold text-[#1e293b] mb-4">
                            ¿Buscas algo específico?
                        </h3>
                        <p className="text-[#475569] mb-6 max-w-md mx-auto">
                            Explora nuestro catálogo completo con miles de {isDistributor ? 'productos mayoristas' : 'repuestos y accesorios'}
                        </p>
                        <Link
                            to={isDistributor ? "/catalogo_mayorista" : "/productos"}
                            className="inline-flex items-center bg-brand-redDark text-[#ffff] font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Ver catálogo completo
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}