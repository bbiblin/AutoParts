import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Productos() {
  const [allProducts, setAllProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:4000/productos"); // Pon el puerto correcto
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
            {/* Puedes agregar más campos si quieres */}
          </div>
        ))}
      </div>
    </div>
  );
}
