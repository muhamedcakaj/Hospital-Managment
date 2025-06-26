import React, { useEffect, useState } from 'react';
import axiosInstance from '../Axios/index';

const UserDiagnoses = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  const token = sessionStorage.getItem("token");
  const userId = JSON.parse(atob(token.split('.')[1])).sub;

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/diagnosis/user/${userId}`);
        setDiagnoses(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch diagnoses:", err);
        setError("Failed to load diagnoses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnoses();
  }, [userId]);

  const formatDateAndTime = (datetime) => {
    const dateObj = new Date(datetime);
    const date = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const time = dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { date, time };
  };

  const getTimeAgo = (datetime) => {
    const now = new Date();
    const diagnosisDate = new Date(datetime);
    const diffTime = Math.abs(now - diagnosisDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const filteredAndSortedDiagnoses = diagnoses
    .filter(d => 
      d.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.doctorSurname.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.diagnosis_date) - new Date(a.diagnosis_date);
      } else if (sortBy === 'oldest') {
        return new Date(a.diagnosis_date) - new Date(b.diagnosis_date);
      } else if (sortBy === 'doctor') {
        return `${a.doctorName} ${a.doctorSurname}`.localeCompare(`${b.doctorName} ${b.doctorSurname}`);
      }
      return 0;
    });

  const getDiagnosisSeverity = (diagnosis) => {
    const severityKeywords = {
      high: ['severe', 'critical', 'urgent', 'emergency', 'acute'],
      medium: ['moderate', 'chronic', 'persistent'],
      low: ['mild', 'minor', 'slight']
    };
    
    const diagnosisLower = diagnosis.toLowerCase();
    if (severityKeywords.high.some(keyword => diagnosisLower.includes(keyword))) {
      return { level: 'high', color: 'bg-red-100 text-red-800 border-red-200' };
    }
    if (severityKeywords.medium.some(keyword => diagnosisLower.includes(keyword))) {
      return { level: 'medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    }
    if (severityKeywords.low.some(keyword => diagnosisLower.includes(keyword))) {
      return { level: 'low', color: 'bg-green-100 text-green-800 border-green-200' };
    }
    return { level: 'normal', color: 'bg-blue-100 text-blue-800 border-blue-200' };
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Diagnoses</h3>
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Medical Diagnoses</h1>
          <p className="text-gray-600">Track and review your medical history</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Diagnoses</p>
                <p className="text-2xl font-bold">{diagnoses.length}</p>
              </div>
              <div className="text-3xl opacity-80">📋</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Recent (30 days)</p>
                <p className="text-2xl font-bold">
                  {diagnoses.filter(d => {
                    const diagnosisDate = new Date(d.diagnosis_date);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return diagnosisDate >= thirtyDaysAgo;
                  }).length}
                </p>
              </div>
              <div className="text-3xl opacity-80">📅</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Doctors Consulted</p>
                <p className="text-2xl font-bold">
                  {new Set(diagnoses.map(d => `${d.doctorName} ${d.doctorSurname}`)).size}
                </p>
              </div>
              <div className="text-3xl opacity-80">👨‍⚕️</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search diagnoses, doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="doctor">By Doctor</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnoses Grid */}
      {filteredAndSortedDiagnoses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏥</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'No matching diagnoses found' : 'No diagnoses yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Your medical diagnoses will appear here after your appointments'
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDiagnoses.map((diagnosis, index) => {
            const { date, time } = formatDateAndTime(diagnosis.diagnosis_date);
            const timeAgo = getTimeAgo(diagnosis.diagnosis_date);
            const severity = getDiagnosisSeverity(diagnosis.diagnosis);
            
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedDiagnosis(diagnosis)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {diagnosis.doctorName.charAt(0)}{diagnosis.doctorSurname.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Dr. {diagnosis.doctorName} {diagnosis.doctorSurname}
                        </p>
                        <p className="text-sm text-gray-500">{timeAgo}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${severity.color}`}>
                      {severity.level}
                    </span>
                  </div>

                  {/* Diagnosis Content */}
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Diagnosis</h3>
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      {diagnosis.diagnosis}
                    </p>
                  </div>

                  {/* Date and Time */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <span>📅</span>
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>⏰</span>
                      <span>{time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedDiagnosis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Diagnosis Details</h2>
                <button
                  onClick={() => setSelectedDiagnosis(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Doctor Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Attending Physician</h3>
                  <p className="text-blue-800">
                    Dr. {selectedDiagnosis.doctorName} {selectedDiagnosis.doctorSurname}
                  </p>
                </div>

                {/* Diagnosis */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Diagnosis</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedDiagnosis.diagnosis}
                  </p>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Date</h3>
                    <p className="text-gray-700">
                      {formatDateAndTime(selectedDiagnosis.diagnosis_date).date}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Time</h3>
                    <p className="text-gray-700">
                      {formatDateAndTime(selectedDiagnosis.diagnosis_date).time}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedDiagnosis(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDiagnoses;

