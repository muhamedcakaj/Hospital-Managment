import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from '../Axios/index';

const AdminDashboard = () => {
    const [adminData, setAdminData] = useState(null);
    const [adminName, setAdminName] = useState("");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isWelcomePage = location.pathname === '/adminDashboard' || location.pathname === '/adminDashboard/';

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
        { to: "usersManagment", icon: "👥", label: "Manage Users" },
        { to: "doctorsManagment", icon: "👨‍⚕️", label: "Manage Doctors" },
    ];

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const [header, payload, signature] = token.split('.');
                const decodedPayload = atob(payload);
                const payloadObject = JSON.parse(decodedPayload);
                // Assuming admin name is in payloadObject.name or similar
                setAdminName(payloadObject.name || 'Admin');
                // You might want to fetch more admin data here if needed
            } catch (error) {
                console.error("Error decoding token:", error);
                // Handle invalid token, e.g., redirect to login
                navigate('/');
            }
        } else {
            // No token found, redirect to login
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="bg-blue-900 text-white w-64 p-6 shadow-lg">
                <div className="mb-8">
                    <div className="bg-blue-800 rounded-lg p-4">
                        <div className="w-16 h-16 bg-blue-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <span className="text-2xl font-bold">
                                {adminName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <p className="font-semibold text-center">
                            {adminName}
                        </p>
                        <p className="text-blue-200 text-sm text-center">🛡️ Administrator • Online</p>
                    </div>
                </div>
                
                <nav className="space-y-2">
                    <Link 
                        to="/adminDashboard" 
                        className={`block p-3 rounded-lg transition-colors duration-200 ${
                            isWelcomePage 
                                ? 'bg-blue-700 text-white' 
                                : 'hover:bg-blue-800 hover:text-blue-100'
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
                                    ? 'bg-blue-700 text-white' 
                                    : 'hover:bg-blue-800 hover:text-blue-100'
                            }`}
                        >
                            {item.icon} {item.label}
                        </Link>
                    ))}
                    
                    <div className="pt-4 mt-4 border-t border-blue-700">
                        <button
                            className="w-full text-left p-3 rounded-lg text-red-300 hover:bg-red-900 hover:text-red-100 transition-colors duration-200"
                            onClick={confirmLogout}
                        >
                            🚪 Log Out
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet /> {/* This is where the child routes will render */}
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

export default AdminDashboard;


