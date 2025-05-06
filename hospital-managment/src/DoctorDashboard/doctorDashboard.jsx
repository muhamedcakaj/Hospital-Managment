import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';
import axiosInstance from '../Axios/index';

const DoctorDashboard = () => {
    const [doctorData, setDoctorData] = useState(null);
    const [doctorName, setDoctorName] = useState("");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    const fetchDoctorData = async () => {
        try {
          const response = await axiosInstance.get(`/doctors/${doctorName}`);
          setDoctorData(response.data);
        } catch (err) {
          console.error("Error fetching doctor data:", err);
        }
      };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate('/');
    };

    const confirmLogout = () => {
        setShowLogoutModal(true);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const [header, payload, signature] = token.split('.');
        const decodedPayload = atob(payload);
        const payloadObject = JSON.parse(decodedPayload);
        setDoctorName(payloadObject.sub); // assuming the "sub" holds doctor's ID or username

        if (doctorName) {
            fetchDoctorData();
        }
    }, [doctorName]);

    if (!doctorData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="bg-blue-900 text-white w-full md:w-1/4 p-4">
                <div className="text-center mb-6">
                    <div className="rounded-full bg-blue-700 w-20 h-20 mx-auto"></div>
                    <h3 className="mt-4">{doctorData.first_name + " " + doctorData.last_name}</h3>
                    <p className="text-sm text-blue-300">👨‍⚕️ Doctor • Online</p>
                </div>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/doctorDashboard/createDiagnosis" className="flex items-center">
                                <i className="fas fa-plus-circle mr-2"></i>📝 Create Diagnosis
                            </Link>
                        </li>
                        <li>
                            <Link to="/doctorDashboard/diagnoses" className="flex items-center">
                                <i className="fas fa-notes-medical mr-2"></i> 🧾 My Diagnoses
                            </Link>
                        </li>
                        <li>
                            <Link to="/doctorDashboard/myappointment" className="flex items-center">
                                <i className="fas fa-user-edit mr-2"></i>🗓️ My Appointments
                            </Link>
                        </li>
                        <li>
                            <Link to="/doctorDashboard/profile" className="flex items-center">
                                <i className="fas fa-user-edit mr-2"></i>👤 Profile
                            </Link>
                        </li>
                        <li>
                            <button
                                className="flex items-center text-red-500"
                                onClick={confirmLogout}
                            >
                                <i className="fas fa-sign-out-alt mr-2"></i>🚪 Log Out
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
                        <p className="mb-6">Are you sure you want to log out?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={cancelLogout}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={handleLogout}
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;