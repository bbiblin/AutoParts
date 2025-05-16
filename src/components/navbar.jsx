import React, { useState, useEffect } from 'react';
import { User, ShoppingCart, Search, Menu, X, ChevronDown } from 'lucide-react';

// Componente principal del Navbar
export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState('retail'); // 'retail' (B2C) o 'wholesale' (B2B)
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [cartItems, setCartItems] = useState(0);

    // Simula la verificación de autenticación del usuario
    useEffect(() => {
        // Aquí irá la lógica real para verificar la autenticación
        const checkAuth = () => {
            // Simulación: Comprobar si hay un token en localStorage
            const token = localStorage.getItem('authToken');
            if (token) {
                setIsLoggedIn(true);
                // Determinar el tipo de usuario (B2C o B2B)
                const type = localStorage.getItem('userType');
                if (type === 'wholesale') {
                    setUserType('wholesale');
                } else {
                    setUserType('retail');
                }
            }
        };

        checkAuth();
    }, []);

    // Simula cargar el conteo de items del carrito
    useEffect(() => {
        // Aquí irá la lógica real para cargar el carrito
        const loadCart = () => {
            const cart = localStorage.getItem('cart');
            if (cart) {
                try {
                    const cartData = JSON.parse(cart);
                    setCartItems(cartData.length || 0);
                } catch (e) {
                    console.error('Error loading cart:', e);
                }
            }
        };

        loadCart();
    }, []);

    // Categorías de productos
    const categories = [
        {
            name: 'Motores y Componentes',
            subcategories: ['Filtros de aceite', 'Filtros de aire', 'Bujías', 'Correas de distribución']
        },
        {
            name: 'Frenos y Suspensión',
            subcategories: ['Pastillas de freno', 'Discos de freno', 'Amortiguadores', 'Rótulas']
        },
        {
            name: 'Electricidad y Baterías',
            subcategories: ['Alternadores', 'Baterías', 'Luces y faros', 'Sensores y fusibles']
        },
        {
            name: 'Accesorios y Seguridad',
            subcategories: ['Alarmas', 'Cinturones de seguridad', 'Cubre asientos', 'Kits de emergencia']
        }
    ];

    return (
        <nav className="bg-gray-800 text-white shadow-md">
            {/* Navbar principal - visible en todos los dispositivos */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    {/* Logo y nombre */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl">AutoPartes</span>
                        </div>
                    </div>

                    {/* Enlaces de navegación - visible solo en desktop */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <a href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Inicio</a>

                        {/* Dropdown para categorías */}
                        <div className="relative">
                            <button
                                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 flex items-center"
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            >
                                Categorías <ChevronDown className="ml-1 h-4 w-4" />
                            </button>

                            {showCategoryDropdown && (
                                <div className="absolute z-10 mt-2 w-64 bg-white rounded-md shadow-lg text-gray-800">
                                    <div className="py-1">
                                        {categories.map((category) => (
                                            <div key={category.name} className="group relative">
                                                <a
                                                    href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                >
                                                    {category.name}
                                                </a>
                                                <div className="hidden group-hover:block absolute left-full top-0 w-48 bg-white rounded-md shadow-lg z-10">
                                                    {category.subcategories.map((subcategory) => (
                                                        <a
                                                            key={subcategory}
                                                            href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                                                            className="block px-4 py-2 text-sm hover:bg-gray-100"
                                                        >
                                                            {subcategory}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Enlaces adicionales según tipo de usuario */}
                        {userType === 'wholesale' && (
                            <a href="/wholesale-catalog" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 bg-blue-700">
                                Catálogo Mayorista
                            </a>
                        )}

                        <a href="/ofertas" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Ofertas</a>
                        <a href="/contacto" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Contacto</a>
                    </div>

                    {/* Búsqueda, carrito y perfil - visible en todos los dispositivos */}
                    <div className="flex items-center">
                        {/* Búsqueda */}
                        <div className="hidden md:flex md:items-center border-2 border-gray-600 rounded-lg overflow-hidden">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                className="px-4 py-1 text-gray-900 bg-gray-100 focus:outline-none w-48"
                            />
                            <button className="px-2 bg-gray-100 text-gray-700">
                                <Search className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Carrito de compras */}
                        <a href="/cart" className="ml-4 p-2 relative">
                            <ShoppingCart className="h-6 w-6" />
                            {cartItems > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItems}
                                </span>
                            )}
                        </a>

                        {/* Perfil / Login */}
                        {isLoggedIn ? (
                            <a href="/profile" className="ml-3 p-2">
                                <User className="h-6 w-6" />
                            </a>
                        ) : (
                            <a href="/login" className="ml-3 px-4 py-2 rounded-md text-sm font-medium border border-white hover:bg-gray-700">
                                Iniciar Sesión
                            </a>
                        )}

                        {/* Botón de menú móvil */}
                        <div className="md:hidden flex ml-3">
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="p-2 rounded-md hover:bg-gray-700 focus:outline-none"
                            >
                                {showMobileMenu ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menú móvil */}
            {showMobileMenu && (
                <div className="md:hidden bg-gray-700 pb-3 px-4">
                    <div className="pt-2 pb-3 space-y-1">
                        <a href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-600">Inicio</a>

                        {/* Categorías en móvil */}
                        <div>
                            <button
                                className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-600"
                                onClick={() => {/* Lógica para expandir categorías en móvil */ }}
                            >
                                Categorías
                            </button>

                            {/* Lista de categorías para móvil - se podría expandir con un onClick */}
                            <div className="pl-6 space-y-1">
                                {categories.map((category) => (
                                    <a
                                        key={category.name}
                                        href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                                    >
                                        {category.name}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {userType === 'wholesale' && (
                            <a href="/wholesale-catalog" className="block px-3 py-2 rounded-md text-base font-medium bg-blue-700 hover:bg-blue-600">
                                Catálogo Mayorista
                            </a>
                        )}

                        <a href="/ofertas" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-600">Ofertas</a>
                        <a href="/contacto" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-600">Contacto</a>

                        {/* Búsqueda en móvil */}
                        <div className="flex items-center border-2 border-gray-600 rounded-lg overflow-hidden mt-3">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                className="px-4 py-1 text-gray-900 bg-gray-100 focus:outline-none flex-grow"
                            />
                            <button className="px-2 bg-gray-100 text-gray-700">
                                <Search className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}