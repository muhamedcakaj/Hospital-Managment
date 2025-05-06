import React, { useEffect, useState } from 'react';
import axiosInstance from '../Axios/index';

const UserDiagnoses = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const token = sessionStorage.getItem("token");
  const userId = JSON.parse(atob(token.split('.')[1])).sub;

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const response = await axiosInstance.get(`/diagnosis/user/${userId}`);
        setDiagnoses(response.data);
      } catch (err) {
        console.error("Failed to fetch diagnoses:", err);
      }
    };
    fetchDiagnoses();
  }, [userId]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Diagnozat e mia</h2>
      {diagnoses.length === 0 ? (
        <p>Ende nuk keni diagnoza.</p>
      ) : (
        <ul className="space-y-2">
          {diagnoses.map((d, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              <strong>Id of Doctor:</strong> {d.doctorId} <br />
              <strong>Description:</strong> {d.diagnosis} <br/>
              <strong>Date:</strong> {d.diagnosis_date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDiagnoses;