import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Save, Eye, Package, Percent } from 'lucide-react';
import axios from 'axios';

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);


  const [formData, setFormData] = useState({
    product_cod: '',
    product_name: '',
    description: '',
    retail_price: '',
    image_url: '',
    wholesale_price: '',
    stock: '',
    discount_percentage: '',
    isActive: true,
    featured: false,
    category_id: '',
    brand_id: ''
  });

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://autoparts-i2gt.onrender.com/productos', {
        params: { admin: true }
      });
      if (response) {
        setProductos(response.data);
        setFilteredProductos(response.data);
      } else {
        console.error('Error al obtener productos');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Filtrar productos
  useEffect(() => {
    let filtered = productos.filter(producto =>
      producto.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (categoryFilter) {
      filtered = filtered.filter(producto => producto.category_id?.toString() === categoryFilter);
    }

    setFilteredProductos(filtered);
  }, [productos, searchTerm, categoryFilter]);

  useEffect(() => {
    const fetchCategoriasYMarcas = async () => {
      try {
        const [resCategorias, resMarcas] = await Promise.all([
          axios.get('https://autoparts-i2gt.onrender.com/categories'),
          axios.get('https://autoparts-i2gt.onrender.com/brands')
        ]);
        setCategorias(resCategorias.data || []);
        setMarcas(resMarcas.data || []);
      } catch (error) {
        console.error('Error al cargar categorías o marcas:', error);
      }
    };
    fetchCategoriasYMarcas();
  }, []);


  // Abrir modal
  const openModal = (mode, product = null) => {
    setModalMode(mode);
    setSelectedProduct(product);

    if (mode === 'add') {
      setFormData({
        product_cod: '',
        product_name: '',
        description: '',
        retail_price: '',
        image_url: '',
        wholesale_price: '',
        stock: '',
        discount_percentage: '',
        isActive: true,
        featured: false,
        category_id: '',
        brand_id: ''
      });
    } else if (product) {
      setFormData({
        product_cod: product.product_cod || '',
        product_name: product.product_name || '',
        image_url: product.image_url,
        description: product.description || '',
        retail_price: product.retail_price?.toString() || '',
        wholesale_price: product.wholesale_price?.toString() || '',
        stock: product.stock?.toString() || '',
        discount_percentage: product.discount_percentage?.toString() || '',
        isActive: product.isActive ?? true,
        featured: product.featured ?? false,
        category_id: product.category_id?.toString() || '',
        brand_id: product.brand_id?.toString() || ''
      });
    }

    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setFormData({
      product_cod: '',
      product_name: '',
      description: '',
      retail_price: '',
      image_url: '',
      wholesale_price: '',
      stock: '',
      discount_percentage: '',
      isActive: true,
      featured: false,
      category_id: '',
      brand_id: ''
    });
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imagen: file
      }));
    }
  };

  // Guardar producto
  // Función handleSave mejorada con mejor manejo de errores
  const handleSave = async () => {

    if (!formData.product_name || !formData.retail_price || !formData.wholesale_price || !formData.stock) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();

      // Agregar todos los campos
      data.append('product_cod', formData.product_cod);
      data.append('product_name', formData.product_name);
      data.append('description', formData.description);
      data.append('retail_price', formData.retail_price);
      data.append('wholesale_price', formData.wholesale_price);
      data.append('stock', formData.stock);
      data.append('discount_percentage', formData.discount_percentage || '0');
      data.append('isActive', formData.isActive);
      data.append('featured', formData.featured);
      data.append('category_id', formData.category_id || '');
      data.append('brand_id', formData.brand_id || '');

      if (formData.imagen) {
        data.append('imagen', formData.imagen);
      }

      // Configuración de axios mejorada
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000, // 30 segundos
        withCredentials: false
      };

      let response;
      if (modalMode === 'add') {
        console.log('Enviando datos:', Object.fromEntries(data.entries()));
        response = await axios.post('https://autoparts-i2gt.onrender.com/productos', data, config);
      } else if (modalMode === 'edit') {
        response = await axios.patch(`https://autoparts-i2gt.onrender.com/productos/${selectedProduct.id}`, data, config);
      }

      console.log('Respuesta del servidor:', response);

      if (response && response.status >= 200 && response.status < 300) {
        await fetchProductos();
        closeModal();
        alert('Producto guardado exitosamente');
      } else {
        console.error('Respuesta inesperada:', response);
        alert("No se pudo guardar el producto");
      }
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Error response:', error.response);
      console.error('Error request:', error.request);
      console.error('Error config:', error.config);

      // Manejo de errores más específico
      if (error.code === 'ERR_NETWORK') {
        alert('Error de conexión: No se puede conectar con el servidor. Verifica tu conexión a internet.');
      } else if (error.response) {
        // El servidor respondió con un código de error
        alert(`Error del servidor (${error.response.status}): ${error.response.data?.error || error.response.statusText}`);
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        alert('No se recibió respuesta del servidor. Verifica que el servidor esté funcionando.');
      } else {
        // Algo más salió mal
        alert(`Error inesperado: ${error.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  // Confirmar eliminación
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  // Eliminar producto
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://autoparts-i2gt.onrender.com/productos/${productToDelete.id}`);

      if (response) {
        fetchProductos();
        setShowDeleteConfirm(false);
        setProductToDelete(null);
      } else {
        alert("No se pudo eliminar el producto");
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error de conexión al eliminar el producto');
    }
  };

  // Aplicar descuento a un producto
  const applyDiscount = async (productId) => {
    try {
      const response = await axios.patch(`https://autoparts-i2gt.onrender.com/productos/${productId}/descuento`);

      if (response) {
        fetchProductos();
        alert('Descuento aplicado correctamente');
      } else {
        const error = response;
        alert('No se pudo aplicar el descuento');
      }
    } catch (error) {
      console.error('Error al aplicar descuento:', error);
      alert('Error de conexión al aplicar descuento');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const getPriceToShow = (producto) => {
    if (producto.discount_percentage > 0) {
      return {
        original: formatPrice(producto.retail_price),
        sale: formatPrice(producto.retail_price_sale),
        wholesale: formatPrice(producto.wholesale_price),
        wholesale_sale: formatPrice(producto.wholesale_price_sale),
        hasDiscount: true
      };
    }
    return {
      original: formatPrice(producto.retail_price),
      wholesale: formatPrice(producto.wholesale_price),
      hasDiscount: false
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
                <p className="text-gray-600">Administra el catálogo de productos</p>
              </div>
            </div>

            <button
              onClick={() => openModal('add')}
              className="bg-brand-darBlue text-[#ffff] px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Nuevo Producto</span>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <input
              type="number"
              placeholder="Filtrar por categoría ID"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <div className="text-sm text-gray-600 flex items-center">
              <span className="font-medium">{filteredProductos.length}</span>
              <span className="ml-1">Productos encontrados</span>
            </div>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-brand-darBlue text-xs text-[#b8b8b8] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precios
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descuento
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProductos.map((producto) => {
                  const priceInfo = getPriceToShow(producto);
                  return (
                    <tr key={producto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {producto.product_name}
                            </div>
                            <div className="text-sm text-gray-500">ID: {producto.id}</div>
                            {producto.featured && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Destacado
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="flex items-center space-x-2">
                            {priceInfo.hasDiscount ? (
                              <>
                                <span className="line-through text-gray-500">{priceInfo.original}</span>
                                <span className="font-semibold text-green-600">{priceInfo.sale}</span>
                              </>
                            ) : (
                              <span className="font-semibold text-gray-900">{priceInfo.original}</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {priceInfo.hasDiscount ? (
                              <>
                                Mayorista: <span className="line-through text-gray-500">{priceInfo.wholesale}</span> |
                                <span className="font-semibold text-green-600">{priceInfo.wholesale_sale}</span>
                              </>
                            ) : (
                              <span className="font-semibold text-gray-500">Mayorista: {priceInfo.wholesale}</span>
                            )}

                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${producto.stock > 10
                          ? 'bg-green-100 text-green-800'
                          : producto.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {producto.stock} unidades
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${producto.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {producto.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {producto.discount_percentage > 0 ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              {producto.discount_percentage}% OFF
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">Sin descuento</span>
                          )}
                          {producto.discount_percentage > 0 && (
                            <button
                              onClick={() => applyDiscount(producto.id)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Aplicar descuento"
                            >
                              <Percent className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openModal('view', producto)}
                            className="text-[#111a52]  p-1 rounded "
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openModal('edit', producto)}
                            className="text-[#65cf48] p-1 rounded "
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(producto)}
                            className="text-[#d21e1e] rounded "
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProductos.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-brand-darBlue bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#ffff] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalMode === 'add' ? 'Nuevo Producto' :
                    modalMode === 'edit' ? 'Editar Producto' : 'Detalles del Producto'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="Nombre del producto"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código del producto
                  </label>
                  <input
                    type="text"
                    name="product_cod"
                    value={formData.product_cod}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="Código del producto"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen
                  </label>
                  <input
                    type="file"
                    name="imagen"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="Enlace"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="Descripción del producto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Retail *
                  </label>
                  <input
                    type="number"
                    name="retail_price"
                    min={100}
                    value={formData.retail_price}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Mayorista *
                  </label>
                  <input
                    type="number"
                    name="wholesale_price"
                    min={100}
                    value={formData.wholesale_price}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min={0}
                    value={formData.stock}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descuento (%)
                  </label>
                  <input
                    type="number"
                    name="discount_percentage"
                    value={formData.discount_percentage}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.cate_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marca
                  </label>
                  <select
                    name="brand_id"
                    value={formData.brand_id}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="">Selecciona una marca</option>
                    {marcas.map(brand => (
                      <option key={brand.id} value={brand.id}>
                        {brand.brand_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Producto activo</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Producto destacado</span>
                    </label>
                  </div>
                </div>
              </div>

              {modalMode !== 'view' && (
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    onClick={closeModal}
                    disabled={saving}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-brand-darBlue text-[#ffff] rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
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

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-brand-darBlue bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#ffff] rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¿Eliminar producto?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                ¿Estás seguro de que deseas eliminar "{productToDelete?.product_name}"? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:hover:bg-[#5f5f5f] transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-brand-redDark text-[#ffff] rounded-lg transition-colors duration-200"
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