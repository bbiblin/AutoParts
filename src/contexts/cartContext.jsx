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
                // Actualizar el estado local PRIMERO (actualización optimista)
                const updatedItems = cartItems.map(item =>
                    item.id === itemId
                        ? { ...item, quantity: newQuantity }
                        : item
                );
                setCartItems(updatedItems);

                // Luego hacer la petición al servidor
                await axios.put(`http://localhost:5374/cart/update/${itemId}`, {
                    quantity: newQuantity
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('authToken')}`
                    }
                });
            }
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);

            // Si hay error, recargar el carrito para sincronizar
            await loadCart();

        };
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
