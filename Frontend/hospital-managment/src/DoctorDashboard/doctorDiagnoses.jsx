import React, { useState, useEffect } from 'react';
import axiosInstance from '../Axios/index';

const DoctorDiagnoses = () => {
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const doctorId = JSON.parse(atob(token.split(".")[1])).sub;

        const response = await axiosInstance.get(`/diagnosis/doctor/${doctorId}`);
        setDiagnoses(response.data);
      } catch (error) {
        console.error("Failed to fetch diagnoses:", error);
      }
    };
    fetchDiagnoses();
  }, []);

  const formatDateAndTime = (datetime) => {
    const dateObj = new Date(datetime);
    const date = dateObj.toISOString().split('T')[0];
    const time = dateObj.toTimeString().split(' ')[0];
    return { date, time };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-6 text-center text-green-700">My Diagnoses</h2>

      {diagnoses.length === 0 ? (
        <p className="text-center text-gray-500">You don't have any diagnoses</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diagnoses.map((diagnosis, i) => {
            const { date, time } = formatDateAndTime(diagnosis.diagnosis_date);
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
              >
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  🧑‍🤝‍🧑 Patient: {diagnosis.userName} {diagnosis.userSurname}
                </p>
                <p className="text-gray-700 mb-2">
                  📝 <span className="font-medium">Diagnoses:</span> {diagnosis.diagnosis}
                </p>
                <p className="text-gray-600 text-sm">
                  📅 <span className="font-medium">Date:</span> {date}
                </p>
                <p className="text-gray-600 text-sm">
                  ⏰ <span className="font-medium">Time:</span> {time}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorDiagnoses;