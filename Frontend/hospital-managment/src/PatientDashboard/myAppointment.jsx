import React, { useEffect, useState } from 'react';
import axiosInstance from '../Axios/index';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const token = sessionStorage.getItem("token");
  const userId = JSON.parse(atob(token.split('.')[1])).sub;

  const statusConfig = {
    Pending: {
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      icon: '⏳',
      bgGradient: 'from-orange-500 to-orange-600'
    },
    Canceled: {
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: '❌',
      bgGradient: 'from-red-500 to-red-600'
    },
    Approved: {
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: '✅',
      bgGradient: 'from-green-500 to-green-600'
    },
    Completed: {
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: '✅',
      bgGradient: 'from-blue-500 to-blue-600'
    }
  };

  useEffect(() => {
    if (!userId) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/appointments/user/${userId}`);
        setAppointments(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntilAppointment = (dateString, timeString) => {
    const appointmentDate = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    const diffTime = appointmentDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past appointment';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
    return `In ${Math.ceil(diffDays / 30)} months`;
  };

  const filteredAndSortedAppointments = appointments
    .filter(app => {
      const matchesStatus = filterStatus === 'all' || app.appointemntStatus === filterStatus;
      const matchesSearch = 
        app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.doctorSurname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.localDate.includes(searchTerm) ||
        app.localTime.includes(searchTerm);
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(`${b.localDate}T${b.localTime}`) - new Date(`${a.localDate}T${a.localTime}`);
      } else if (sortBy === 'oldest') {
        return new Date(`${a.localDate}T${a.localTime}`) - new Date(`${b.localDate}T${b.localTime}`);
      } else if (sortBy === 'doctor') {
        return `${a.doctorName} ${a.doctorSurname}`.localeCompare(`${b.doctorName} ${b.doctorSurname}`);
      }
      return 0;
    });

  const getStatusCounts = () => {
    const counts = { all: appointments.length };
    appointments.forEach(app => {
      counts[app.appointemntStatus] = (counts[app.appointemntStatus] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (!userId) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Authentication Required</h3>
          <p className="text-yellow-600">Please log in as a user to view your appointments.</p>
        </div>
      </div>
    );
  }

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
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Appointments</h3>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage and track your medical appointments</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
            <div className="text-center">
              <p className="text-blue-100 text-sm">Total</p>
              <p className="text-2xl font-bold">{statusCounts.all || 0}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
            <div className="text-center">
              <p className="text-orange-100 text-sm">Pending</p>
              <p className="text-2xl font-bold">{statusCounts.Pending || 0}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
            <div className="text-center">
              <p className="text-green-100 text-sm">Approved</p>
              <p className="text-2xl font-bold">{statusCounts.Approved || 0}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl">
            <div className="text-center">
              <p className="text-red-100 text-sm">Canceled</p>
              <p className="text-2xl font-bold">{statusCounts.Canceled || 0}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search appointments, doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
              </div>
            </div>
            <div className="lg:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
            <div className="lg:w-48">
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

      {/* Appointments Grid */}
      {filteredAndSortedAppointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No matching appointments found' : 'No appointments yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Your upcoming appointments will appear here'
            }
          </p>
          {(searchTerm || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedAppointments.map((appointment) => {
            const status = statusConfig[appointment.appointemntStatus] || statusConfig.Pending;
            const timeUntil = getTimeUntilAppointment(appointment.localDate, appointment.localTime);
            
            return (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedAppointment(appointment)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {appointment.doctorName.charAt(0)}{appointment.doctorSurname.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Dr. {appointment.doctorName} {appointment.doctorSurname}
                        </p>
                        <p className="text-sm text-gray-500">{timeUntil}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color} flex items-center space-x-1`}>
                      <span>{status.icon}</span>
                      <span>{appointment.appointemntStatus}</span>
                    </span>
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-lg">📅</span>
                      <div>
                        <p className="font-medium text-gray-900">{formatDate(appointment.localDate)}</p>
                        <p className="text-sm text-gray-500">{appointment.localDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span className="text-lg">⏰</span>
                      <div>
                        <p className="font-medium text-gray-900">{formatTime(appointment.localTime)}</p>
                        <p className="text-sm text-gray-500">Appointment time</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <div className="text-center">
                  <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border ${statusConfig[selectedAppointment.appointemntStatus]?.color || statusConfig.Pending.color}`}>
                    <span>{statusConfig[selectedAppointment.appointemntStatus]?.icon || '⏳'}</span>
                    <span>{selectedAppointment.appointemntStatus}</span>
                  </span>
                </div>

                {/* Doctor Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Attending Physician</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-semibold">
                        {selectedAppointment.doctorName.charAt(0)}{selectedAppointment.doctorSurname.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">
                        Dr. {selectedAppointment.doctorName} {selectedAppointment.doctorSurname}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">📅 Date</h3>
                    <p className="text-gray-700 font-medium">{formatDate(selectedAppointment.localDate)}</p>
                    <p className="text-sm text-gray-500">{selectedAppointment.localDate}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">⏰ Time</h3>
                    <p className="text-gray-700 font-medium">{formatTime(selectedAppointment.localTime)}</p>
                    <p className="text-sm text-gray-500">{getTimeUntilAppointment(selectedAppointment.localDate, selectedAppointment.localTime)}</p>
                  </div>
                </div>

                {/* Appointment ID */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Appointment ID</h3>
                  <p className="text-gray-700 font-mono">#{selectedAppointment.id}</p>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedAppointment(null)}
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

export default MyAppointments;

