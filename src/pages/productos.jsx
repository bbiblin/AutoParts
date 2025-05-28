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
        url = 'https://autoparts-i2gt.onrender.com/productos';
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
    <div className="px-6 py-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8">Catálogo de Productos</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-center gap-4 mb-8 justify-center"
      >
        <CategoriesList
          valueCategory={category}
          valueBrand={brand}
          onChangeCategory={(e) => setCategory(e.target.value)}
          onChangeBrand={(e) => setBrand(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Buscar
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {allProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No hay productos para mostrar.
          </p>
        ) : (
          allProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
            >
              <img
                src={product.image_url}
                alt={product.product_name}
                className="w-full h-48 object-contain mb-4"
              />
              <h3 className="text-lg font-semibold">{product.product_name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              {/* Puedes agregar precio o botón "Ver más" aquí */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
