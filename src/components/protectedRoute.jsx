import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children }) {
    const userId = Cookies.get("user_id");
    const isDistribuitor = Cookies.get("isDistribuitor") === "true";
    const location = useLocation();

    const isCartRoute = location.pathname === "/cart" || location.pathname === "/carrito";

    if (!userId) {
        return <Navigate to="/users/login" replace />;
    }

    if (isDistribuitor && isCartRoute) {
        return <Navigate to="/" replace />;
    }

    return children;
}
