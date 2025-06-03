import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/authContext';
import AddToCartButton from '../components/addToCartButton';


export default function DetalleProducto() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5374/productos/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-gray-600">Cargando producto...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-gray-500">Producto no encontrado.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-10 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Detalle del Producto
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                    {/* Imagen */}
                    <div className="relative overflow-hidden rounded-2xl shadow-md">
                        <img
                            src={product.image_url}
                            alt={product.product_name}
                            className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl"
                        />
                        {product.discount_price && (
                            <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                ¡Oferta!
                            </div>
                        )}
                    </div>

                    {/* Información del producto */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{product.product_name}</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                        <div className="space-y-6 mb-8">
                            <div className="space-y-6 mb-8">
                                {/* Precio Mayorista */}
                                <div className="flex justify-between items-start">
                                    <span className="text-lg font-bold text-gray-700">Precio Mayorista:</span>
                                    <div className="text-right">
                                        {product.discount_percentage > 0 ? (
                                            <>
                                                <div className="text-[#BB2F3D] font-bold text-xl">
                                                    ${product.wholesale_price_sale}
                                                </div>
                                                <div className="text-gray-400 text-sm">
                                                    Precio normal: ${product.wholesale_price}
                                                </div>
                                                <div className="text-[#3f9b28] text-xs font-medium mt-1">
                                                    -{product.discount_percentage}% descuento
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-gray-900 font-bold text-xl">
                                                ${product.wholesale_price}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Precio Minorista */}
                                <div className="flex justify-between items-start">
                                    <span className="text-lg font-bold text-gray-700">Precio Minorista:</span>
                                    <div className="text-right">
                                        {product.discount_percentage > 0 ? (
                                            <>
                                                <div className="text-[#BB2F3D] font-bold text-xl">
                                                    ${product.retail_price_sale}
                                                </div>
                                                <div className="text-gray-400 text-sm">
                                                    Precio normal: ${product.retail_price}
                                                </div>
                                                <div className="text-[#3f9b28] text-xs font-medium mt-1">
                                                    -{product.discount_percentage}% descuento
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-gray-900 font-bold text-xl">
                                                ${product.retail_price}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 font-medium">Stock disponible:</span>
                                <div className="flex items-center">
                                    <span
                                        className={`w-3 h-3 rounded-full mr-2 ${product.stock > 10
                                            ? 'bg-green-500'
                                            : product.stock > 0
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                            }`}
                                    ></span>
                                    <span
                                        className={`font-semibold ${product.stock > 10
                                            ? 'text-green-600'
                                            : product.stock > 0
                                                ? 'text-yellow-600'
                                                : 'text-red-600'
                                            }`}
                                    >
                                        {product.stock} unidades
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="space-y-4">
                            {isLoggedIn ? (
                                <AddToCartButton product={product} className="w-full" />
                            ) : (
                                <p className="text-red-500 font-medium">Debes iniciar sesión para comprar.</p>
                            )}

                            <a
                                href="/productos"
                                className="block text-center bg-white border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
                            >
                                Volver al Catálogo
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
