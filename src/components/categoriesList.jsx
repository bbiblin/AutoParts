// src/components/CategoriesList.jsx
import React from 'react';

export default function CategoriesList({ value, onChange }) {
  return (
    <div className="categories-list">
      <select value={value} onChange={onChange}>
        <option value="">-- Selecciona una categoría --</option>
        <option value="4">Filtros de aceite</option>
        <option value="5">Filtros de aire</option>
        <option value="6">Bujías</option>
        <option value="7">Correas de distribución</option>
        <option value="8">Pastillas de freno</option>
        <option value="9">Discos de freno</option>
        <option value="10">Amortiguadores</option>
        <option value="11">Rótulas</option>
        <option value="12">Alternadores</option>
        <option value="13">Baterías</option>
        <option value="14">Luces y faros</option>
        <option value="15">Sensores y fusibles</option>
        <option value="16">Alarmas</option>
      </select>
    </div>
  );
}

