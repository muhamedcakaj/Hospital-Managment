import React from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const decodedPayload = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userId = decodedPayload?.sub;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8085/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log(data);
        
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <aside className="bg-blue-900 text-white w-64 p-6">
        <h2 className="text-xl font-bold mb-4">👨‍⚕️ Spitali Online</h2>
        <p className="mb-6">{user.first_name} {user.second_name}</p>
        <nav className="space-y-4">
        <Link to="appointment" className="block hover:text-blue-300">🕒 Create Appointment</Link>
          <Link to="diagnoses" className="block hover:text-blue-300">🧾 Diagnozat e mia</Link>
          <Link to="myappointment" className="block hover:text-blue-300">🗓️ My Appointments</Link>
          <Link to="profile" className="block hover:text-blue-300">👤 Profili im</Link>
          <button onClick={() => setShowLogoutModal(true)} className="text-red-300 hover:text-red-500">
            🚪 Dil jashtë
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded">
            <h3 className="text-lg font-semibold mb-4">Jeni të sigurt që doni të dilni?</h3>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 bg-gray-300 rounded">Anulo</button>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">Dil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;