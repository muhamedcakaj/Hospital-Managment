import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import axiosInstance from '../Axios';

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = sessionStorage.getItem("token");
  const decodedPayload = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userId = decodedPayload?.sub;

  // Check if we're on the dashboard root (welcome page)
  const isWelcomePage = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [userId]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const navigationItems = [
    { to: "appointment", icon: "🕒", label: "Create Appointment" },
    { to: "diagnoses", icon: "🧾", label: "My Diagnoses" },
    { to: "myappointment", icon: "🗓️", label: "My Appointments" },
    { to: "message", icon: "💬", label: "Message" },
    { to: "profile", icon: "👤", label: "My Profile" }
  ];

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="bg-blue-900 text-white w-64 p-6 shadow-lg">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">👨‍⚕️ Online Hospital</h2>
          <div className="bg-blue-800 rounded-lg p-3">
            <p className="font-semibold">{user.first_name} {user.second_name}</p>
            <p className="text-blue-200 text-sm">Patient</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          <Link 
            to="dashboard" 
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
              onClick={() => setShowLogoutModal(true)} 
              className="w-full text-left p-3 rounded-lg text-red-300 hover:bg-red-900 hover:text-red-100 transition-colors duration-200"
            >
              🚪 Log Out
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {isWelcomePage ? (
            <WelcomeDashboard user={user} />
          ) : (
            <Outlet />
          )}
        </div>
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure you want to log out?
            </h3>
            <p className="text-gray-600 mb-6">
              You will need to log in again to access your dashboard.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowLogoutModal(false)} 
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
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

export default PatientDashboard;
