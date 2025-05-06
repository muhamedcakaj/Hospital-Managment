import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../Axios/index'

const CreateDiagnosis = () => {
    const [userEmail, setUserEmail] = useState('');
    const [diagnosisText, setDiagnosisText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        const [_, payload] = token.split('.');
        const decoded = JSON.parse(atob(payload));
        const doctorId = decoded.sub;

        const newDiagnosis = {
            doctorId,
            userEmail: userEmail,
            diagnosis: diagnosisText,
            date: new Date().toISOString(),
        };

        try {
            await axiosInstance.post('/diagnosis/doctor', newDiagnosis, {
              headers: { 'Content-Type': 'application/json' },
            });
            alert('Diagnosis created successfully!');
            setUserEmail('');
            setDiagnosisText('');
          } catch (error) {
            console.error(error);
            alert('Failed to create diagnosis.');
          }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Create New Diagnosis</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="User Email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                <textarea
                    placeholder="Diagnosis Details"
                    value={diagnosisText}
                    onChange={(e) => setDiagnosisText(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="4"
                    required
                ></textarea>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create Diagnosis
                </button>
            </form>
        </div>
    );
};

export default CreateDiagnosis;