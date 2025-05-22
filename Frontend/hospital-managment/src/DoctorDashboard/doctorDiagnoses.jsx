import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../Axios/index';

const DoctorDiagnoses = () => {
    const [diagnoses, setDiagnoses] = useState([]);

    useEffect(() => {
        const fetchDiagnoses = async () => {
          const token = sessionStorage.getItem("token");
          const doctorId = JSON.parse(atob(token.split(".")[1])).sub;
      
          const response = await axiosInstance.get(`/diagnosis/doctor/${doctorId}`);
          setDiagnoses(response.data);
        };
        fetchDiagnoses();
      }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">My Diagnoses</h2>
            {diagnoses.map((diagnosis) => (
                <div key={diagnosis.id} className="border p-4 mb-4 rounded shadow">
                    <p><strong>User ID:</strong> {diagnosis.userId}</p>
                    <p><strong>Diagnosis:</strong> {diagnosis.diagnosis}</p>
                    <p><strong>Date:</strong> {diagnosis.diagnosis_date}</p>
                </div>
            ))}
        </div>
    );
};

export default DoctorDiagnoses;