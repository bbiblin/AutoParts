import { useEffect, useState } from 'react';
import axios from 'axios';
import CategoriesList from '../components/categoriesList';
import AddToCartButton from '../components/addToCartButton';
import { useAuth } from '../contexts/authContext';
import { Link } from "react-router-dom";



export default function catalogoMayorista() {
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
        url = `http://localhost:5374/productos?category_id=${category}`;
      } else if (!category && brand) {
        url = `http://localhost:5374/productos?brand_id=${brand}`;
      } else if (category && brand) {
        url = `http://localhost:5374/productos?brand_id=${brand}&category_id=${category}`;
      } else {
        url = "http://localhost:5374/productos";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Catálogo de Mayorista
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explora nuestros precios exclusivos para distribuidores
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#BB2F3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Filtros de Búsqueda
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6">
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
                className="bg-gradient-to-r from-[#BB2F3D] to-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Buscando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-[#BB2F3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              Productos Disponibles
            </h2>
            {allProducts.length > 0 && (
              <span className="bg-[#BB2F3D] text-white px-4 py-2 rounded-full text-sm font-medium">
                {allProducts.length} producto{allProducts.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <svg className="animate-spin w-12 h-12 text-[#BB2F3D] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 font-medium">Cargando productos...</p>
            </div>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No hay productos disponibles</h3>
            <p className="text-gray-400">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:scale-105"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.discount_price && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      ¡Oferta!
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#BB2F3D] transition-colors">
                    {product.product_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Pricing Section */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Precio Mayorista:</span>
                      <span className="text-green-600 font-bold text-lg">${product.wholesale_price}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Precio Minorista:</span>
                      <div className="text-right">
                        {product.discount_price ? (
                          <div className="space-y-1">
                            <span className="text-red-600 font-bold text-lg block">${product.discount_price}</span>
                            <span className="line-through text-gray-400 text-sm">${product.retail_price}</span>
                          </div>
                        ) : (
                          <span className="text-gray-900 font-bold text-lg">${product.retail_price}</span>
                        )}
                      </div>
                    </div>
                  </div>



                  {/* Stock Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Stock disponible:</span>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className={`font-semibold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {product.stock} unidades
                      </span>
                    </div>
                  </div>
                  {/* Botones */}
                  <div className="space-y-2">

                    {isLoggedIn ? (
                      <AddToCartButton
                        product={product}
                        className="w-full"
                      />
                    ) : (
                      <p>Debes iniciar sesión para armar tu carrito</p>
                    )}

                    <Link
                      to={`/detalles_producto/${product.id}`}
                      className="px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl"

                    >
                      Detalles
                    </Link>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}