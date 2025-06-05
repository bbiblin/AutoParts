import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children }) {
    const userId = Cookies.get("user_id");
    const isDistribuitor = Cookies.get("isDistribuitor") === "true";
    const location = useLocation();

    // Ruta carrito normal (ajusta según tu ruta real)
    const isCartRoute = location.pathname === "/cart" || location.pathname === "/carrito";

    // Si no hay usuario, siempre redirigir al login
    if (!userId) {
        return <Navigate to="/users/login" replace />;
    }

    // Si es distribuidor y accede al carrito normal, lo bloqueamos (redireccionar a home)
    if (isDistribuitor && isCartRoute) {
        return <Navigate to="/" replace />;
    }

    // Si es distribuidor, pero accede a ruta válida para distribuidor, permitir
    // Si no es distribuidor y accede a ruta normal, permitir

    return children;
}
