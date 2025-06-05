import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext"; // Ajusta la ruta según tu estructura

export default function Login() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();
  const { login, isLoggedIn, user } = useAuth();

  // Redirigir si ya está logueado
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.isAdmin === true) {
        navigate("/adminHome");
      } else if (user.isDistribuitor === true) {
        navigate("/catalogo_mayorista");
      } else {
        navigate("/");
      }
    }
  }, [isLoggedIn, user, navigate]);

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

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
      };

      console.log("Data: ", userData);
      const response = await axios.post("https://autoparts-i2gt.onrender.com/users/login", userData);

      if (response.data) {
        console.log("Response:", response.data);

        // Usar la función login del contexto con navigate
        login(
          response.data.user,
          response.data.token,
        );

        const tokensito = localStorage.getItem("authToken");
        setToken(tokensito);

       
      }
    } catch (error) {
      console.error("Ha ocurrido un error", error);

      // Mostrar mensaje de error más específico
      if (error.response) {
        setError(error.response.data.message || "Credenciales incorrectas");
      } else if (error.request) {
        setError("Error de conexión. Inténtalo de nuevo.");
      } else {
        setError("Ha ocurrido un error inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`w-full h-screen px-6 bg-gray-100 flex flex-col items-center justify-center transition-all duration-700 ease-out ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1E1E1E] mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-lg text-[#555555]">
            Accede a tu cuenta para comprar
          </p>
        </div>

        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        
        <form onSubmit={handleSubmit} className="space-y-6">
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
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[#1E1E1E] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#D72638] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[#1E1E1E] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#D72638] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
            

            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#D72638] border border-[#BB2F3D] rounded-lg text-[#F5F5F5] text-base font-medium hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-[#555555]">o</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        
        <div className="text-center">
          <p className="text-sm text-[#555555]">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/users/register"
              className="text-[#D72638] hover:text-[#BB2F3D] font-medium transition-colors bg-transparent border-none cursor-pointer"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        
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