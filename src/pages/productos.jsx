import { useEffect, useState } from 'react';
import axios from 'axios';
import CategoriesList from '../components/categoriesList';

export default function Productos() {
  const [allProducts, setAllProducts] = useState([]);
  const [category, setCategory] = useState('');

  const getProducts = async () => {
    try {
      let url = '';
      if (category != ''){
        url = `http://localhost:3000/productos?category_id=${category}`
      }
      else {
        url = "http://localhost:3000/productos"
      }
      const res = await axios.get(url); // Pon el puerto correcto
      setAllProducts(res.data);  // Aquí va res.data, no res.data.allProducts
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
          <CategoriesList  value={category} onChange={(e) => setCategory(e.target.value)}/>
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
