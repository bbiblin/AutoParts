import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const userData = {
        email: formData.email,
        password: formData.password,
      };
      console.log("Data: ", userData);
      const response = await axios.post("https://autoparts-i2gt.onrender.com/users/login", userData);
      if (response) {
        console.log("Response:", response.data.user);
        navigate("/");
      } else {
        console.log("Datos incorrectos");
      }
    } catch (error) {
      console.error("Ha ocurrido un error", error);

    }
  };

  return (
    <div
      className={`w-full h-screen px-6 bg-gray-100 flex flex-col items-center justify-center transition-all duration-700 ease-out ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1E1E1E] mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-lg text-[#555555]">
            Accede a tu cuenta para comprar
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#1E1E1E] mb-2"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[#1E1E1E] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#D72638] focus:border-transparent transition-all"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#1E1E1E] mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[#1E1E1E] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#D72638] focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-[#D72638] focus:ring-[#D72638] border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-[#555555]">Recordarme</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-[#D72638] hover:text-[#BB2F3D] font-medium transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-3 px-4 bg-[#D72638] border border-[#BB2F3D] rounded-lg text-[#F5F5F5] text-base font-medium hover:scale-105 active:scale-95 transition-transform"
          >
            Iniciar Sesión
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-[#555555]">o</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-[#555555]">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="text-[#D72638] hover:text-[#BB2F3D] font-medium transition-colors bg-transparent border-none cursor-pointer"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Back to Home */}
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
