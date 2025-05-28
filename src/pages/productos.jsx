import { useEffect, useState } from 'react';
import axios from 'axios';
import CategoriesList from '../components/categoriesList';
import AddToCartButton from '../components/addToCartButton';

export default function Productos() {
  const [allProducts, setAllProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* ... [Encabezado y filtros igual] ... */}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ... [Sección de filtros] ... */}

        {/* Resultados */}
        {loading ? (
          <div className="flex justify-center items-center py-16">Cargando...</div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-16">
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
                {/* Imagen */}
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

                {/* Información */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#BB2F3D] transition-colors">
                    {product.product_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Precios */}
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

                  {/* Stock */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
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
                    <AddToCartButton
                      product={product}
                      className="w-full"
                    />
                    <button className="w-full px-4 py-2 border border-[#1F3A93] text-[#1F3A93] rounded-lg hover:bg-[#1F3A93] hover:text-white transition-colors duration-300">
                      Ver detalles
                    </button>
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