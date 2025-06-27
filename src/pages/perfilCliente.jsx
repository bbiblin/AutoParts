import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import OrderCard from "../components/orderCard";

// Modal para detalles del pedido, responsive
const PedidoDetalleModal = ({ pedido, onClose, formatPrice }) => {
  if (!pedido) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full sm:w-auto max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-6 shadow-xl transition-all">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Detalle del Pedido</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 transition"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-700 text-sm mb-2">
          Código: <span className="font-medium">{pedido.cod_pedido || pedido.codigo}</span>
        </p>
        <p className="text-gray-700 text-sm mb-2">
          Fecha: {new Date(pedido.createdAt || pedido.fecha).toLocaleDateString()}
        </p>
        <p className="text-gray-700 text-sm mb-2">Estado: {pedido.state || pedido.status}</p>
        <p className="text-gray-700 text-sm mb-4">
          Total: <span className="font-bold">{formatPrice(pedido.precio_total || pedido.total)}</span>
        </p>

        <h4 className="text-gray-800 font-semibold mb-2">Productos:</h4>
        <ul className="space-y-2">
          {pedido.detalles_pedido?.length > 0 ? (
            pedido.detalles_pedido.map((item, i) => (
              <li key={i} className="text-sm text-gray-700 border-b pb-2">
                {item.product?.product_name || item.producto?.nombre || "Producto"} x{item.cantidad} -{" "}
                {formatPrice(item.subtotal || item.precio)}
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500 italic">No hay productos en este pedido</li>
          )}
        </ul>
      </div>
    </div>
  );
};

// Spinner de carga
const LoadingSpinner = ({ message = "Cargando..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin h-16 w-16 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
        <div className="absolute inset-0 bg-blue-100 opacity-20 rounded-full animate-pulse"></div>
      </div>
      <p className="mt-6 font-medium text-gray-800">{message}</p>
    </div>
  </div>
);

// Hook para obtener token válido
const useAuthToken = () => {
  const getValidToken = useCallback(() => {
    const cookieToken = Cookies.get("authToken");
    if (!cookieToken || cookieToken === "undefined" || cookieToken === "null" || cookieToken.trim() === "") {
      console.error("Token inválido en cookies:", cookieToken);
      return null;
    }
    return cookieToken;
  }, []);
  return { getValidToken };
};

// Hook para datos del usuario
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
          "Content-Type": "application/json",
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

// Hook para pedidos
const usePedidos = (isLoggedIn, user) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getValidToken } = useAuthToken();

  const fetchOrders = useCallback(async () => {
    if (!isLoggedIn || !user) {
      setPedidos([]);
      return;
    }
    try {
      setLoading(true);
      const token = getValidToken();
      if (!token) {
        console.error("No se pueden obtener pedidos: token inválido");
        setPedidos([]);
        return;
      }

      const res = await axios.get("https://autoparts-i2gt.onrender.com/pedidos/usuario", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setPedidos(res.data || []);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      if (error.response?.status === 401) {
        setPedidos([]);
      }
    } finally {
      setLoading(false);
    }
  }, [getValidToken, isLoggedIn, user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, user]);

  return { pedidos, loading, refetch: fetchOrders };
};

export default function PerfilCliente() {
  const { user, isLoggedIn } = useAuth();
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [saving, setSaving] = useState(false);
  const { getValidToken } = useAuthToken();
  const { formData, setFormData, loading } = useUserData(isLoggedIn, user);
  const { pedidos, loading: pedidosLoading } = usePedidos(isLoggedIn, user);

  const openPedidoDetails = (pedido) => setSelectedPedido(pedido);
  const closeModal = () => setSelectedPedido(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    const token = getValidToken();
    if (!token) {
      alert("Error: No se puede actualizar el perfil. Token de sesión inválido.");
      return;
    }

    setSaving(true);
    try {
      const updateData = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] && formData[key].trim() !== "") {
          updateData[key] = formData[key];
        }
      });

      await axios.patch("https://autoparts-i2gt.onrender.com/users/profile", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("¡Datos actualizados correctamente!");
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      const errorMessage = error.response?.data?.error || "No se pudo actualizar el perfil";
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  if (loading) return <LoadingSpinner message="Cargando tu perfil..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      {isLoggedIn ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-gray-700 rounded-2xl mb-6 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
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
            {/* Información Personal */}
            <div className="xl:col-span-2">
              <div className="bg-white backdrop-blur-sm rounded-2xl shadow-xl border border-gray-300 overflow-hidden">
                <div className="bg-brand-darBlue px-8 py-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <svg
                      className="w-6 h-6 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
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
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Guardando cambios...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Historial de Pedidos */}
            <div className="xl:col-span-1">
              <div className="bg-white backdrop-blur-sm rounded-2xl shadow-xl border border-gray-300 sticky top-8 overflow-hidden">
                <div className="bg-gray-700 px-6 py-5">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Mis Pedidos
                  </h2>
                </div>

                <div className="p-6">
                  {pedidosLoading ? (
                    <LoadingSpinner message="Cargando pedidos..." />
                  ) : pedidos.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="w-10 h-10 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay pedidos aún</h3>
                      <p className="text-gray-600 mb-4">Cuando realices un pedido, aparecerá aquí.</p>
                      <Link
                        to="/"
                        className="inline-block px-6 py-3 bg-red-700 text-white rounded-xl shadow hover:bg-red-600 transition"
                      >
                        Comprar ahora
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {pedidos.map((pedido) => (
                        <div
                          key={pedido.id || pedido._id}
                          className="cursor-pointer hover:shadow-lg border rounded-xl p-4 transition"
                          onClick={() => openPedidoDetails(pedido)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") openPedidoDetails(pedido);
                          }}
                          aria-label={`Ver detalles del pedido ${pedido.cod_pedido || pedido.codigo}`}
                        >
                          <OrderCard pedido={pedido} formatPrice={formatPrice} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal de detalle pedido */}
          <PedidoDetalleModal pedido={selectedPedido} onClose={closeModal} formatPrice={formatPrice} />
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-8 max-w-lg text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-4">No has iniciado sesión</h2>
            <p className="mb-6 text-gray-700">Por favor, inicia sesión para acceder a tu perfil.</p>
            <Link
              to="/login"
              className="inline-block bg-red-700 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente Input reutilizable para formularios
function FormInput({ label, name, type = "text", value, onChange, placeholder, required = false, helperText }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1 select-none"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-700 focus:ring-1 focus:ring-red-700"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={type === "password" ? "new-password" : "off"}
        spellCheck="false"
      />
      {helperText && <p className="text-xs text-gray-400 mt-1">{helperText}</p>}
    </div>
  );
}
