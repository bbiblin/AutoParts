import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import { useNavigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';

export default function PerfilCliente() {
  const { user, logout, isLoggedIn } = useAuth(); // ✅ Removido token del contexto
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    address: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Función para obtener el token válido
  const getValidToken = () => {
    const cookieToken = Cookies.get('authToken');
    
    if (!cookieToken) {
      console.error('No hay token en cookies');
      return null;
    }
    
    // Verificar que el token no esté vacío o sea "undefined"
    if (cookieToken === 'undefined' || cookieToken === 'null' || cookieToken.trim() === '') {
      console.error('Token inválido en cookies:', cookieToken);
      return null;
    }
    
    return cookieToken;
  };

  // Debug de cookies
  useEffect(() => {
    const token = getValidToken();
    console.log('Token obtenido:', token ? 'VÁLIDO' : 'INVÁLIDO');
    console.log('userId:', Cookies.get('user_id'));
    console.log('isLoggedIn:', isLoggedIn);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchUserData();
    fetchOrders();
  }, [isLoggedIn]);

  const fetchUserData = async () => {
    try {
      const token = getValidToken();
      
      if (!token) {
        console.error('No se puede obtener datos del usuario: token inválido');
        // Usar datos del contexto como fallback
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

      console.log('Haciendo petición a /users/profile con token válido');
      
      const res = await axios.get("https://autoparts-i2gt.onrender.com/users/profile", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      console.log('Respuesta del servidor:', res.data);
      
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
      console.error("Error response:", error.response?.data);
      
      // ✅ FALLBACK: Usar datos del contexto si falla la petición
      if (user) {
        console.log('Usando datos del contexto como fallback');
        setFormData({
          email: user.email || "",
          username: user.username || "",
          name: user.name || "",
          address: user.address || "",
          phone: user.phone || "",
          password: "",
        });
      }
    }
  };

  const fetchOrders = async () => {
    try {
      const token = getValidToken();
      
      if (!token) {
        console.error('No se pueden obtener pedidos: token inválido');
        setLoading(false);
        return;
      }

      const res = await axios.get("https://autoparts-i2gt.onrender.com/pedidos", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      console.error("Error response:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      return;
    }

    const token = getValidToken();
    
    if (!token) {
      alert('Error: No se puede actualizar el perfil. Token de sesión inválido.');
      return;
    }

    setSaving(true);
    try {
      // Filtrar campos vacíos para evitar enviar datos innecesarios
      const updateData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] && formData[key].trim() !== "") {
          updateData[key] = formData[key];
        }
      });

      console.log('Actualizando perfil con datos:', updateData);

      await axios.patch("https://autoparts-i2gt.onrender.com/users/profile", updateData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      alert("Datos actualizados correctamente");
      // Limpiar contraseña después de actualizar
      setFormData(prev => ({ ...prev, password: "" }));
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      console.error("Error response:", error.response?.data);
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F3A93] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {isLoggedIn ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mi Perfil
            </h1>
            <p className="text-gray-600">
              Gestiona tu información personal y revisa tus pedidos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información Personal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Información Personal
                  </h2>

                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de Usuario
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A93] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A93] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A93] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A93] focus:border-transparent"
                        placeholder="Ingresa tu teléfono"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A93] focus:border-transparent"
                        placeholder="Ingresa tu dirección"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3A93] focus:border-transparent"
                        placeholder="Deja en blanco para mantener la actual"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Solo completa si deseas cambiar tu contraseña
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-[#1F3A93] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Guardando...
                        </>
                      ) : (
                        'Guardar Cambios'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Historial de Pedidos */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Mis Pedidos
                  </h2>

                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <svg
                        className="w-16 h-16 text-gray-300 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <p className="text-gray-500 mb-4">
                        No tienes pedidos registrados
                      </p>
                      <Link
                        to="/productos"
                        className="bg-[#1F3A93] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors duration-300"
                      >
                        Ver productos
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-semibold text-gray-900">
                              Pedido #{order.id}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            Fecha: {new Date(order.createdAt).toLocaleDateString('es-CL')}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            Total: {formatPrice(order.total)}
                          </div>
                        </div>
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
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Accede a tu perfil
            </h2>
            <p className="text-gray-600 mb-8">
              Inicia sesión para ver y gestionar tu información personal
            </p>
            <Link
              to="/users/login"
              className="bg-[#1F3A93] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors duration-300"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}