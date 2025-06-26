import React, { useState, useEffect } from 'react';
import axiosInstance from '../Axios/index';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      emailConfirmation: 1,
     });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/admin/users/read');
            setUsers(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (userData) => {
        try {
         await axiosInstance.post('/admin/users', {
           email: userData.email,
           password: userData.password,
           firstName: userData.firstName,
           lastName: userData.lastName
        });
            fetchUsers();
            setShowCreateModal(false);
            resetForm();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const updateUser = async (userData) => {
        try {
            await axiosInstance.post('/admin/users/update', userData);
            fetchUsers();
            setShowEditModal(false);
            resetForm();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };
    
    const deleteUser = async (userId) => {
        try {
            await axiosInstance.delete(`/admin/user/${userId}`);
            fetchUsers();
            setShowDeleteModal(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            firstName: '',
            lastName: ''
        });
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createUser(formData);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        updateUser({ ...formData, id: selectedUser.id });
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            firstName: user.first_name,
            lastName: user.second_name
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600">Manage system users</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    ➕ Add New User
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Confirmation Code
                                </th>
                                
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.first_name} {user.second_name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.email}
                                    </td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.role}
                                    </td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.confirmationCode}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded transition-colors duration-200"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(user)}
                                            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors duration-200"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No users found. Create your first user to get started.
                    </div>
                )}
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Create New User
                        </h3>
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Edit User
                        </h3>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Update User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Confirm Delete
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete user "{selectedUser.first_name} {selectedUser.second_name}"? 
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedUser(null);
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteUser(selectedUser.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;