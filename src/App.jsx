// App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Productos from './pages/productos';
import Login from './pages/login';
import Register from './pages/register';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Cart from './pages/cart';
import Destacados from './pages/productosDestacados';
import DetallesProducto from './pages/detalleProducto';
import CatalogoMayorista from './pages/catalogoMayorista';
import AboutUs from './pages/aboutUs';
import WebPayConfirm from './pages/webpayConfirm';
import MayoristaCart from './pages/mayoristaCart';
import ConfirmarOrden from './pages/confirmarOrden';
import AdminHome from './pages/admin/adminHome';
import AdminProductos from './pages/admin/adminProductos';
import { AuthProvider } from './contexts/authContext';
import { CartProvider } from './contexts/cartContext';
import ProtectedRoute from './components/protectedRoute';
import '../src/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useAuth } from './contexts/authContext';
import AdminNavBar from './components/admin/adminNavbar';

function AppContent() {
  const { user } = useAuth();
  const isAdmin = user && user.admin === true;

  return (
    <>
      {/* Solo mostrar Navbar si no es admin */}
      {!isAdmin && <Navbar />}
      
      {isAdmin && <AdminNavBar/>}
    
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/register" element={<Register />} />
        <Route path="/productos_destacados" element={<Destacados />} />
        {isAdmin && <Route path="/adminHome" element={<AdminHome />} />}
        {isAdmin && <Route path="/adminProductos" element={<AdminProductos />} />}

        
        {!isAdmin && 
          <Route 
            path="/cart"
            element={
              isAdmin ? (
                <Cart />
              ) : (
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              )
            }
          />
        }
        <Route path="/detalles_producto/:id" element={<DetallesProducto />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/webpay/confirm" element={<WebPayConfirm />} />
        <Route
          path="/catalogo_mayorista"
          element={
            isAdmin ? (
              <CatalogoMayorista />
            ) : (
              <ProtectedRoute>
                <CatalogoMayorista />
              </ProtectedRoute>
            )
          }
        />
        <Route
          path="/mayoristaCart"
          element={
            isAdmin ? (
              <MayoristaCart />
            ) : (
              <ProtectedRoute>
                <MayoristaCart />
              </ProtectedRoute>
            )
          }
        /> 
        <Route path="/confirmarOrden" element={<ConfirmarOrden />} />
      </Routes>
      
      {/* Solo mostrar Footer si no es admin */}
      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}