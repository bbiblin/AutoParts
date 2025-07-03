import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import OrderCard from "../components/orderCard";

const PedidoDetalleModal = ({ pedido, onClose, formatPrice }) => {
  if (!pedido) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white w-full sm:w-auto sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl transition-all transform animate-fadeInUp">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200 rounded-t-3xl sm:rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-gray-700 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Detalle del Pedido</h3>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all duration-200"
              aria-label="Cerrar modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Código</p>
            <p className="text-base font-semibold text-blue-800">{pedido.cod_pedido || pedido.codigo}</p>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
            <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Fecha</p>
            <p className="text-base font-semibold text-green-800">
              {new Date(pedido.createdAt || pedido.fecha).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Estado</p>
            <p className="text-base font-semibold text-purple-800">{pedido.state || pedido.status}</p>
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">Total</p>
            <p className="text-base font-semibold text-red-800">{formatPrice(pedido.precio_total || pedido.total)}</p>
          </div>
        </div>


        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h4 className="text-lg font-semibold text-gray-800">Productos incluidos</h4>
          </div>

          {pedido.detalles_pedido?.length > 0 ? (
            <div className="space-y-3">
              {pedido.detalles_pedido.map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {item.product?.product_name || item.producto?.nombre || "Producto"}
                      </p>
                      <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{formatPrice(item.subtotal || item.precio)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-4.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
              </svg>
              <p className="text-gray-500 italic">No hay productos en este pedido</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = ({ message = "Cargando..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
    <div className="text-center">
      <div className="relative mb-8">
        <div className="animate-spin h-16 w-16 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
        <div className="absolute inset-0 bg-blue-100 opacity-20 rounded-full animate-pulse"></div>
      </div>
      <div className="bg-white px-6 py-3 rounded-full shadow-lg border border-gray-200">
        <p className="font-medium text-gray-800">{message}</p>
      </div>
    </div>
  </div>
);

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
          <div className="text-center mb-16">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-gray-700 rounded-3xl blur-lg opacity-20 scale-110"></div>
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-gray-700 rounded-3xl shadow-xl">
                <svg
                  className="w-12 h-12 text-white"
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
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent mb-6 tracking-tight">
              Mi Perfil
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed">
                Gestiona tu información personal y mantén un seguimiento de todos tus pedidos
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-gray-700 rounded-full mx-auto mt-6"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            <div className="xl:col-span-2">
              <div className="bg-white backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-3xl transition-all duration-300">
                <div className="bg-gradient-to-r from-brand-darBlue to-gray-800 px-8 py-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
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
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Información Personal</h2>
                      <p className="text-blue-100 opacity-90">Actualiza tus datos cuando lo necesites</p>
                    </div>
                  </div>
                </div>

                <div className="p-10">
                  <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormInput
                        label="Nombre de Usuario"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        icon="user"
                      />
                      <FormInput
                        label="Nombre Completo"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        icon="identification"
                      />
                    </div>

                    <FormInput
                      label="Correo Electrónico"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      icon="mail"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormInput
                        label="Teléfono"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+56 9 1234 5678"
                        icon="phone"
                      />
                      <FormInput
                        label="Dirección"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Tu dirección completa"
                        icon="location"
                      />
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                      <FormInput
                        label="Nueva Contraseña"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        helperText="Solo completa si deseas cambiar tu contraseña actual"
                        icon="lock"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-red-700 text-white px-8 py-5 rounded-2xl font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
                    >
                      {saving ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                            className="w-6 h-6 mr-3"
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

            <div className="xl:col-span-1">
              <div className="bg-white backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 sticky top-8 overflow-hidden hover:shadow-3xl transition-all duration-300">
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-8 py-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
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
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Mis Pedidos</h2>
                      <p className="text-gray-300 text-sm">Historial completo</p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {pedidosLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full mb-4"></div>
                      <p className="text-gray-600">Cargando pedidos...</p>
                    </div>
                  ) : pedidos.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="relative mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                          <svg
                            className="w-12 h-12 text-gray-500"
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
                        <div className="absolute inset-0 bg-gray-300 opacity-20 rounded-3xl blur-xl"></div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">No hay pedidos aún</h3>
                      <p className="text-gray-600 mb-8 leading-relaxed">
                        Cuando realices tu primer pedido, aparecerá aquí para que puedas hacer seguimiento.
                      </p>
                      <Link
                        to="/"
                        className="inline-flex items-center px-8 py-4 bg-red-700 text-white rounded-2xl shadow-lg hover:bg-red-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Comprar ahora
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {pedidos.map((pedido, index) => (
                        <div
                          key={pedido.id || pedido._id}
                          className="cursor-pointer hover:shadow-xl border border-gray-200 rounded-2xl p-5 transition-all duration-300 hover:border-gray-300 transform hover:-translate-y-1 bg-gradient-to-r from-white to-gray-50"
                          onClick={() => openPedidoDetails(pedido)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") openPedidoDetails(pedido);
                          }}
                          aria-label={`Ver detalles del pedido ${pedido.cod_pedido || pedido.codigo}`}
                          style={{ animationDelay: `${index * 100}ms` }}
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

          <PedidoDetalleModal pedido={selectedPedido} onClose={closeModal} formatPrice={formatPrice} />
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-12 max-w-md text-center shadow-2xl border border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-red-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">No has iniciado sesión</h2>
            <p className="mb-8 text-gray-600 leading-relaxed">
              Para acceder a tu perfil y ver tu historial de pedidos, necesitas iniciar sesión primero.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center bg-red-700 text-white px-8 py-4 rounded-2xl hover:bg-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Iniciar sesión
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function FormInput({ label, name, type = "text", value, onChange, placeholder, required = false, helperText, icon }) {
  const getIcon = () => {
    const iconClasses = "w-5 h-5 text-gray-400 group-focus-within:text-red-600 transition-colors";

    switch (icon) {
      case "user":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case "identification":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        );
      case "mail":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "phone":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case "location":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "lock":
        return (
          <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group">
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700 mb-3 select-none flex items-center space-x-2"
      >
        {icon && getIcon()}
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          className="block w-full px-4 py-4 rounded-2xl border-2 border-gray-200 shadow-sm focus:border-red-600 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white hover:border-gray-300"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={type === "password" ? "new-password" : "off"}
          spellCheck="false"
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-focus-within:opacity-5 transition-opacity duration-200 pointer-events-none"></div>
      </div>
      {helperText && (
        <p className="text-sm text-gray-500 mt-2 flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{helperText}</span>
        </p>
      )}
    </div>
  );
}