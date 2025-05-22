import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../Axios/index';

const statusColors = {
  Pending: 'bg-orange-100 text-orange-700 border border-orange-300',
  Canceled: 'bg-red-100 text-red-700 border border-red-300',
  Approved: 'bg-green-100 text-green-700 border border-green-300',
};

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const userId = JSON.parse(atob(token.split('.')[1])).sub;

  useEffect(() => {
    if (!userId) return;
  
    axiosInstance.get(`/appointments/user/${userId}`)
      .then(response => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      });
  }, [userId]);

  if (!userId) return <p className="text-center mt-10 text-lg text-gray-700">Please log in as a user to view your appointments.</p>;
  if (loading) return <p className="text-center mt-10 text-lg text-gray-700">Loading appointments...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-600">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto rounded shadow-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left border-b">Date</th>
                <th className="py-3 px-4 text-left border-b">Time</th>
                <th className="py-3 px-4 text-left border-b">Doctor ID</th>
                <th className="py-3 px-4 text-left border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(app => (
                <tr key={app.id} className="hover:bg-gray-50 transition duration-200">
                  <td className="py-3 px-4 border-b">{app.localDate}</td>
                  <td className="py-3 px-4 border-b">{app.localTime}</td>
                  <td className="py-3 px-4 border-b">{app.doctorId}</td>
                  <td className="py-3 px-4 border-b">
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${statusColors[app.appointemntStatus] || 'bg-gray-100 text-gray-700 border'}`}>
                      {app.appointemntStatus}
                    </span>
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

export default MyAppointments;