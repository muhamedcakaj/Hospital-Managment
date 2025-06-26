import React, { useEffect, useState } from 'react';
import axiosInstance from '../Axios/index';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // --- Constants and Utility Functions (formerly in appointmentUtils.js) ---
  const statusColors = {
    Pending: 'bg-orange-100 text-orange-700 border border-orange-300',
    Canceled: 'bg-red-100 text-red-700 border border-red-300',
    Approved: 'bg-green-100 text-green-700 border border-green-300',
  };

  const statusIcons = {
    Pending: '⏳',
    Canceled: '❌',
    Approved: '✅',
  };

  const statusOptions = ['Pending', 'Canceled', 'Approved'];

  const getAppointmentStats = (apps) => {
    const pending = apps.filter(app => app.appointemntStatus === 'Pending').length;
    const approved = apps.filter(app => app.appointemntStatus === 'Approved').length;
    const canceled = apps.filter(app => app.appointemntStatus === 'Canceled').length;
    return { pending, approved, canceled, total: apps.length };
  };

  const formatDateAndTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    const formattedTime = dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { formattedDate, formattedTime };
  };

  const getTimeUntilAppointment = (date, time) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diffTime = appointmentDateTime - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return `In ${Math.ceil(diffDays / 7)} weeks`;
  };
  // --- End Constants and Utility Functions ---

  const doctorId = JSON.parse(atob(sessionStorage.getItem("token").split('.')[1])).sub;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/appointments/doctor/${doctorId}`);
        setAppointments(response.data);
        setError(null);
      } catch (error) {
        console.error("Error loading appointments:", error);
        setError("Failed to load appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [doctorId]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setUpdatingStatus(appointmentId);
      await axiosInstance.put(`/appointments/doctors/${appointmentId}/status`, {
        status: newStatus,
      });
      setAppointments(prev =>
        prev.map(app =>
          app.id === appointmentId ? { ...app, appointemntStatus: newStatus } : app
        )
      );
      // Add toast notification here if desired
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update appointment status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredAndSortedAppointments = appointments
    .filter(app => {
      const matchesSearch =
        app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.userSurname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.localDate.includes(searchTerm) ||
        app.localTime.includes(searchTerm);
      
      const matchesFilter = filterStatus === 'all' || app.appointemntStatus === filterStatus;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(`${b.localDate}T${b.localTime}`) - new Date(`${a.localDate}T${a.localTime}`);
      } else if (sortBy === 'oldest') {
        return new Date(`${a.localDate}T${a.localTime}`) - new Date(`${b.localDate}T${b.localTime}`);
      } else if (sortBy === 'patient') {
        return `${a.userName} ${a.userSurname}`.localeCompare(`${b.userName} ${b.userSurname}`);
      }
      return 0;
    });

  const stats = getAppointmentStats(appointments);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p className="text-lg text-gray-700">Loading appointments...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Patient Appointments</h1>
          <p className="text-gray-600">Manage and update your patient appointment schedule</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="text-3xl opacity-80">📅</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <div className="text-3xl opacity-80">⏳</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
              <div className="text-3xl opacity-80">✅</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Canceled</p>
                <p className="text-2xl font-bold">{stats.canceled}</p>
              </div>
              <div className="text-3xl opacity-80">❌</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search patients, dates, times..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
            </div>
            <div className="lg:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                {statusOptions.map(option => (<option key={option} value={option}>{option}</option>))}
              </select>
            </div>
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="patient">By Patient</option>
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
              : 'Your patient appointments will appear here when scheduled'
            }
          </p>
          {(searchTerm || filterStatus !== 'all') && (
            <button
              onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedAppointments.map((appointment) => {
            const { formattedDate, formattedTime } = formatDateAndTime(appointment.localDate, appointment.localTime);
            const timeUntil = getTimeUntilAppointment(appointment.localDate, appointment.localTime);
            const isUpdating = updatingStatus === appointment.id;

            return (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-300"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {appointment.userName.charAt(0)}{appointment.userSurname.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {appointment.userName} {appointment.userSurname}
                        </p>
                        <p className="text-sm text-gray-500">{timeUntil}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[appointment.appointemntStatus]}`}>
                      <span className="mr-1">{statusIcons[appointment.appointemntStatus]}</span>
                      {appointment.appointemntStatus}
                    </span>
                  </div>

                  {/* Appointment Details */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📅</span>
                      <span className="font-medium">{formattedDate}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">⏰</span>
                      <span className="font-medium">{formattedTime}</span>
                    </div>
                  </div>

                  {/* Status Change Section - MAIN FOCUS */}
                  <div className="bg-gray-50 rounded-lg p-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Status Change</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(appointment.id, status)}
                          disabled={isUpdating || appointment.appointemntStatus === status}
                          className={`
                            relative py-3 px-2 rounded-lg text-xs font-medium transition-all duration-200 
                            ${appointment.appointemntStatus === status
                              ? `${statusColors[status]} ring-2 ring-offset-1 ring-gray-400`
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                            }
                            ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                          `}
                        >
                          {isUpdating && appointment.appointemntStatus !== status ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center space-y-1">
                              <span className="text-lg">{statusIcons[status]}</span>
                              <span>{status}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => setSelectedAppointment(appointment)}
                    className="w-full mt-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    View Full Details
                  </button>
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
                  className="text-gray-400 hover:text-gray-600 text-2xl">
                  </button>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <div className="text-center">
                  <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border ${statusColors[selectedAppointment.appointemntStatus]}`}>
                    <span>{statusIcons[selectedAppointment.appointemntStatus]}</span>
                    <span>{selectedAppointment.appointemntStatus}</span>
                  </span>
                </div>

                {/* Patient Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Patient Information</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-semibold">
                        {selectedAppointment.userName.charAt(0)}{selectedAppointment.userSurname.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">
                        {selectedAppointment.userName} {selectedAppointment.userSurname}
                      </p>
                      <p className="text-blue-700 text-sm">Patient</p>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Date</h3>
                    <p className="text-gray-700">
                      {formatDateAndTime(selectedAppointment.localDate, selectedAppointment.localTime).formattedDate}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Time</h3>
                    <p className="text-gray-700">
                      {formatDateAndTime(selectedAppointment.localDate, selectedAppointment.localTime).formattedTime}
                    </p>
                  </div>
                </div>

                {/* Status Change in Modal */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Change Status</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          handleStatusChange(selectedAppointment.id, status);
                          setSelectedAppointment({...selectedAppointment, appointemntStatus: status});
                        }}
                        disabled={updatingStatus === selectedAppointment.id}
                        className={`
                          py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 
                          ${selectedAppointment.appointemntStatus === status
                            ? `${statusColors[status]} ring-2 ring-offset-1 ring-gray-400`
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }
                          ${updatingStatus === selectedAppointment.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <span className="text-xl">{statusIcons[status]}</span>
                          <span>{status}</span>
                        </div>
                      </button>
                    ))}
                  </div>
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

export default DoctorAppointments;
                  