import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    
    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          errors.firstName = 'First name is required';
        } else if (value.length > 25) {
          errors.firstName = 'First name must be under 25 characters';
        } else if (value.length < 2) {
          errors.firstName = 'First name must be at least 2 characters';
        } else {
          delete errors.firstName;
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          errors.lastName = 'Last name is required';
        } else if (value.length > 25) {
          errors.lastName = 'Last name must be under 25 characters';
        } else if (value.length < 2) {
          errors.lastName = 'Last name must be at least 2 characters';
        } else {
          delete errors.lastName;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else if (value.length > 50) {
          errors.password = 'Password must be under 50 characters';
        } else {
          delete errors.password;
        }
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
    
    // Clear error message when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      validateField(key, formData[key]);
    });
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch("http://localhost:8085/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        sessionStorage.setItem('email', formData.email);
        navigate("/mfapage");
      } else {
        const errorText = await response.text();
        setError(errorText || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error("Error:", error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { strength, text: 'Weak', color: 'text-red-500' };
    if (strength <= 4) return { strength, text: 'Medium', color: 'text-yellow-500' };
    return { strength, text: 'Strong', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">🏥</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <div className="text-red-500 text-xl">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">Signup Failed</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-400 hover:text-red-600 ml-auto"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                      validationErrors.firstName 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400">
                    👤
                  </div>
                </div>
                {validationErrors.firstName && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.firstName}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">{formData.firstName.length}/25 characters</p>
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                      validationErrors.lastName 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-green-500'
                    }`}
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400">
                    👤
                  </div>
                </div>
                {validationErrors.lastName && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.lastName}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">{formData.lastName.length}/25 characters</p>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    validationErrors.email 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-green-500'
                  }`}
                />
                <div className="absolute left-4 top-3.5 text-gray-400">
                  📧
                </div>
              </div>
              {validationErrors.email && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    validationErrors.password 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-green-500'
                  }`}
                />
                <div className="absolute left-4 top-3.5 text-gray-400">
                  🔒
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
              )}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.strength <= 2 ? 'bg-red-500' :
                          passwordStrength.strength <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${passwordStrength.color}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading || Object.keys(validationErrors).length > 0}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                loading || Object.keys(validationErrors).length > 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-green-600 hover:text-green-500 font-medium transition-colors"
            >
              Sign in to your account
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 Online Hospital. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

