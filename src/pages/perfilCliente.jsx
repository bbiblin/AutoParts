import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import { useNavigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
import OrderCard from '../components/orderCard'

const [selectedPedido, setSelectedPedido] = useState(null);

const openPedidoDetails = (pedido) => {
  setSelectedPedido(pedido);
};

const closeModal = () => {
  setSelectedPedido(null);
};


// 🎨 Componente de Loading mejorado
const LoadingSpinner = ({ message = "Cargando..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
        <div className="animate-pulse absolute inset-0 rounded-full bg-blue-100 opacity-20"></div>
      </div>
      <p className="mt-6 text-gray-800 font-medium">{message}</p>
    </div>
  </div>
);

// 🎨 Componente de Input mejorado
const FormInput = ({ label, name, type = "text", value, onChange, required = false, placeholder, helperText }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-600 bg-white backdrop-blur-sm"
    />
    {helperText && (
      <p className="text-xs text-gray-500 mt-1">{helperText}</p>
    )}
  </div>
);

// 🎨 Hook personalizado para manejo de autenticación
const useAuthToken = () => {
  const getValidToken = useCallback(() => {
    const cookieToken = Cookies.get('authToken');

    if (!cookieToken || cookieToken === 'undefined' || cookieToken === 'null' || cookieToken.trim() === '') {
      console.error('Token inválido en cookies:', cookieToken);
      return null;
    }

    return cookieToken;
  }, []);

  return { getValidToken };
};

// 🎨 Hook personalizado para datos del usuario
const useUserData = (isLoggedIn, user) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    address: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const { getValidToken } = useAuthToken();

  const fetchUserData = useCallback(async () => {
    try {
      const token = getValidToken();

      if (!token) {
        console.error('No se puede obtener datos del usuario: token inválido');
        if (user) {
          setFormData({
            email: user.email || "",
            username: user.username || "",
            name: user.name || "",
            address: user.address || "",
            phone: user.phone || "",
            password: "",
          });
        }
        return;
      }

      const res = await axios.get("https://autoparts-i2gt.onrender.com/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const userData = res.data.user || res.data;
      setFormData({
        email: userData.email || "",
        username: userData.username || "",
        name: userData.name || "",
        address: userData.address || "",
        phone: userData.phone || "",
        password: "",
      });
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);

      if (user) {
        setFormData({
          email: user.email || "",
          username: user.username || "",
          name: user.name || "",
          address: user.address || "",
          phone: user.phone || "",
          password: "",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [getValidToken, user]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, fetchUserData]);

  return { formData, setFormData, loading };
};

// 🎨 Hook personalizado para pedidos
const usePedidos = (isLoggedIn) => {
  const [pedidos, setPedidos] = useState([]);
  const { getValidToken } = useAuthToken();

  const fetchOrders = useCallback(async () => {
    try {
      const token = getValidToken();

      if (!token) {
        console.error('No se pueden obtener pedidos: token inválido');
        return;
      }

      const res = await axios.get("https://autoparts-i2gt.onrender.com/pedidos", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setPedidos(res.data || []);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  }, [getValidToken]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn, fetchOrders]);

  return { pedidos };
};

// 🎨 Componente principal mejorado
export default function PerfilCliente() {
  const { user, isLoggedIn } = useAuth();
  const [saving, setSaving] = useState(false);
  const { getValidToken } = useAuthToken();
  const { formData, setFormData, loading } = useUserData(isLoggedIn, user);
  const { pedidos } = usePedidos(isLoggedIn);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    const token = getValidToken();
    if (!token) {
      alert('Error: No se puede actualizar el perfil. Token de sesión inválido.');
      return;
    }

    setSaving(true);
    try {
      const updateData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] && formData[key].trim() !== "") {
          updateData[key] = formData[key];
        }
      });

      await axios.patch("https://autoparts-i2gt.onrender.com/users/profile", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      alert("¡Datos actualizados correctamente!");
      setFormData(prev => ({ ...prev, password: "" }));
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      const errorMessage = error.response?.data?.error || "No se pudo actualizar el perfil";
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando tu perfil..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      {isLoggedIn ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 🎨 Header mejorado */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-gray-700 rounded-2xl mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
              Mi Perfil
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Gestiona tu información personal y mantén un seguimiento de todos tus pedidos
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* 🎨 Información Personal mejorada */}
            <div className="xl:col-span-2">
              <div className="bg-white backdrop-blur-sm rounded-2xl shadow-xl border border-gray-300 overflow-hidden">
                <div className="bg-brand-darBlue px-8 py-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Información Personal
                  </h2>
                </div>

                <div className="p-8">
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Nombre de Usuario"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                      <FormInput
                        label="Nombre Completo"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <FormInput
                      label="Correo Electrónico"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Teléfono"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+56 9 1234 5678"
                      />
                      <FormInput
                        label="Dirección"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Tu dirección completa"
                      />
                    </div>

                    <FormInput
                      label="Nueva Contraseña"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      helperText="Solo completa si deseas cambiar tu contraseña actual"
                    />

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-red-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Guardando cambios...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* 🎨 Historial de Pedidos mejorado */}
            <div className="xl:col-span-1">
              <div className="bg-white backdrop-blur-sm rounded-2xl shadow-xl border border-gray-300 sticky top-8 overflow-hidden">
                <div className="bg-gray-700 px-6 py-5">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Mis Pedidos
                  </h2>
                </div>

                <div className="p-6">
                  {pedidos.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        No hay pedidos aún
                      </h3>
                      <p className="text-gray-600 mb-6">
                        ¡Explora nuestro catálogo y realiza tu primer pedido!
                      </p>
                      <Link
                        to="/productos"
                        className="inline-flex items-center bg-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Ver Productos
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                      {pedidos.map((pedido) => (
                        <OrderCard key={pedido.id} pedido={pedido} formatPrice={formatPrice} onClick={openPedidoDetails} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-gray-700 rounded-3xl mb-8 shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
              Accede a tu perfil
            </h2>
            <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
              Inicia sesión para acceder a tu información personal y gestionar tus pedidos
            </p>
            <Link
              to="/users/login"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-red-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Iniciar Sesión
            </Link>
          </div>
        </div>
      )}

      {selectedPedido && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Detalles del Pedido</h2>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {selectedPedido.id}</p>
              <p><strong>Fecha:</strong> {new Date(selectedPedido.createdAt).toLocaleDateString('es-CL')}</p>
              <p><strong>Estado:</strong> {selectedPedido.state}</p>
              <p><strong>Total:</strong> {formatPrice(selectedPedido.precio_total)}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Productos:</h3>
              {selectedPedido.detalles_pedido?.length > 0 ? (
                <ul className="space-y-2">
                  {selectedPedido.detalles_pedido.map((detalle, idx) => (
                    <li key={idx} className="border p-2 rounded-md bg-gray-50 text-sm">
                      <p><strong>Producto:</strong> {detalle.product?.product_name}</p>
                      <p><strong>Cantidad:</strong> {detalle.cantidad}</p>
                      <p><strong>Subtotal:</strong> {formatPrice(detalle.subtotal)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Este pedido no tiene productos detallados.</p>
              )}
            </div>
          </div>
        </div>
      )}


      {/* 🎨 CSS personalizado para scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2563EB;
          border-radius: 10px;
        }
      
      `}</style>
    </div>
  );
}