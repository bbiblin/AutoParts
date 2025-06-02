// src/pages/CartPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useCart } from '../contexts/cartContext';
import { useAuth } from '../contexts/authContext';

export default function CartPage() {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        isLoading
    } = useCart();

    const { isLoggedIn } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        console.log('token:' + Cookies.get('authToken'));
        console.log('userId: ' + Cookies.get('user_id'));
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(price);
    };

    const subtotal = cartItems.reduce((acc, item) => {
        if (item.product.discount_percentage > 0 ){
            return acc + (item.product?.retail_price_sale || 0) * item.quantity;

        }else{
        return acc + (item.product?.retail_price || 0) * item.quantity;

        }
    }, 0);

    const handleQuantityChange = (itemId, newQuantity) => {
        console.log('Changing quantity for ID:', itemId, 'to:', newQuantity);
        console.log('Current cart items:', cartItems);
        if (newQuantity >= 0) {
            updateQuantity(itemId, newQuantity);
        }
    };

    const handleCheckout = async () => {
        if (!isLoggedIn) {
            // Redirigir al login si no está autenticado
            return;
        }

        setIsProcessing(true);
        try {
            // Aquí implementarías la lógica de checkout
            console.log('Procesando compra...');
            // Simulación de proceso
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('¡Compra realizada con éxito!');
            clearCart();
        } catch (error) {
            console.error('Error en el checkout:', error);
            alert('Error al procesar la compra');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F3A93] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando carrito...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16">
                        <svg
                            className="w-24 h-24 text-gray-300 mx-auto mb-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19M7 13v4a2 2 0 002 2h8a2 2 0 002-2v-4m-8 6h4"
                            />
                        </svg>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Tu carrito está vacío
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Agrega algunos productos para comenzar tu compra
                        </p>
                        <Link
                            to="/productos"
                            className="bg-[#1F3A93] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors duration-300"
                        >
                            Ver productos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {isLoggedIn ? (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Carrito de Compras
                        </h1>


                        <p className="text-gray-600">
                            {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en tu carrito
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Lista de productos */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Productos
                                        </h2>
                                        <button
                                            onClick={clearCart}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-300"
                                        >
                                            Limpiar carrito
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            < div
                                                key={item.producto_id}
                                                className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow duration-300"
                                            >
                                                {/* Imagen del producto */}
                                                < div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden" >
                                                    {
                                                        item.product?.image_url ? (
                                                            <img
                                                                src={item.product.image_url}
                                                                alt={item.product.product_name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )
                                                    }
                                                </div>

                                                {/* Información del producto */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                                        {item.product?.product_name || 'Producto'}
                                                    </h3>
                                                    
                                                  <div className="text-right">
  {item.product.discount_percentage > 0 ? (
    <>
      <p className="text-sm text-red-600 mt-1">
        {formatPrice(item.product?.retail_price_sale || 0)}
      </p>
      <p className="text-sm text-gray-500 mt-1 line-through">
        {formatPrice(item.product?.retail_price || 0)}
      </p>
    </>
  ) : (
    <p className="text-sm text-gray-500 mt-1">
      {formatPrice(item.product?.retail_price || 0)}
    </p>
  )}
</div>

                                                </div>

                                                {/* Controles de cantidad */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                        </svg>
                                                    </button>

                                                    <span className="w-12 text-center font-medium text-gray-900">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
                                                    >
                                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Subtotal */}
                                                <div className="text-right">
                                                    <div className="text-right">
                                                    {item.product.discount_percentage > 0 ? (
                                                        <>
                                                        <p className="text-sm text-red-600 mt-1">
                                                            {formatPrice(item.product?.retail_price_sale || 0)}
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-1 line-through">
                                                            {formatPrice(item.product?.retail_price || 0)}
                                                        </p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                        {formatPrice(item.product?.retail_price || 0)}
                                                        </p>
                                                    )}
                                                    </div>

                                                </div>

                                                {/* Botón eliminar */}
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-300"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resumen del pedido */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                        Resumen del pedido
                                    </h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="text-gray-900">{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Envío</span>
                                            <span className="text-gray-900">Gratis</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex justify-between text-lg font-semibold">
                                                <span className="text-gray-900">Total</span>
                                                <span className="text-gray-900">{formatPrice(subtotal)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {!isLoggedIn ? (
                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-600 text-center">
                                                Inicia sesión para continuar
                                            </p>
                                            <Link
                                                to="/users/login"
                                                className="w-full bg-[#1F3A93] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors duration-300 block text-center"
                                            >
                                                Iniciar sesión
                                            </Link>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleCheckout}
                                            disabled={isProcessing || cartItems.length === 0}
                                            className="w-full bg-[#D72638] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#BB2F3D] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Procesando...
                                                </>
                                            ) : (
                                                'Proceder al pago'
                                            )}
                                        </button>
                                    )}

                                    <div className="mt-6 text-center">
                                        <Link
                                            to="/productos"
                                            className="text-[#1F3A93] hover:text-blue-800 text-sm font-medium transition-colors duration-300"
                                        >
                                            ← Continuar comprando
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            ) : (
                <div className="space-y-3">
                    <p className="text-sm text-gray-600 text-center">
                        Inicia sesión para continuar
                    </p>
                    <Link
                        to="/users/login"
                        className="w-full bg-[#1F3A93] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors duration-300 block text-center"
                    >
                        Iniciar sesión
                    </Link>
                </div>
            )}

        </div >
    );
};
