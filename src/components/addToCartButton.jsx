import React, { useState } from 'react';
import { useCart } from '../contexts/cartContext';

const AddToCartButton = ({ product, quantity = 1, className = "", variant = "primary" }) => {
    const { addToCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = async () => {
        try {
            setIsLoading(true);
            await addToCart(product, quantity);

            // Mostrar confirmación visual
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);

        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            alert('Error al agregar el producto al carrito');
        } finally {
            setIsLoading(false);
        }
    };

    const getButtonStyles = () => {
        const baseStyles = "px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl";

        if (variant === "secondary") {
            return `${baseStyles} bg-gray-600 text-white hover:bg-gray-700 ${className}`;
        }

        if (variant === "outline") {
            return `${baseStyles} border-2 border-[#1F3A93] text-[#1F3A93] hover:bg-[#1F3A93] hover:text-white ${className}`;
        }

        return `${baseStyles} bg-[#1F3A93] text-[#FFFF] hover:bg-blue-800 ${className}`;
    };

    const getButtonContent = () => {
        if (isLoading) {
            return (
                <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Agregando...
                </>
            );
        }

        if (isAdded) {
            return (
                <>
                    <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    ¡Agregado!
                </>
            );
        }

        return (
            <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19M7 13v4a2 2 0 002 2h8a2 2 0 002-2v-4m-8 6h4"
                    />
                </svg>
                Agregar al carrito
            </>
        );
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={isLoading || !product}
            className={getButtonStyles()}
        >
            {getButtonContent()}
        </button>
    );
};

export default AddToCartButton;
