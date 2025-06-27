import React from "react";

export default function OrderCard({ pedido, formatPrice, onClick }) {
    return (
        <button
            onClick={() => onClick(pedido)}
            className="w-full text-left bg-white backdrop-blur-sm p-5 rounded-xl border border-gray-300 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 hover:border-blue-400"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="font-bold text-gray-800">Pedido #{pedido.id}</span>
                </div>
                <span
                    className={`text-xs font-semibold px-3 py-1 rounded-md ${pedido.state === "pagado"
                        ? "bg-green-100 text-green-800"
                        : pedido.state === "cotización enviada"
                            ? "bg-blue-100 text-blue-700"
                            : pedido.state === "rechazado"
                                ? "bg-red-100 text-red-700"
                                : pedido.state === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                        }`}
                >
                    {pedido.state}
                </span>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium text-gray-800">
                        {new Date(pedido.createdAt).toLocaleDateString("es-CL")}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-blue-600">
                        {formatPrice(pedido.precio_total)}
                    </span>
                </div>
            </div>
        </button>
    );
}
