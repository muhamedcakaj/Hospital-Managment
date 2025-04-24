import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from 'axios';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [userName, setUserName] = useState("");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    const handleUser = async () => {
        try {
            const response = await fetch(`http://localhost:8083/v1/user/username/${userName}`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                },
            });
            if (response.status === 401) {
                alert("Session expired. Please log in again.");
                sessionStorage.removeItem("token");
                navigate('/');
            } else if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleLogOut = async () => {
        try {
            await axios.delete(`http://localhost:8083/v1/user/deleteChaching/${userName}`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error(error);
            alert('Error logging out. Please try again.');
        }

        try {
            await axios.delete(`http://localhost:8083/v1/bilanc/deleteChaching/${userName}`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error(error);
            alert('Error logging out. Please try again.');
        }
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
        setUserName(payloadObject.sub);

        if (userName) {
            handleUser();
        }
    }, [userName]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="bg-gray-900 text-white w-full md:w-1/4 p-4">
                <div className="text-center mb-6">
                    <div className="rounded-full bg-gray-700 w-20 h-20 mx-auto"></div>
                    <h3 className="mt-4">{userData.name + " " + userData.surname}</h3>
                    <p className="text-sm text-gray-400">User • Online</p>
                </div>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/dashboard/home" className="flex items-center">
                                <i className="fas fa-tachometer-alt mr-2"></i> Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/addCash" className="flex items-center">
                                <i className="fas fa-money-bill-alt mr-2"></i> Add Cash
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/userDashboard" className="flex items-center">
                                <i className="fas fa-cog mr-2"></i> Profile
                            </Link>
                        </li>
                        <li>
                            <button
                                className="flex items-center text-red-500"
                                onClick={confirmLogout}
                            >
                                <i className="fas fa-sign-out-alt mr-2"></i> Log Out
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 p-6">
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
                                onClick={handleLogOut}
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

export default Dashboard;