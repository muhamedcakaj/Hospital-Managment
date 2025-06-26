import React, { useState } from 'react';
import axiosInstance from '../Axios/index';

const CreateDiagnosis = () => {
  const [userEmail, setUserEmail] = useState('');
  const [diagnosisText, setDiagnosisText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [charCount, setCharCount] = useState(0);

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmail) {
      errors.userEmail = 'Patient email is required';
    } else if (!emailRegex.test(userEmail)) {
      errors.userEmail = 'Please enter a valid email address';
    }

    // Diagnosis validation
    if (!diagnosisText.trim()) {
      errors.diagnosisText = 'Diagnosis description is required';
    } else if (diagnosisText.trim().length < 10) {
      errors.diagnosisText = 'Diagnosis must be at least 10 characters long';
    } else if (diagnosisText.trim().length > 1000) {
      errors.diagnosisText = 'Diagnosis must not exceed 1000 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setUserEmail(value);
    
    // Clear validation error when user starts typing
    if (validationErrors.userEmail) {
      setValidationErrors(prev => ({ ...prev, userEmail: '' }));
    }
    
    // Clear success/error messages
    if (success) setSuccess(false);
    if (error) setError('');
  };

  const handleDiagnosisChange = (e) => {
    const value = e.target.value;
    setDiagnosisText(value);
    setCharCount(value.length);
    
    // Clear validation error when user starts typing
    if (validationErrors.diagnosisText) {
      setValidationErrors(prev => ({ ...prev, diagnosisText: '' }));
    }
    
    // Clear success/error messages
    if (success) setSuccess(false);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const token = sessionStorage.getItem('token');
    const [_, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    const doctorId = decoded.sub;

    const newDiagnosis = {
      doctorId,
      userEmail: userEmail.trim(),
      diagnosis: diagnosisText.trim(),
      date: new Date().toISOString(),
    };

    try {
      setLoading(true);
      setError('');
      
      await axiosInstance.post('/diagnosis/doctor', newDiagnosis, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      setSuccess(true);
      setUserEmail('');
      setDiagnosisText('');
      setCharCount(0);
      setValidationErrors({});
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (error) {
      console.error('Error creating diagnosis:', error);
      if (error.response?.status === 404) {
        setError('Patient not found. Please check the email address and try again.');
      } else if (error.response?.status === 400) {
        setError('Invalid diagnosis data. Please check your input and try again.');
      } else {
        setError('An error occurred while creating the diagnosis. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserEmail('');
    setDiagnosisText('');
    setCharCount(0);
    setValidationErrors({});
    setSuccess(false);
    setError('');
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Create New Diagnosis</h1>
              <p className="text-green-100">Document patient diagnosis and treatment recommendations</p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-green-100 text-sm">{getCurrentDate()}</p>
              <p className="text-green-200 text-sm">{getCurrentTime()}</p>
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
                <p className="text-green-800 font-medium">Diagnosis created successfully!</p>
                <p className="text-green-600 text-sm">The diagnosis has been saved and the patient will be notified.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <div className="text-red-500 text-xl">❌</div>
              <div>
                <p className="text-red-800 font-medium">Failed to create diagnosis</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Email Section */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <span className="mr-2">👤</span>
                Patient Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={userEmail}
                    onChange={handleEmailChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      validationErrors.userEmail 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    required
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    📧
                  </div>
                </div>
                {validationErrors.userEmail && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{validationErrors.userEmail}</span>
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter the patient's registered email address to link this diagnosis
                </p>
              </div>
            </div>

            {/* Diagnosis Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📝</span>
                Medical Diagnosis
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis Description *
                </label>
                <div className="relative">
                  <textarea
                    placeholder="Provide a detailed diagnosis including symptoms, findings, treatment recommendations, and any follow-up instructions..."
                    value={diagnosisText}
                    onChange={handleDiagnosisChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none ${
                      validationErrors.diagnosisText 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    rows="8"
                    maxLength="1000"
                    required
                  />
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div>
                    {validationErrors.diagnosisText && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <span>⚠️</span>
                        <span>{validationErrors.diagnosisText}</span>
                      </p>
                    )}
                  </div>
                  <p className={`text-xs ${charCount > 900 ? 'text-red-500' : 'text-gray-500'}`}>
                    {charCount}/1000 characters
                  </p>
                </div>
                
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm flex items-center">
                    <span className="mr-2">💡</span>
                    <strong>Tip:</strong> Include symptoms, examination findings, diagnosis, treatment plan, and follow-up instructions for a comprehensive diagnosis.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading || Object.keys(validationErrors).length > 0}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  loading || Object.keys(validationErrors).length > 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Diagnosis...</span>
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    <span>Create Diagnosis</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="flex-1 sm:flex-none sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <span>🔄</span>
                <span>Reset Form</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDiagnosis;

