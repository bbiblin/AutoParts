import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, X, Users, Shield, UserCheck, Phone, Mail, MapPin } from 'lucide-react';
import axios from 'axios';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://autoparts-i2gt.onrender.com/users');
      if (response) {
        setUsuarios(response.data.users);
        setFilteredUsuarios(response.data.users);
      } else {
        console.error('Error al obtener usuarios');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Filtrar usuarios
  useEffect(() => {
    let filtered = usuarios.filter(usuario =>
      usuario.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (roleFilter) {
      if (roleFilter === 'admin') {
        filtered = filtered.filter(usuario => usuario.admin === true);
      } else if (roleFilter === 'distributor') {
        filtered = filtered.filter(usuario => usuario.isDistribuitor === true);
      } else if (roleFilter === 'regular') {
        filtered = filtered.filter(usuario => !usuario.admin && !usuario.isDistribuitor);
      }
    }

    setFilteredUsuarios(filtered);
  }, [usuarios, searchTerm, roleFilter]);

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Confirmar eliminación
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Eliminar usuario
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://autoparts-i2gt.onrender.com/users/${userToDelete.id}`);

      if (response) {
        fetchUsuarios();
        setShowDeleteConfirm(false);
        setUserToDelete(null);
      } else {
        alert("No se pudo eliminar el usuario");
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error de conexión al eliminar el usuario');
    }
  };

  // Obtener rol del usuario
  const getUserRole = (user) => {
    if (user.admin) return { label: 'Administrador', color: 'bg-purple-100 text-purple-800' };
    if (user.isDistribuitor) return { label: 'Distribuidor', color: 'bg-blue-100 text-blue-800' };
    return { label: 'Usuario', color: 'bg-gray-100 text-gray-800' };
  };

  // Obtener icono de rol
  const getRoleIcon = (user) => {
    if (user.admin) return <Shield className="h-4 w-4" />;
    if (user.isDistribuitor) return <UserCheck className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p className="text-gray-600">Visualiza y administra los usuarios del sistema</p>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="distributor">Distribuidores</option>
              <option value="regular">Usuarios regulares</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              <span className="font-medium">{filteredUsuarios.length}</span>
              <span className="ml-1">usuarios encontrados</span>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-brand-darBlue text-xs text-[#b8b8b8] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsuarios.map((usuario) => {
                  const roleInfo = getUserRole(usuario);
                  return (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-sm bg-gray-200 flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {usuario.name || 'Sin nombre'}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{usuario.username}
                            </div>
                            <div className="text-xs text-gray-400">
                              ID: {usuario.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Mail className="h-3 w-3 text-gray-400 mr-2" />
                            <span className="truncate max-w-xs">{usuario.email}</span>
                          </div>
                          {usuario.phone && (
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 text-gray-400 mr-2" />
                              <span>{usuario.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-sm ${roleInfo.color}`}>
                          {getRoleIcon(usuario)}
                          <span className="ml-1">{roleInfo.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {usuario.address ? (
                            <div className="flex items-start">
                              <MapPin className="h-3 w-3 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="truncate" title={usuario.address}>
                                {usuario.address}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">Sin dirección</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openModal(usuario)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(usuario)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Eliminar"
                            disabled={usuario.admin}
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

        {filteredUsuarios.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>


      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-brand-darBlue bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#ffff] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalles del Usuario
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Información Personal</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {selectedUser.name || 'No especificado'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de usuario
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {selectedUser.username}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {selectedUser.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {selectedUser.phone || 'No especificado'}
                    </div>
                  </div>
                </div>


                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Información del Sistema</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID de usuario
                    </label>
                    <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {selectedUser.id}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol
                    </label>
                    <div className="flex items-center space-x-2">
                      {getUserRole(selectedUser).label === 'Administrador' && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-sm bg-purple-100 text-purple-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Administrador
                        </span>
                      )}
                      {getUserRole(selectedUser).label === 'Distribuidor' && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-sm bg-blue-100 text-blue-800">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Distribuidor
                        </span>
                      )}
                      {getUserRole(selectedUser).label === 'Usuario' && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-sm bg-gray-100 text-gray-800">
                          <Users className="h-3 w-3 mr-1" />
                          Usuario
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Permisos
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-sm mr-2 ${selectedUser.admin ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm text-gray-700">Administrador</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-sm mr-2 ${selectedUser.isDistribuitor ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm text-gray-700">Distribuidor</span>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {selectedUser.address || 'No especificada'}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-[#757575] transition-colors duration-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-brand-darBlue bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#ffff] rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-sm bg-[#d83535] mb-4">
                <Trash2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¿Eliminar usuario?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                ¿Estás seguro de que deseas eliminar al usuario "{userToDelete?.name || userToDelete?.username}"? Esta acción no se puede deshacer.
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
                  className="px-4 py-2 bg-brand-darBlue text-[#ffff] rounded-lg"
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