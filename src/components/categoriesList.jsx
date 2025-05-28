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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Categoría */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 flex items-center">
          <svg className="w-4 h-4 mr-2 text-[#BB2F3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          Categoría
        </label>
        <select
          value={valueCategory}
          onChange={onChangeCategory}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BB2F3D] focus:border-[#BB2F3D] transition-all duration-200 bg-white hover:border-gray-300"
        >
          <option value="">Todas las categorías</option>
          {allCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.cate_name}
            </option>
          ))}
        </select>
      </div>

      {/* Marca */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 flex items-center">
          <svg className="w-4 h-4 mr-2 text-[#BB2F3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          Marca
        </label>
        <select
          value={valueBrand}
          onChange={onChangeBrand}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BB2F3D] focus:border-[#BB2F3D] transition-all duration-200 bg-white hover:border-gray-300"
        >
          <option value="">Todas las marcas</option>
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