// PerfilCliente.jsx optimizado completamente
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import OrderCard from '../components/orderCard';

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

const FormInput = ({ label, name, type = "text", value, onChange, required = false, placeholder, helperText }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-3 border rounded-xl border-gray-400 hover:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition bg-white backdrop-blur-sm"
    />
    {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
  </div>
);

const useAuthToken = () => {
  const getValidToken = useCallback(() => {
    const token = Cookies.get('authToken');
    return (!token || token === 'undefined' || token === 'null' || token.trim() === '') ? null : token;
  }, []);
  return { getValidToken };
};

const useUserData = (isLoggedIn, user) => {
  const [formData, setFormData] = useState({ email: "", username: "", name: "", address: "", phone: "", password: "" });
  const [loading, setLoading] = useState(true);
  const { getValidToken } = useAuthToken();

  const fetchUserData = useCallback(async () => {
    const token = getValidToken();
    if (!token) return setFormData(prev => ({ ...prev, ...user, password: "" })), setLoading(false);

    try {
      const { data } = await axios.get("https://autoparts-i2gt.onrender.com/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const u = data.user || data;
      setFormData({
        email: u.email || "",
        username: u.username || "",
        name: u.name || "",
        address: u.address || "",
        phone: u.phone || "",
        password: ""
      });
    } catch (err) {
      setFormData(prev => ({ ...prev, ...user, password: "" }));
    } finally {
      setLoading(false);
    }
  }, [getValidToken, user]);

  useEffect(() => { isLoggedIn ? fetchUserData() : setLoading(false); }, [isLoggedIn, fetchUserData]);
  return { formData, setFormData, loading };
};

const usePedidos = (isLoggedIn, user) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getValidToken } = useAuthToken();

  const fetchOrders = useCallback(async () => {
    if (!isLoggedIn || !user) return setPedidos([]);
    const token = getValidToken();
    if (!token) return setPedidos([]);

    try {
      setLoading(true);
      const { data } = await axios.get("https://autoparts-i2gt.onrender.com/pedidos/usuario", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPedidos(data || []);
    } catch (err) {
      if (err.response?.status === 401) setPedidos([]);
    } finally {
      setLoading(false);
    }
  }, [getValidToken, isLoggedIn]);

  useEffect(() => { fetchOrders(); }, [fetchOrders, user]);
  return { pedidos, loading, refetch: fetchOrders };
};

export default function PerfilCliente() {
  const { user, isLoggedIn } = useAuth();
  const { formData, setFormData, loading } = useUserData(isLoggedIn, user);
  const { pedidos } = usePedidos(isLoggedIn, user);
  const { getValidToken } = useAuthToken();
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = ({ target: { name, value } }) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    const token = getValidToken();
    if (!token) return alert('Token inválido');

    setSaving(true);
    try {
      const updateData = Object.fromEntries(Object.entries(formData).filter(([_, val]) => val?.trim()));
      await axios.patch("https://autoparts-i2gt.onrender.com/users/profile", updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("¡Datos actualizados correctamente!");
      setFormData(prev => ({ ...prev, password: "" }));
    } catch (err) {
      alert(err.response?.data?.error || "No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

  if (loading) return <LoadingSpinner message="Cargando tu perfil..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4 py-12">
      {!isLoggedIn ? (
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-gray-700 rounded-3xl mb-6 shadow-xl flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 text-transparent bg-clip-text mb-4">Accede a tu perfil</h2>
          <p className="text-lg text-gray-700 mb-8">Inicia sesión para gestionar tu información y pedidos</p>
          <Link
            to="/users/login"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-red-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Iniciar Sesión
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Información Personal</h2>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput label="Nombre de Usuario" name="username" value={formData.username} onChange={handleChange} required />
                  <FormInput label="Nombre Completo" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <FormInput label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleChange} required />
                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} />
                  <FormInput label="Dirección" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <FormInput label="Nueva Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" helperText="Solo completa si deseas cambiar tu contraseña actual" />
                <button type="submit" disabled={saving} className="w-full bg-red-700 text-white py-3 rounded-xl font-semibold hover:bg-red-800 disabled:opacity-50 transition flex items-center justify-center">
                  {saving ? "Guardando cambios..." : "Guardar Cambios"}
                </button>
              </form>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-2xl shadow-xl border p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mis Pedidos</h2>
              {pedidos.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay pedidos aún</h3>
                  <p className="text-gray-600 mb-6">¡Explora nuestro catálogo y realiza tu primer pedido!</p>
                  <Link
                    to="/productos"
                    className="inline-flex items-center bg-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Ver Productos
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {pedidos.map(p => <OrderCard key={p.id} pedido={p} formatPrice={formatPrice} onClick={setSelectedPedido} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
