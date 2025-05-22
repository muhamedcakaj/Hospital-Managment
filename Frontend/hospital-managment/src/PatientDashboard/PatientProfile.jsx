import React, { useEffect, useState } from 'react';
import axiosInstance from '../Axios/index';

const EditUserProfile = () => {
  const [user, setUser] = useState(null);
  const token = sessionStorage.getItem("token");
  const userId = JSON.parse(atob(token.split('.')[1])).sub;

  useEffect(() => {
    fetch(`http://localhost:8085/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  const handleChange = e => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    await axiosInstance.put(`/users/${userId}`, user, {
      headers: { 'Content-Type': 'application/json' },
    });
    alert("Të dhënat u përditësuan me sukses.");
  };
  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profili im</h2>
      <input
        name="first_name"
        value={user.first_name}
        onChange={handleChange}
        placeholder="first_name"
        className="block mb-4 p-2 border rounded w-full"
      />
      <input
        name="second_name"
        value={user.second_name}
        onChange={handleChange}
        placeholder="second_name"
        className="block mb-4 p-2 border rounded w-full"
      />
      <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
        Ruaj ndryshimet
      </button>
    </div>
  );
};

export default EditUserProfile;