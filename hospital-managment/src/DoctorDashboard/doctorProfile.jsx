import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorProfile = () => {
    const [doctor, setDoctor] = useState({
        first_name: '',
        last_name: '',
        specialization: '',
        description: '',
    });

    useEffect(() => {
        const fetchDoctor = async () => {
            const token = sessionStorage.getItem('token');
            const [_, payload] = token.split('.');
            const decoded = JSON.parse(atob(payload));
            const doctorId = decoded.sub;

            const response = await axios.get(`http://localhost:8085/doctors/${doctorId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDoctor(response.data);
        };

        fetchDoctor();
    }, []);

    const handleChange = (e) => {
        setDoctor({ ...doctor, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        const [_, payload] = token.split('.');
        const decoded = JSON.parse(atob(payload));
        const doctorId = decoded.sub;

        await axios.put(`http://localhost:8085/doctors/${doctorId}`, doctor, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        alert('Profile updated successfully!');
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="first_name"
                    placeholder="first_name"
                    value={doctor.first_name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    name="last_name"
                    placeholder="last_name"
                    value={doctor.last_name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    name="specialization"
                    placeholder="specialization"
                    value={doctor.specialization}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                  <input
                    type="text"
                    name="description"
                    placeholder="description"
                    value={doctor.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default DoctorProfile;