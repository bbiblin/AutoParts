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
  };

  const getCategories = async () => {
    try {
      const res = await axios.get("https://autoparts-i2gt.onrender.com/categories");
      setAllCategories(res.data);
    } catch (error) {
      console.error('Error al obtener categorias:', error);
    }
  };

  useEffect(() => {
    getCategories();
    getBrands();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-64">
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <select
          value={valueCategory}
          onChange={onChangeCategory}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Selecciona una categoría --</option>
          {allCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.cate_name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-64">
        <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
        <select
          value={valueBrand}
          onChange={onChangeBrand}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
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
