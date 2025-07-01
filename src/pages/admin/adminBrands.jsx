import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Save, Eye, Building } from 'lucide-react';
import axios from 'axios';

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    brand_name: '',
    brand_code: '',
    origin_country: '',
  });

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://autoparts-i2gt.onrender.com/brands');
      setBrands(res.data);
      setFilteredBrands(res.data);
    } catch (error) {
      console.error('Error al obtener marcas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    const filtered = brands.filter(b =>
      b.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.brand_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.origin_country?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
  }, [searchTerm, brands]);

  const openModal = (mode, brand = null) => {
    setModalMode(mode);
    setSelectedBrand(brand);
    setFormData(
      brand
        ? {
          brand_name: brand.brand_name || '',
          brand_code: brand.brand_code || '',
          origin_country: brand.origin_country || '',
        }
        : {
          brand_name: '',
          brand_code: '',
          origin_country: '',
        }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBrand(null);
    setFormData({
      brand_name: '',
      brand_code: '',
      origin_country: '',
    });
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.brand_name.trim() || !formData.brand_code.trim()) {
      alert('El nombre y código de la marca son obligatorios.');
      return;
    }

    setSaving(true);
    try {
      const data = {
        brand_name: formData.brand_name.trim(),
        brand_code: formData.brand_code.trim(),
        origin_country: formData.origin_country.trim(),
      };

      let response;
      if (modalMode === 'add') {
        response = await axios.post('https://autoparts-i2gt.onrender.com/brands', data);
      } else if (modalMode === 'edit') {
        response = await axios.patch(`https://autoparts-i2gt.onrender.com/brands/${selectedBrand.id}`, data);
      }

      if (response) {
        fetchBrands();
        closeModal();
      } else {
        alert('Error al guardar la marca.');
      }
    } catch (error) {
      console.error('Error al guardar marca:', error);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = brand => {
    setBrandToDelete(brand);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://autoparts-i2gt.onrender.com/brands/${brandToDelete.id}`);
      fetchBrands();
      setShowDeleteConfirm(false);
      setBrandToDelete(null);
    } catch (error) {
      console.error('Error al eliminar marca:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <Building className="h-10 w-10 mr-2 animate-pulse" />
        Cargando marcas...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow mb-4">
          <div className="flex items-center space-x-3">
            <Building className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold">Gestión de Marcas</h1>
              <p className="text-gray-500 text-sm">Administra las marcas de productos</p>
            </div>
          </div>
          <button
            onClick={() => openModal('add')}
            className="bg-brand-darBlue text-[#ffff] px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Marca
          </button>
        </div>

        {/* Filtro */}
        <div className="bg-[#ffff] p-4 rounded-lg shadow mb-4 flex items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, código o país..."
              className="pl-10 pr-4 py-2 border rounded w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-[#ffff] rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-brand-darBlue text-xs text-[#b8b8b8] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  País de origen
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Acciones
                </th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBrands.map(brand => (
                <tr key={brand.id} className="hover:bg-[#b8b8b8]">
                  <td className="px-6 py-4">{brand.id}</td>
                  <td className="px-6 py-4">{brand.brand_name}</td>
                  <td className="px-6 py-4">{brand.brand_code}</td>
                  <td className="px-6 py-4">{brand.origin_country || <span className="text-gray-400 italic">No especificado</span>}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal('view', brand)} className="text-brand-darBlue hover:text-[#c7c7c7]">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => openModal('edit', brand)} className="text-[#6ac549] hover:text-[#b3b3b3]">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => confirmDelete(brand)} className="text-[#c73737] hover:text-[#bbbbbb]">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-brand-darBlue bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-[#ffff] rounded-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {modalMode === 'add' ? 'Nueva Marca' : modalMode === 'edit' ? 'Editar Marca' : 'Detalles de la Marca'}
                </h2>
                <button onClick={closeModal}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                  placeholder="Nombre de la marca"
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  name="brand_code"
                  value={formData.brand_code}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                  placeholder="Código"
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  name="origin_country"
                  value={formData.origin_country}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                  placeholder="País de origen"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {modalMode !== 'view' && (
                <div className="flex justify-end gap-2 mt-6">
                  <button onClick={closeModal} className="bg-[#696969] px-4 py-2 rounded hover:[#b6b6b6]">
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-brand-darBlue text-[#ffff] px-4 py-2 rounded  flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 bg-brand-darBlue bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-[#ffff] rounded-lg w-full max-w-md p-6 text-center">
              <Trash2 className="mx-auto text-red-600 h-8 w-8 mb-2" />
              <h3 className="text-lg font-semibold mb-2">¿Eliminar esta marca?</h3>
              <p className="text-gray-600 mb-4">Esta acción no se puede deshacer.</p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-100 px-4 py-2 rounded hover:bg-[#5f5f5f]"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-brand-redDark text-[#ffff] px-4 py-2 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
