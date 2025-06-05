import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/authContext';
import AddToCartButton from '../components/addToCartButton';

export default function DetalleProducto() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`https://autoparts-i2gt.onrender.com/productos/${id}`);
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="text-center p-8">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: '#3b82f6', opacity: 0.3 }}></div>
                        <div className="relative w-20 h-20 rounded-full animate-spin border-4 border-gray-200" style={{ borderTopColor: '#3b82f6' }}></div>
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#1e293b' }}>Cargando producto</h3>
                    <p className="text-base" style={{ color: '#64748b' }}>Obteniendo información del producto...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="text-center p-10 rounded-3xl shadow-2xl bg-white border border-gray-100 max-w-md mx-4">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fef2f2' }}>
                        <svg className="w-12 h-12" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: '#1f2937' }}>Producto no encontrado</h3>
                    <p className="mb-8 leading-relaxed" style={{ color: '#6b7280' }}>
                        Lo sentimos, el producto que buscas no existe o ha sido eliminado de nuestro catálogo.
                    </p>
                    <a
                        href="/productos"
                        className="inline-flex items-center px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                        style={{ backgroundColor: '#3b82f6' }}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver al Catálogo
                    </a>
                </div>
            </div>
        );
    }

    const hasDiscount = product.discount_percentage > 0;
    const isLowStock = product.stock <= 10 && product.stock > 0;
    const isOutOfStock = product.stock === 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        <div className="relative p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                <div className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 ${imageLoaded ? 'scale-100' : 'scale-95'}`}>
                                    <img
                                        src={product.image_url}
                                        alt={product.product_name}
                                        className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                                        onLoad={() => setImageLoaded(true)}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    {hasDiscount && (
                                        <div className="flex items-center px-3 py-2 rounded-full text-white text-sm font-bold shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300" style={{ backgroundColor: '#dc2626' }}>
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                            -{product.discount_percentage}%
                                        </div>
                                    )}
                                    {isLowStock && (
                                        <div className="px-3 py-2 rounded-full text-white text-xs font-semibold" style={{ backgroundColor: '#f59e0b' }}>
                                            ¡Últimas unidades!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <div className="mb-8">
                                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    {product.product_name}
                                </h2>
                                <p className="text-lg leading-relaxed" style={{ color: '#4b5563' }}>
                                    {product.description}
                                </p>
                            </div>

                            <div className="space-y-6 mb-10">

                                <div className="p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg" style={{ borderColor: '#e5e7eb', backgroundColor: '#f8fafc' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: '#3b82f6' }}></div>
                                            <span className="text-lg font-bold" style={{ color: '#374151' }}>Precio Mayorista</span>
                                        </div>
                                        <div className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
                                            Compra al por mayor
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {hasDiscount ? (
                                            <div className="space-y-1">
                                                <div className="text-3xl font-bold" style={{ color: '#dc2626' }}>
                                                    ${product.wholesale_price_sale?.toLocaleString('es-CL')}
                                                </div>
                                                <div className="text-sm line-through" style={{ color: '#9ca3af' }}>
                                                    Antes: ${product.wholesale_price?.toLocaleString('es-CL')}
                                                </div>
                                                <div className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                                                    Ahorras ${(product.wholesale_price - product.wholesale_price_sale)?.toLocaleString('es-CL')}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-3xl font-bold" style={{ color: '#1f2937' }}>
                                                ${product.wholesale_price?.toLocaleString('es-CL')}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg" style={{ borderColor: '#e5e7eb', backgroundColor: '#f8fafc' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: '#10b981' }}></div>
                                            <span className="text-lg font-bold" style={{ color: '#374151' }}>Precio Minorista</span>
                                        </div>
                                        <div className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                                            Compra individual
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {hasDiscount ? (
                                            <div className="space-y-1">
                                                <div className="text-3xl font-bold" style={{ color: '#dc2626' }}>
                                                    ${product.retail_price_sale?.toLocaleString('es-CL')}
                                                </div>
                                                <div className="text-sm line-through" style={{ color: '#9ca3af' }}>
                                                    Antes: ${product.retail_price?.toLocaleString('es-CL')}
                                                </div>
                                                <div className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                                                    Ahorras ${(product.retail_price - product.retail_price_sale)?.toLocaleString('es-CL')}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-3xl font-bold" style={{ color: '#1f2937' }}>
                                                ${product.retail_price?.toLocaleString('es-CL')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            
                            <div className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: '#f1f5f9' }}>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold" style={{ color: '#374151' }}>Stock disponible:</span>
                                    <div className="flex items-center">
                                        <div className="flex items-center mr-4">
                                            <div
                                                className="w-4 h-4 rounded-full mr-3 animate-pulse"
                                                style={{
                                                    backgroundColor: isOutOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#10b981'
                                                }}
                                            ></div>
                                            <span
                                                className="font-bold text-xl"
                                                style={{
                                                    color: isOutOfStock ? '#dc2626' : isLowStock ? '#d97706' : '#059669'
                                                }}
                                            >
                                                {product.stock} unidades
                                            </span>
                                        </div>
                                        <div
                                            className="px-3 py-1 rounded-full text-xs font-semibold"
                                            style={{
                                                backgroundColor: isOutOfStock ? '#fef2f2' : isLowStock ? '#fef3c7' : '#f0fdf4',
                                                color: isOutOfStock ? '#991b1b' : isLowStock ? '#92400e' : '#14532d'
                                            }}
                                        >
                                            {isOutOfStock ? 'Agotado' : isLowStock ? 'Stock Bajo' : 'Disponible'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="space-y-4">
                                {isLoggedIn ? (
                                    <div className="space-y-3">
                                        <AddToCartButton
                                            product={product}
                                            className="w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                                        />
                                        {hasDiscount && (
                                            <div className="text-center p-3 rounded-xl" style={{ backgroundColor: '#fef7ff', color: '#7c3aed' }}>
                                                <p className="text-sm font-medium">🎉 ¡Oferta especial por tiempo limitado!</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center p-6 rounded-xl border-2 border-dashed" style={{ borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}>
                                        <svg className="w-12 h-12 mx-auto mb-3" style={{ color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <p className="font-semibold mb-2" style={{ color: '#991b1b' }}>Inicia sesión para comprar</p>
                                        <p className="text-sm" style={{ color: '#7f1d1d' }}>Necesitas una cuenta para agregar productos al carrito</p>
                                    </div>
                                )}

                                <a
                                    href="/productos"
                                    className="flex items-center justify-center w-full py-4 px-6 rounded-xl font-semibold border-2 transition-all duration-300 hover:shadow-lg group"
                                    style={{ borderColor: '#d1d5db', color: '#374151' }}
                                >
                                    <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Volver al Catálogo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
