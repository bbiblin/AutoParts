// src/components/CategoriesList.jsx

import { React, useEffect, useState } from 'react';
import axios from 'axios';



export default function CategoriesList({ valueCategory, valueBrand, onChangeCategory, onChangeBrand }) {
  const [allCategories, setAllCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);

  const getBrands = async () => {
    try {
      const res = await axios.get("https://autoparts-i2gt.onrender.com/brands");
      setAllBrands(res.data);
    } catch (error) {
      console.error('Error al obtener marcas:', error);

    }
  }

  const getCategories = async () => {
    try {
      const res = await axios.get("https://autoparts-i2gt.onrender.com/categories"); // Pon el puerto correcto

      setAllCategories(res.data);  // Aquí va res.data, no res.data.allProducts
    } catch (error) {
      console.error('Error al obtener categorias:', error);
    }
  };

  useEffect(() => {
    getCategories();
    getBrands();
  }, []);

  //1er div: filtro categorias
  //2do div: filtro marcas
  return (
    <div>
      <div className="categories-list">
        <select value={valueCategory} onChange={onChangeCategory}>
          <option value="">-- Selecciona una categoría --</option>
          {allCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.cate_name}
            </option>
          ))}
        </select>
      </div>
      <div className="brand-list">
        <select value={valueBrand} onChange={onChangeBrand}>
          <option value="">-- Selecciona una marca --</option>
          {allBrands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.brand_name}
            </option>
          ))}
        </select>

      </div>
    </div>
  );
}

