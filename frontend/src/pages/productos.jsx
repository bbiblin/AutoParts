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
      if (category != '' && brand == '') {
        url = `http://localhost:3000/productos?category_id=${category}`
      } else if (category == '' && brand != '') {
        url = `http://localhost:3000/productos?brand_id=${brand}`

      } else if (category != '' && brand != '') {
        url = `http://localhost:3000/productos?brand_id=${brand}&category_id=${category}`
      }
      else {
        url = "http://localhost:3000/productos"
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
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <CategoriesList valueCategory={category} valueBrand={brand} onChangeCategory={(e) => setCategory(e.target.value)}
            onChangeBrand={(e) => setBrand(e.target.value)} />
          <button type="submit">Buscar</button>
        </form>

      </div>
      <h2>Productos</h2>
      <div>
        {allProducts.length === 0 && <p>No hay productos para mostrar.</p>}
        {allProducts.map((product) => (
          <div key={product.id}>
            <h3>{product.product_name}</h3>
            <p>{product.description}</p>
            <img src={product.image_url} alt="Producto 1" style={{ maxWidth: '200px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
