import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/cartContext';

const CartIcon = ({ className = "" }) => {
    const { getCartItemsCount } = useCart();
    const itemCount = getCartItemsCount();

    return (
        <Link
            to="/carrito"
            className={`relative p-2 text-[#F5F5F5] hover:text-blue-300 transition-colors duration-300 ${className}`}
            aria-label="Ver carrito de compras"
        >
            {/* Icono del carrito */}
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19M7 13v4a2 2 0 002 2h8a2 2 0 002-2v-4m-8 6h4"
                />
            </svg>

            {/* Badge con contador */}
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D72638] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] transform transition-transform duration-300 hover:scale-110">
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </Link>
    );
};

export default CartIcon;