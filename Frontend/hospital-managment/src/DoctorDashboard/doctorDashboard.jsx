import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from '../Axios/index';

const DoctorDashboard = () => {
    const [doctorData, setDoctorData] = useState(null);
    const [doctorName, setDoctorName] = useState("");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we're on the dashboard root (welcome page)
    const isWelcomePage = location.pathname === '/doctorDashboard' || location.pathname === '/doctorDashboard/';

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

    const navigationItems = [
        { to: "createDiagnosis", icon: "📝", label: "Create Diagnosis" },
        { to: "diagnoses", icon: "🧾", label: "My Diagnoses" },
        { to: "myappointment", icon: "🗓️", label: "My Appointments" },
        { to: "message", icon: "💬", label: "Message" },
        { to: "profile", icon: "👤", label: "Profile" }
    ];

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            const [header, payload, signature] = token.split('.');
            const decodedPayload = atob(payload);
            const payloadObject = JSON.parse(decodedPayload);
            setDoctorName(payloadObject.sub);
        }
    }, []);

    useEffect(() => {
        if (doctorName) {
            fetchDoctorData();
        }
    }, [doctorName]);

    if (!doctorData) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="bg-green-900 text-white w-64 p-6 shadow-lg">
                <div className="mb-8">
                    <div className="bg-green-800 rounded-lg p-4">
                        <div className="w-16 h-16 bg-green-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <span className="text-2xl font-bold">
                                {doctorData.first_name?.charAt(0)}{doctorData.last_name?.charAt(0)}
                            </span>
                        </div>
                        <p className="font-semibold text-center">Dr. {doctorData.first_name} {doctorData.last_name}</p>
                        <p className="text-green-200 text-sm text-center">👨‍⚕️ Doctor • Online</p>
                    </div>
                </div>
                
                <nav className="space-y-2">
                    <Link 
                        to="dashboard" 
                        className={`block p-3 rounded-lg transition-colors duration-200 ${
                            isWelcomePage 
                                ? 'bg-green-700 text-white' 
                                : 'hover:bg-green-800 hover:text-green-100'
                        }`}
                    >
                        🏠 Dashboard
                    </Link>
                    
                    {navigationItems.map((item) => (
                        <Link 
                            key={item.to}
                            to={item.to} 
                            className={`block p-3 rounded-lg transition-colors duration-200 ${
                                location.pathname.includes(item.to)
                                    ? 'bg-green-700 text-white' 
                                    : 'hover:bg-green-800 hover:text-green-100'
                            }`}
                        >
                            {item.icon} {item.label}
                        </Link>
                    ))}
                    
                    <div className="pt-4 mt-4 border-t border-green-700">
                        <button
                            className="w-full text-left p-3 rounded-lg text-red-300 hover:bg-red-900 hover:text-red-100 transition-colors duration-200"
                            onClick={confirmLogout}
                        >
                            🚪 Log Out
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-6">
                    {isWelcomePage ? (
                        <DoctorWelcomeDashboard doctorData={doctorData} />
                    ) : (
                        <Outlet />
                    )}
                </div>
            </main>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Confirm Logout
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to log out? Any unsaved work will be lost.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                                onClick={cancelLogout}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
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

