import React, { useState, useEffect } from 'react';
import axiosInstance from '../Axios/index';

const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        surname: '',
        specialization: ''
    });

    // Fetch all doctors
    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/admin/doctors/read');
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    // Create doctor
    const createDoctor = async (doctorData) => {
        try {
            await axiosInstance.post('/admin/doctors', doctorData);
            fetchDoctors();
            setShowCreateModal(false);
            resetForm();
        } catch (error) {
            console.error('Error creating doctor:', error);
        }
    };

    // Update doctor
    const updateDoctor = async (doctorData) => {
        try {
            await axiosInstance.post('/admin/doctors/update', doctorData);
            fetchDoctors();
            setShowEditModal(false);
            resetForm();
        } catch (error) {
            console.error('Error updating doctor:', error);
        }
    };

    // Delete doctor
    const deleteDoctor = async (doctorId) => {
        try {
            await axiosInstance.delete(`/admin/doctor/${doctorId}`);
            fetchDoctors();
            setShowDeleteModal(false);
            setSelectedDoctor(null);
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            specialization: ''
        });
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createDoctor(formData);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        updateDoctor({ ...formData, id: selectedDoctor.id });
    };

    const openEditModal = (doctor) => {
        setSelectedDoctor(doctor);
        setFormData({
            email: doctor.email,
            firstName: doctor.first_name,
            lastName: doctor.last_name,
            specialization: doctor.specialization,
            description:doctor.description
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (doctor) => {
        setSelectedDoctor(doctor);
        setShowDeleteModal(true);
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
                    <p className="text-gray-600">Manage healthcare professionals</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                    ➕ Add New Doctor
                </button>
            </div>

            {/* Doctors Table */}
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
                                    Specialization
                                </th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {doctors.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {doctor.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-green-600 font-semibold">
                                                    {doctor.first_name?.charAt(0)}{doctor.last_name?.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    Dr. {doctor.first_name} {doctor.last_name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {doctor.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            {doctor.specialization}
                                        </span>
                                    </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            {doctor.description}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => openEditModal(doctor)}
                                            className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded transition-colors duration-200"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(doctor)}
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
                {doctors.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No doctors found. Create your first doctor to get started.
                    </div>
                )}
            </div>

            {/* Create Doctor Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Create New Doctor
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Specialization
                                </label>
                                <select
                                    required
                                    value={formData.specialization}
                                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select Specialization</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="Emergency Medicine">Emergency Medicine</option>
                                    <option value="Family Medicine">Family Medicine</option>
                                    <option value="Internal Medicine">Internal Medicine</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Oncology">Oncology</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Psychiatry">Psychiatry</option>
                                    <option value="Radiology">Radiology</option>
                                    <option value="Surgery">Surgery</option>
                                </select>
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
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                >
                                    Create Doctor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Doctor Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Edit Doctor
                        </h3>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                               <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Specialization
                                </label>
                                <select
                                    required
                                    value={formData.specialization}
                                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Select Specialization</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="Emergency Medicine">Emergency Medicine</option>
                                    <option value="Family Medicine">Family Medicine</option>
                                    <option value="Internal Medicine">Internal Medicine</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Oncology">Oncology</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Psychiatry">Psychiatry</option>
                                    <option value="Radiology">Radiology</option>
                                    <option value="Surgery">Surgery</option>
                                </select>
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
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                >
                                    Update Doctor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Confirm Delete
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete Dr. "{selectedDoctor.first_name} {selectedDoctor.last_name}"? 
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedDoctor(null);
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteDoctor(selectedDoctor.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                            >
                                Delete Doctor
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default DoctorManagement;