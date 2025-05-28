// src/contexts/cartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './authContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cartId, setCartId] = useState(null);
    const { user, isLoggedIn } = useAuth();

    // Cargar carrito cuando el usuario se loguea
    useEffect(() => {
        if (isLoggedIn && user) {
            loadCart();
        } else {
            // Si no está logueado, usar localStorage
            loadCartFromStorage();
        }
    }, [isLoggedIn, user]);

    // Cargar carrito desde el servidor
    const loadCart = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCartId(data.cart.id);
                setCartItems(data.cart.cart_items || []);
            }
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar carrito desde localStorage (usuarios no logueados)
    const loadCartFromStorage = () => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error('Error al cargar carrito desde localStorage:', error);
        }
    };

    // Guardar carrito en localStorage
    const saveCartToStorage = (items) => {
        localStorage.setItem('cart', JSON.stringify(items));
    };

    // Agregar producto al carrito
    const addToCart = async (product, quantity = 1) => {
        try {
            if (isLoggedIn) {
                // Usuario logueado - guardar en servidor
                const response = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        product_id: product.id,
                        quantity: quantity
                    })
                });

                if (response.ok) {
                    await loadCart(); // Recargar carrito
                } else {
                    throw new Error('Error al agregar producto al carrito');
                }
            } else {
                // Usuario no logueado - usar localStorage
                const existingItem = cartItems.find(item => item.product_id === product.id);
                let updatedItems;

                if (existingItem) {
                    updatedItems = cartItems.map(item =>
                        item.product_id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    updatedItems = [...cartItems, {
                        id: Date.now(), // ID temporal
                        product_id: product.id,
                        quantity: quantity,
                        product: product
                    }];
                }

                setCartItems(updatedItems);
                saveCartToStorage(updatedItems);
            }
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    };

    // Actualizar cantidad de producto
    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            return removeFromCart(itemId);
        }

        try {
            if (isLoggedIn) {
                const response = await fetch(`/api/cart/update/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ quantity: newQuantity })
                });

                if (response.ok) {
                    await loadCart();
                }
            } else {
                const updatedItems = cartItems.map(item =>
                    item.id === itemId
                        ? { ...item, quantity: newQuantity }
                        : item
                );
                setCartItems(updatedItems);
                saveCartToStorage(updatedItems);
            }
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
        }
    };

    // Remover producto del carrito
    const removeFromCart = async (itemId) => {
        try {
            if (isLoggedIn) {
                const response = await fetch(`/api/cart/remove/${itemId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    await loadCart();
                }
            } else {
                const updatedItems = cartItems.filter(item => item.id !== itemId);
                setCartItems(updatedItems);
                saveCartToStorage(updatedItems);
            }
        } catch (error) {
            console.error('Error al remover producto:', error);
        }
    };

    // Limpiar carrito
    const clearCart = async () => {
        try {
            if (isLoggedIn) {
                const response = await fetch('/api/cart/clear', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    setCartItems([]);
                }
            } else {
                setCartItems([]);
                localStorage.removeItem('cart');
            }
        } catch (error) {
            console.error('Error al limpiar carrito:', error);
        }
    };

    // Calcular total del carrito
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.product?.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    // Obtener cantidad total de items
    const getCartItemsCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const value = {
        cartItems,
        cartId,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        loadCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};