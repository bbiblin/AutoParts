import { useEffect, useState } from 'react';
import axios from 'axios';
import CategoriesList from '../components/categoriesList';

export default function Productos() {
  const [allProducts, setAllProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');

  const getProducts = async () => {
    try {
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
    <div className="p-6 max-w-7xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
          <CategoriesList
            valueCategory={category}
            valueBrand={brand}
            onChangeCategory={(e) => setCategory(e.target.value)}
            onChangeBrand={(e) => setBrand(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#BB2F3D] text-white px-6 py-2 rounded-lg shadow hover:bg-shadow-lg transition"
          >
            Buscar
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-4">Productos</h2>

      {allProducts.length === 0 ? (
        <p className="text-gray-500">No hay productos para mostrar.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {allProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
            >
              <img
                src={product.image_url}
                alt={product.product_name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold">{product.product_name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>

              <div className="mb-2">
                <span className="text-gray-700 font-medium">Precio: </span>
                {product.discount_price ? (
                  <>
                    <span className="text-red-600 font-bold">${product.discount_price}</span>
                    <span className="line-through text-gray-500 ml-2">${product.price}</span>
                  </>
                ) : (
                  <span className="text-gray-900 font-bold">${product.price}</span>
                )}
              </div>

              <p className="text-sm text-gray-700">Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
