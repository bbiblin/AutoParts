import { useEffect, useState } from 'react';
import axios from 'axios';
import CategoriesList from '../components/categoriesList';
import AddToCartButton from '../components/addToCartButton';
import { useAuth } from '../contexts/authContext';
import { Link } from "react-router-dom";

export default function Productos() {
  const [allProducts, setAllProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [loading, setLoading] = useState(false);

  const { isLoggedIn } = useAuth();

  const getProducts = async () => {
    try {
      setLoading(true);
      let url = '';
      if (category && !brand) {
        url = `https://autoparts-i2gt.onrender.com/productos?category_id=${category}`;
      } else if (!category && brand) {
        url = `https://autoparts-i2gt.onrender.com/productos?brand_id=${brand}`;
      } else if (category && brand) {
        url = `https://autoparts-i2gt.onrender.com/productos?brand_id=${brand}&category_id=${category}`;
      } else {
        url = "https://autoparts-i2gt.onrender.com/productos";
      }

      const res = await axios.get(url);
      setAllProducts(res.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getProducts();
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f1f5f9]">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#697fb3] via-[#1e3a8a] to-[#222952] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb]/20 to-[#9333ea]/20"></div>
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <div className="text-center">

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#ffff] bg-clip-text text-transparent">
              Catálogo de Mayorista
            </h1>
            <p className="text-xl text-[#dbeafe] max-w-3xl mx-auto leading-relaxed">
              Cotiza tus productos
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filter Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-[#e2e8f0] mb-12 overflow-hidden backdrop-blur-sm">
          <div className="bg-gradient-to-r from-[#f8fafc] via-[#eff6ff] to-[#faf5ff] px-8 py-6 border-b border-[#e2e8f0]">
            <h2 className="text-xl font-bold text-[#1e293b] flex items-center">
              <div className="w-10 h-10 bg-brand-darBlue rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-[]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
              </div>
              Filtros de Búsqueda Avanzada
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8">
              <div className="flex-1">
                <CategoriesList
                  valueCategory={category}
                  valueBrand={brand}
                  onChangeCategory={(e) => setCategory(e.target.value)}
                  onChangeBrand={(e) => setBrand(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-brand-redDark text-[#ffff] px-10 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[200px] justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Buscando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Buscar Productos
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold bg-brand-darBlue bg-clip-text text-transparent flex items-center">
              <div className="w-8 h-8 bg-brand-darBlue rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              Productos Disponibles
            </h2>
            {allProducts.length > 0 && (
              <div className="bg-brand-redDark text-[#ffff] px-6 py-3 rounded-3xl font-bold shadow-lg">
                {allProducts.length} producto{allProducts.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#2563eb] mx-auto mb-6"></div>
                <div className="absolute inset-0 rounded-full h-20 w-20 border-r-4 border-[#7c3aed] animate-spin animation-delay-150 mx-auto"></div>
              </div>
              <p className="text-[#475569] font-semibold text-lg">Cargando productos increíbles...</p>
            </div>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-[#e2e8f0]">
              <div className="w-20 h-20 bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#334155] mb-3">No hay productos disponibles</h3>
              <p className="text-[#64748b] leading-relaxed">Intenta ajustar tus filtros de búsqueda para encontrar lo que necesitas</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[#f1f5f9] hover:border-[#e2e8f0] transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Badge de descuento */}
                {product.discount_percentage > 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-[#ffff] px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                      {Math.round(((product.wholesale_price - product.wholesale_price_sale) / product.wholesale_price) * 100)}% OFF
                    </div>
                  </div>
                )}

                {/* Product Image */}
                <Link to={`/detalles_producto/${product.id}`} className="block relative overflow-hidden">
                  <div className="aspect-w-1 aspect-h-1 w-full">
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      className="w-full h-56 object-cover transition-all duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                {/* Product Info */}
                <div className="p-6 flex flex-col h-auto">
                  <Link to={`/detalles_producto/${product.id}`}>
                    <h3 className="text-xl font-bold text-[#1e293b] group-hover:text-[#2563eb] transition-colors duration-300 mb-3 line-clamp-2 leading-tight">
                      {product.product_name}
                    </h3>
                  </Link>

                  <p className="text-[#475569] text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                    {product.description}
                  </p>

                  {/* Pricing Section */}
                  <div className="mb-4">
                    <div className="space-y-1">
                      {product.discount_percentage > 0 ? (
                        <>
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl font-bold text-[#dc2626]">
                              ${new Intl.NumberFormat('es-CL').format(product.wholesale_price_sale)}
                            </span>
                            <span className="bg-[#ef4444] text-[#ffff] px-2 py-1 rounded-lg text-xs font-bold">
                              {Math.round(((product.wholesale_price - product.wholesale_price_sale) / product.wholesale_price) * 100)}% OFF
                            </span>
                          </div>
                          <span className="line-through text-[#94a3b8] text-lg">
                            ${new Intl.NumberFormat('es-CL').format(product.wholesale_price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-[#1e293b]">
                          ${new Intl.NumberFormat('es-CL').format(product.wholesale_price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock Info */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#475569]">Stock disponible</span>
                      <span className={`text-sm font-bold ${product.stock > 10 ? 'text-[#16a34a]' :
                        product.stock > 0 ? 'text-[#ca8a04]' : 'text-[#dc2626]'
                        }`}>
                        {product.stock} unidades
                      </span>
                    </div>
                    <div className="w-full bg-[#e2e8f0] rounded-md h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${product.stock > 10 ? 'bg-[#22c55e]' :
                          product.stock > 0 ? 'bg-[#eab308]' : 'bg-[#ef4444]'
                          }`}
                        style={{ width: `${Math.min((product.stock / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="space-y-3">
                    {/* Botón de detalles */}
                    <Link
                      to={`/detalles_producto/${product.id}`}
                      className="w-full bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0] hover:from-[#e2e8f0] hover:to-[#cbd5e1] text-[#334155] font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg border border-[#e2e8f0] hover:border-[#cbd5e1] flex items-center justify-center group"
                    >
                      <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver Detalles
                    </Link>

                    {/* Botón de agregar al carrito o login */}
                    {isLoggedIn ? (
                      <AddToCartButton
                        product={product}
                        className="w-full bg-brand-darBlue hover:from-[#1d4ed8]  text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      />
                    ) : (
                      <div className="text-center">
                        <p className="text-[#64748b] text-sm mb-3">
                          Inicia sesión para comprar
                        </p>
                        <Link
                          to="/users/login"
                          className="inline-block w-full bg-gradient-to-r from-[#475569] to-[#334155] hover:from-[#334155] hover:to-[#1e293b] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
                        >
                          Iniciar Sesión
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to action final */}
        {allProducts.length > 0 && (
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-[#eff6ff] to-[#faf5ff] rounded-3xl p-8 border border-[#dbeafe]">
              <h3 className="text-2xl font-bold text-[#1e293b] mb-4">
                ¿No encontraste lo que buscabas?
              </h3>
              
            
                <Link
                  to="/productos_destacados"
                  className="inline-flex items-center bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0] hover:from-[#e2e8f0] hover:to-[#cbd5e1] text-[#334155] font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Ver Destacados
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
