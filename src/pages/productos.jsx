import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Productos() {
  const [allProducts, setAllProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/productos"); // Pon el puerto correcto
      setAllProducts(res.data);  // Aquí va res.data, no res.data.allProducts
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
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
