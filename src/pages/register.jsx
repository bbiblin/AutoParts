import axios from "axios";
import { User } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({

    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    name: "",
    address: "",
    phone: "",
    isDistribuitor: false,
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }

    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    // Validación de confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validación de username
    if (!formData.username) {
      newErrors.username = "El nombre de usuario es requerido";
    } else if (formData.username.length < 3) {
      newErrors.username =
        "El nombre de usuario debe tener al menos 3 caracteres";
    }

    // Validación de nombre
    if (!formData.name) {
      newErrors.name = "El nombre completo es requerido";
    }

    // Validación de dirección
    if (!formData.address) {
      newErrors.address = "La dirección es requerida";
    }

    // Validación de teléfono
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!formData.phone) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Ingresa un teléfono válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (validateForm()) {
        // Preparar datos para enviar (sin confirmPassword)
        const { confirmPassword, ...userData } = formData;
        console.log("Registro exitoso:", userData);
        const response = await axios.post('https://autoparts-i2gt.onrender.com/users/register', userData);

        if (response) {
          console.log("El usuario ha sido registrado correctamente");
          navigate("/users/login");
        } else {
          console.log("Registro fallido");
        }
      }
    } catch (error) {
      console.error("Ha ocurrido un error al registrarse", error);
    }

  };

  return (
    <div
      className={`w-full min-h-screen px-6 py-12 bg-gray-100 flex flex-col items-center justify-center transition-all duration-700 ease-out ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1E1E1E] mb-2">
            Crear Cuenta
          </h1>
          <p className="text-lg text-[#555555]">
            Únete a nuestra comunidad de repuestos
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Nombre completo */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#1E1E1E] mb-2"
            >
              Nombre completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg text-[#1E1E1E] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#D72638] focus:border-transparent transition-all ${errors.name ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="Juan Pérez"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[#1E1E1E] mb-2"
            >
              Nombre de usuario *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg text-[#1E1E1E] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#D72638] focus:border-transparent transition-all ${errors.username ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="juanperez123"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#1E1E1E] mb-2"
            >
              Correo electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg text-[#1E1E1E] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#D72638] focus:border-transparent transition-all ${errors.email ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="juan@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-[#1E1E1E] mb-2"
            >
              Teléfono *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg text-[#1E1E1E] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#D72638] focus:border-transparent transition-all ${errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="+1 234 567 8900"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Dirección */}
          <div>
            <label
              htmlFor="addressDetail"
              className="block text-sm font-medium text-[#1E1E1E] mb-2"
            >
              Dirección *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-4 py-3 border rounded-lg text-[#1E1E1E] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#D72638] focus:border-transparent transition-all resize-none ${errors.address ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="Calle 123, Ciudad, País"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#1E1E1E] mb-2"
            >
              Contraseña *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg text-[#1E1E1E] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#D72638] focus:border-transparent transition-all ${errors.password ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#1E1E1E] mb-2"
            >
              Confirmar contraseña *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg text-[#1E1E1E] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#D72638] focus:border-transparent transition-all ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Checkbox distribuidor */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDistribuitor"
              name="isDistribuitor"
              checked={formData.isDistribuitor}
              onChange={handleInputChange}
              className="h-4 w-4 text-[#D72638] focus:ring-[#D72638] border-gray-300 rounded"
            />
            <label
              htmlFor="isDistribuitor"
              className="ml-2 text-sm text-[#555555]"
            >
              Soy distribuidor/vendedor de repuestos
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 px-4 bg-[#D72638] border border-[#BB2F3D] rounded-lg text-[#F5F5F5] text-base font-medium hover:scale-105 active:scale-95 transition-transform"
          >
            Crear Cuenta
          </button>
        </div>

        {/* Division */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-[#555555]">o</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Redirige a Login*/}
        <div className="text-center">
          <p className="text-sm text-[#555555]">
            ¿Ya tienes una cuenta?
            <Link
              to="/login"
              className="text-[#D72638] hover:text-[#BB2F3D] font-medium transition-colors bg-transparent border-none cursor-pointer"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Volver al inicio */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-sm text-[#555555] hover:text-[#1E1E1E] transition-colors bg-transparent border-none cursor-pointer"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
