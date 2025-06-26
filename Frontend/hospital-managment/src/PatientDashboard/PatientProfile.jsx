import React, { useEffect, useState } from 'react';
import axiosInstance from '../Axios/index';

const EditUserProfile = () => {
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const token = sessionStorage.getItem("token");
  const userId = JSON.parse(atob(token.split('.')[1])).sub;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8085/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUser(userData);
        setOriginalUser(userData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user data", err);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, token]);

  useEffect(() => {
    if (user && originalUser) {
      const changes = user.first_name !== originalUser.first_name || 
                    user.second_name !== originalUser.second_name;
      setHasChanges(changes);
    }
  }, [user, originalUser]);

  const validateForm = () => {
    const errors = {};
    
    if (!user.first_name || user.first_name.trim().length < 2) {
      errors.first_name = 'First name must be at least 2 characters long';
    }
    
    if (!user.second_name || user.second_name.trim().length < 2) {
      errors.second_name = 'Last name must be at least 2 characters long';
    }

    if (user.first_name && !/^[a-zA-Z\s]+$/.test(user.first_name)) {
      errors.first_name = 'First name should only contain letters';
    }

    if (user.second_name && !/^[a-zA-Z\s]+$/.test(user.second_name)) {
      errors.second_name = 'Last name should only contain letters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear success message when user makes changes
    if (success) {
      setSuccess(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      await axiosInstance.put(`/users/${userId}`, user, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      setOriginalUser(user);
      setSuccess(true);
      setHasChanges(false);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An error occurred while updating your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setUser(originalUser);
    setValidationErrors({});
    setHasChanges(false);
    setSuccess(false);
    setError(null);
  };

  const getInitials = () => {
    if (!user) return '';
    return `${user.first_name?.charAt(0) || ''}${user.second_name?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="animate-pulse">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
            <div className="space-y-6">
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
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

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {getInitials()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Profile</h1>
              <p className="text-blue-100">Update your personal information</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <p className="text-green-800 font-medium">Profile updated successfully!</p>
                <p className="text-green-600 text-sm">Your changes have been saved.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <div className="text-red-500 text-xl">❌</div>
              <div>
                <p className="text-red-800 font-medium">Update failed</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="first_name"
                  value={user.first_name || ''}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    validationErrors.first_name 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  👤
                </div>
              </div>
              {validationErrors.first_name && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{validationErrors.first_name}</span>
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="second_name"
                  value={user.second_name || ''}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    validationErrors.second_name 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  👤
                </div>
              </div>
              {validationErrors.second_name && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{validationErrors.second_name}</span>
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !hasChanges || Object.keys(validationErrors).length > 0}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  saving || !hasChanges || Object.keys(validationErrors).length > 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                }`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Save Changes</span>
                  </>
                )}
              </button>

              {hasChanges && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 sm:flex-none sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <span>↩️</span>
                  <span>Cancel</span>
                </button>
              )}
            </div>

            {/* Change Indicator */}
            {hasChanges && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center space-x-2">
                <span className="text-yellow-500">⚠️</span>
                <p className="text-yellow-800 text-sm">
                  You have unsaved changes. Don't forget to save your updates!
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Last updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditUserProfile;

