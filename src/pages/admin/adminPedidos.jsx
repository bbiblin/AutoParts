import React, { useEffect, useState } from 'react';
import { Search, Eye, Trash2, Package, Truck, X } from 'lucide-react';
import axios from 'axios';

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState(null);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://autoparts-i2gt.onrender.com/pedidos');
      setPedidos(res.data);
      setFilteredPedidos(res.data);
    } catch (err) {
      console.error('Error al obtener pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePedido = async (id) => {
    if (confirm('¿Estás seguro de eliminar este pedido?')) {
      try {
        await axios.delete(`https://autoparts-i2gt.onrender.com/pedidos/${id}`);
        await fetchPedidos();
      } catch (err) {
        alert('Error al eliminar el pedido.');
      }
    }
  };

  const openPedidoDetails = (pedido) => {
    setSelectedPedido(pedido);
  };

  const closeModal = () => {
    setSelectedPedido(null);
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  useEffect(() => {
    const filtered = pedidos.filter((pedido) =>
      pedido.cod_pedido.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPedidos(filtered);
  }, [searchTerm, pedidos]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex items-center space-x-3">
          <Truck className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
            <p className="text-gray-600">Visualiza y gestiona los pedidos de clientes</p>
          </div>
        </div>

        {/* Filtro */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por código de pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <span className="font-medium">{filteredPedidos.length}</span>
              <span className="ml-1">pedidos encontrados</span>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-brand-darBlue text-xs text-[#b8b8b8] uppercase tracking-wider">
                <tr>
                  {['ID', 'Código', 'Cliente', 'Fecha', 'Estado', 'Total', 'Acciones'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{pedido.id}</td>
                    <td className="px-6 py-4">{pedido.cod_pedido}</td>
                    <td className="px-6 py-4">{pedido.user?.name || 'Cliente desconocido'}</td>
                    <td className="px-6 py-4">{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
                    <td className="px-6 py-4 capitalize">{pedido.state}</td>
                    <td className="px-6 py-4">${pedido.precio_total}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => openPedidoDetails(pedido)} className="text-[#142985] p-1 rounded ">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeletePedido(pedido.id)} className="text-[#c40b0b] p-1 rounded ">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de detalles */}
        {selectedPedido && (
          <div className="fixed inset-0 z-50 bg-brand-darBlue bg-opacity-40 flex items-center justify-center">
            <div className="bg-[#ffff] w-full max-w-2xl p-6 rounded-lg shadow-lg relative">
              <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Detalles del Pedido</h2>
              <div className="space-y-2">
                <p><strong>Código:</strong> {selectedPedido.cod_pedido}</p>
                <p><strong>Cliente:</strong> {selectedPedido.user?.name}</p>
                <p><strong>Fecha:</strong> {new Date(selectedPedido.fecha_pedido).toLocaleDateString()}</p>
                <p><strong>Estado:</strong> {selectedPedido.state}</p>
                <p><strong>Total:</strong> ${selectedPedido.precio_total}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Productos:</h3>
                {selectedPedido.detalles_pedido?.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedPedido.detalles_pedido.map((detalle, idx) => (
                      <li key={idx} className="border p-2 rounded-md bg-gray-50">
                        <p><strong>Producto:</strong> {detalle.product?.product_name}</p>
                        <p><strong>Cantidad:</strong> {detalle.cantidad}</p>
                        <p><strong>Precio unitario:</strong> ${detalle.subtotal}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Este pedido no tiene productos.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
