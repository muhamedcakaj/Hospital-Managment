import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../Axios';

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState({
    first_name: '',
    last_name: '',
    specialization: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [originalDoctor, setOriginalDoctor] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('token');
        const [_, payload] = token.split('.');
        const decoded = JSON.parse(atob(payload));
        const doctorId = decoded.sub;

        const response = await axios.get(`http://localhost:8085/doctors/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(response.data);
        setOriginalDoctor(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    
    switch (name) {
      case 'first_name':
        if (!value.trim()) {
          errors.first_name = 'First name is required';
        } else if (value.trim().length < 2) {
          errors.first_name = 'First name must be at least 2 characters';
        } else {
          delete errors.first_name;
        }
        break;
      case 'last_name':
        if (!value.trim()) {
          errors.last_name = 'Last name is required';
        } else if (value.trim().length < 2) {
          errors.last_name = 'Last name must be at least 2 characters';
        } else {
          delete errors.last_name;
        }
        break;
      case 'specialization':
        if (!value.trim()) {
          errors.specialization = 'Specialization is required';
        } else if (value.trim().length < 3) {
          errors.specialization = 'Specialization must be at least 3 characters';
        } else {
          delete errors.specialization;
        }
        break;
      case 'description':
        if (value.trim().length > 0 && value.trim().length < 10) {
          errors.description = 'Description must be at least 10 characters if provided';
        } else if (value.trim().length > 500) {
          errors.description = 'Description must not exceed 500 characters';
        } else {
          delete errors.description;
        }
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
    validateField(name, value);
    
    // Check if there are changes
    const hasChanges = JSON.stringify({ ...doctor, [name]: value }) !== JSON.stringify(originalDoctor);
    setHasChanges(hasChanges);
    
    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleCancel = () => {
    setDoctor(originalDoctor);
    setHasChanges(false);
    setValidationErrors({});
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    Object.keys(doctor).forEach(key => {
      validateField(key, doctor[key]);
    });
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const doctorId = JSON.parse(atob(sessionStorage.getItem("token").split(".")[1])).sub;

    try {
      setSaving(true);
      await axiosInstance.put(`/doctors/${doctorId}`, doctor, {
        headers: { 'Content-Type': 'application/json' },
      });
      setOriginalDoctor(doctor);
      setHasChanges(false);
      setSuccessMessage('Profile updated successfully!');
      setError(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError('An error occurred while updating your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !doctor.first_name) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Profile</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {doctor.first_name?.charAt(0)}{doctor.last_name?.charAt(0)}
              </span>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">Dr. {doctor.first_name} {doctor.last_name}</h1>
              <p className="text-green-100">{doctor.specialization || 'Medical Professional'}</p>
              <p className="text-green-100 text-sm">👨‍⚕️ Healthcare Provider</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Professional Information</h2>
            <p className="text-gray-600">Update your professional details and medical specialization</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <p className="text-green-800 font-medium">{successMessage}</p>
                <p className="text-green-600 text-sm">Your professional profile has been updated successfully.</p>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-green-400 hover:text-green-600 ml-auto"
              >
                ×
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <div className="text-red-500 text-xl">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">Update Failed</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 ml-auto"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">👤</span>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={doctor.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      validationErrors.first_name 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                    required
                  />
                  {validationErrors.first_name && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={doctor.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      validationErrors.last_name 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                    required
                  />
                  {validationErrors.last_name && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.last_name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🩺</span>
                Professional Details
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Medical Specialization *</label>
                  <input
                    type="text"
                    name="specialization"
                    value={doctor.specialization}
                    onChange={handleChange}
                    placeholder="e.g., Cardiology, Pediatrics, Internal Medicine"
                    className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      validationErrors.specialization 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                    required
                  />
                  {validationErrors.specialization && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.specialization}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Professional Description</label>
                  <textarea
                    name="description"
                    value={doctor.description}
                    onChange={handleChange}
                    placeholder="Write a brief professional description about your experience, expertise, and approach to patient care..."
                    className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                      validationErrors.description 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                    rows="5"
                  ></textarea>
                  {validationErrors.description && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.description}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    {doctor.description?.length || 0}/500 characters
                  </p>
                </div>
              </div>
            </div>
            {/* Unsaved Changes Warning */}
            {hasChanges && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3">
                <div className="text-yellow-500 text-xl">⚠️</div>
                <div className="flex-1">
                  <p className="text-yellow-800 font-medium">You have unsaved changes</p>
                  <p className="text-yellow-600 text-sm">Don't forget to save your updates before leaving this page.</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving || Object.keys(validationErrors).length > 0 || !hasChanges}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  saving || Object.keys(validationErrors).length > 0 || !hasChanges
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
                }`}
              >
                {saving ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving Changes...</span>
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
              
              {hasChanges && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;

