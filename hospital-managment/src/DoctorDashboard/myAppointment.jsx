import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statusColors = {
  Pending: 'bg-orange-100 text-orange-700 border border-orange-300',
  Canceled: 'bg-red-100 text-red-700 border border-red-300',
  Approved: 'bg-green-100 text-green-700 border border-green-300',
};

const statusOptions = ['Pending', 'Canceled', 'Approved'];

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const doctorId = JSON.parse(atob(token.split('.')[1])).sub; // assuming doctorId is sub

  useEffect(() => {
    axios.get(`http://localhost:8085/appointments/doctor/${doctorId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      setAppointments(response.data);
      setLoading(false);
    }).catch(error => {
      console.error("Error loading appointments:", error);
      setLoading(false);
    });
  }, [doctorId]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8085/appointments/${appointmentId}/status`,
        { status: newStatus }, 
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );

      // Update UI
      setAppointments(prev =>
        prev.map(app =>
          app.id === appointmentId ? { ...app, appointemntStatus: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update appointment status.");
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading appointments...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">Doctor's Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-center text-gray-600">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 border-b text-left">Date</th>
                <th className="py-3 px-4 border-b text-left">Time</th>
                <th className="py-3 px-4 border-b text-left">User ID</th>
                <th className="py-3 px-4 border-b text-left">Status</th>
                <th className="py-3 px-4 border-b text-left">Change Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(app => (
                <tr key={app.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 border-b">{app.localDate}</td>
                  <td className="py-3 px-4 border-b">{app.localTime}</td>
                  <td className="py-3 px-4 border-b">{app.userId}</td>
                  <td className="py-3 px-4 border-b">
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${statusColors[app.appointemntStatus] || 'bg-gray-100 text-gray-700 border'}`}>
                      {app.appointemntStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <select
                      value={app.appointemntStatus}
                      onChange={e => handleStatusChange(app.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;