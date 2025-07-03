import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Save, Eye, Tag } from 'lucide-react';
import axios from 'axios';


export default function AdminCategories() {
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    cate_name: '',
    cate_descr: ''
  });

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://autoparts-i2gt.onrender.com/categories');
      if (response) {

        setCategorias(response.data);
        setFilteredCategorias(response.data);
      } else {
        console.error('Error al obtener categorías');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    let filtered = categorias.filter(categoria =>
      categoria.cate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoria.cate_descr?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCategorias(filtered);
  }, [categorias, searchTerm]);

  const openModal = (mode, category = null) => {
    setModalMode(mode);
    setSelectedCategory(category);

    if (mode === 'add') {
      setFormData({
        cate_name: '',
        cate_descr: ''
      });
    } else if (category) {
      setFormData({
        cate_name: category.cate_name || '',
        cate_descr: category.cat_descr || ''
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setFormData({
      cate_name: '',
      cate_descr: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.cate_name.trim()) {
      alert('Por favor completa el nombre de la categoría');
      return;
    }

    setSaving(true);
    try {
      const categoryData = {
        cate_name: formData.cate_name.trim(),
        cat_descr: formData.cate_descr.trim()
      };

      let response;
      if (modalMode === 'add') {
        response = await axios.post('https://autoparts-i2gt.onrender.com/categories', categoryData);
      } else if (modalMode === 'edit') {
        response = await axios.patch(`https://autoparts-i2gt.onrender.com/categories/${selectedCategory.id}`, categoryData);
      }

      if (response) {
        fetchCategorias();
        closeModal();
      } else {
        alert("No se pudo guardar la categoría");
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error de conexión al guardar la categoría');
    } finally {
      setSaving(false);
    }
  };

  // Confirmar eliminación
  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  // Eliminar categoría
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://autoparts-i2gt.onrender.com/categories/${categoryToDelete.id}`);

      if (response) {
        fetchCategorias();
        setShowDeleteConfirm(false);
        setCategoryToDelete(null);
      } else {
        alert("No se pudo eliminar la categoría");
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error de conexión al eliminar la categoría');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Tag className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
                <p className="text-gray-600">Administra las categorías de productos</p>
              </div>
            </div>

            <button
              onClick={() => openModal('add')}
              className="bg-brand-darBlue text-[#ffff] px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Nueva Categoría</span>
            </button>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="text-sm text-gray-600 flex items-center">
              <span className="font-medium">{filteredCategorias.length}</span>
              <span className="ml-1">categorías encontradas</span>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-brand-darBlue text-[#b8b8b8] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategorias.map((categoria) => (
                  <tr key={categoria.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {categoria.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-sm bg-blue-100 flex items-center justify-center">
                            <Tag className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {categoria.cate_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {categoria.cat_descr ? (
                          <span className="truncate block" title={categoria.cat_descr}>
                            {categoria.cat_descr}
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">Sin descripción</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openModal('view', categoria)}
                          className="text-brand-darBlue h p-1 rounded "
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openModal('edit', categoria)}
                          className="text-[#44c730]  p-1 rounded"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(categoria)}
                          className="text-[#bc3333]  p-1 rounded"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCategorias.length === 0 && !loading && (
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron categorías</h3>
            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda o crea una nueva categoría</p>
          </div>
        )}
      </div>


      {showModal && (
        <div className="fixed inset-0 bg-brand-darBlue bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#ffff] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalMode === 'add' ? 'Nueva Categoría' :
                    modalMode === 'edit' ? 'Editar Categoría' : 'Detalles de la Categoría'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Categoría *
                  </label>
                  <input
                    type="text"
                    name="cate_name"
                    value={formData.cate_name}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="Nombre de la categoría"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="cate_descr"
                    value={formData.cate_descr}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-darBlue focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="Descripción de la categoría (opcional)"
                  />
                </div>
              </div>

              {modalMode !== 'view' && (
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    onClick={closeModal}
                    disabled={saving}
                    className="px-4 py-2 text-gray-700 bg-[#ffff] rounded-lg hover:bg-[#454545] transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-brand-darBlue text-[#ffff] rounded-lg hover:bg-[#adadad] transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? 'Guardando...' : 'Guardar'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-brand-darBlue bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#ffff] rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-sm bg-brand-redDark mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¿Eliminar categoría?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                ¿Estás seguro de que deseas eliminar la categoría "{categoryToDelete?.cate_name}"? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-[#5f5f5f] transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-brand-redDark text-[#ffff] rounded-lg hover:bg-[#7e7e7e] transition-colors duration-200"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}