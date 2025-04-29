import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AppointmentPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [busyAppointments, setBusyAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  const token = sessionStorage.getItem("token");
  console.log(token);
  

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8085",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const getUserIdFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || payload.id || payload.userId;
    } catch (error) {
      console.error("Error parsing token", error);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/doctors/user");
        setDoctors(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load doctors.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      const fetchAppointments = async () => {
        setIsLoadingAppointments(true);
        setSelectedTime(""); // Clear selected time when date changes
        try {
          const formattedDate = formatDate(selectedDate);
          const response = await axiosInstance.get(
            `/appointments/doctor/${selectedDoctorId}`
          );
          console.log(response.data);
          
          setBusyAppointments(response.data);
        } catch (err) {
          console.error(err);
          setError("Failed to load busy appointments.");
        } finally {
          setIsLoadingAppointments(false);
        }
      };
      fetchAppointments();
    } else {
      setBusyAppointments([]);
    }
  }, [selectedDoctorId, selectedDate]);

  const formatDate = (date) => {
    if (!date) return null;
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  const generateAvailableTimes = () => {
    const times = [];
    for (let hour = 8; hour <= 16; hour++) {
      times.push(`${hour.toString().padStart(2, "0")}:00:00`);
      if (hour !== 16) {
        times.push(`${hour.toString().padStart(2, "0")}:30:00`);
      }
    }
    return times;
  };

  const isTimeBusy = (time) => {
    const selectedFormattedDate = formatDate(selectedDate);
    return busyAppointments.some(
      (appointment) =>
        appointment.localTime === time && appointment.localDate === selectedFormattedDate
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!selectedDoctorId || !selectedDate || !selectedTime) {
      setError("Please select doctor, date and time.");
      return;
    }

    if (!userId) {
      setError("User not authenticated properly.");
      return;
    }

    try {
      await axiosInstance.post("/appointments", {
        doctorId: selectedDoctorId,
        userId: userId,
        localDate: formatDate(selectedDate),
        localTime: selectedTime,
      });
      alert("Appointment booked successfully!")
      setSuccessMessage("Appointment booked successfully!");
      setSelectedDoctorId("");
      setSelectedDate(null);
      setSelectedTime("");
      setBusyAppointments([]);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create appointment.");
      }
    }
  };

  const availableTimes = generateAvailableTimes();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Book an Appointment</h2>

      {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}
      {successMessage && (
        <div className="bg-green-200 text-green-800 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Doctor selection */}
        <div>
          <label className="block mb-2 font-semibold">Choose a Doctor:</label>
          <select
            value={selectedDoctorId}
            onChange={(e) => {
              setSelectedDoctorId(e.target.value);
              setSelectedDate(null);
              setSelectedTime("");
            }}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.id} {doc.first_name} {doc.last_name} ({doc.specialization})
              </option>
            ))}
          </select>
        </div>

        {/* Date selection */}
        <div>
          <label className="block mb-2 font-semibold">Choose a Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setSelectedTime("");
            }}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border rounded"
            placeholderText="Select a date"
            disabled={!selectedDoctorId}
          />
        </div>

        {/* Time selection */}
        <div>
          <label className="block mb-2 font-semibold">Choose a Time:</label>
          {isLoadingAppointments ? (
            <div className="p-4 text-center text-gray-500">Loading available times...</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => {
                const busy = isTimeBusy(time);
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    disabled={busy || !selectedDate}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 rounded border transition-colors duration-200 ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : busy
                        ? "bg-red-400 text-white cursor-not-allowed"
                        : !selectedDate
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={!selectedDoctorId || !selectedDate || !selectedTime}
            className={`w-full p-3 rounded ${
              !selectedDoctorId || !selectedDate || !selectedTime
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  );
}