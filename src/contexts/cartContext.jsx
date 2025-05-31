import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './authContext';
import Cookies from 'js-cookie';
import axios from 'axios';

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

    useEffect(() => {
        if (isLoggedIn && user) {
            loadCart();
        } else {
            loadCartFromCookies();
        }
    }, [isLoggedIn, user]);

    const loadCart = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:5374/cart', {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('authToken')}`
                }
            });

            const data = response.data;
            setCartId(data.cart.id);
            setCartItems(data.cart.cart_items || []);
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCartFromCookies = () => {
        try {
            const savedCart = Cookies.get('cart');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error('Error al cargar carrito desde cookies:', error);
        }
    };

    const saveCartToCookies = (items) => {
        Cookies.set('cart', JSON.stringify(items));
    };

    const addToCart = async (product, quantity = 1) => {
        try {
            if (isLoggedIn) {
                await axios.post('http://localhost:5374/cart/add', {
                    product_id: product.id,
                    quantity: quantity
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('authToken')}`
                    }
                });

                await loadCart();
            } else {
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
                        product_id: product.id,
                        quantity: quantity,
                        product: product
                    }];
                }

                setCartItems(updatedItems);
                saveCartToCookies(updatedItems);
            }
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            return removeFromCart(itemId);
        }

        try {
            if (isLoggedIn) {
                await axios.put(`http://localhost:5374/cart/update/${itemId}`, {
                    quantity: newQuantity
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('authToken')}`
                    }
                });

                await loadCart();
            } else {
                const updatedItems = cartItems.map(item =>
                    item.id === itemId
                        ? { ...item, quantity: newQuantity }
                        : item
                );
                setCartItems(updatedItems);
                saveCartToCookies(updatedItems);
            }
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            if (isLoggedIn) {
                await axios.delete(`http://localhost:5374/cart/remove/${itemId}`, {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('authToken')}`
                    }
                });

                await loadCart();
            } else {
                const updatedItems = cartItems.filter(item => item.id !== itemId);
                setCartItems(updatedItems);
                saveCartToCookies(updatedItems);
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    const clearCart = async () => {
        try {
            if (isLoggedIn) {
                await axios.delete('http://localhost:5374/cart/clear', {
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('authToken')}`
                    }
                });

                setCartItems([]);
            } else {
                Cookies.remove('cart');
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error al limpiar el carrito:', error);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.product?.price || 0;
            return total + price * item.quantity;
        }, 0);
    };

    // Obtener cantidad total de items
    const getCartItemsCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            getCartItemsCount,
            getCartTotal,
            isLoading
        }}>
            {children}
        </CartContext.Provider>
    );
};
