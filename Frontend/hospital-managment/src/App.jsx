import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from './Login/index';
import SignUp from './SignUp/index';
import MFAPage from './MFA/index';

import AdminDashboard from './AdminDashboard/admindashboard';
import AdminUserManagment from './AdminDashboard/usersManagment';
import AdminDoctorManagment from './AdminDashboard/doctorManagement';

import PatientDashboard from './PatientDashboard/patientDashboard';
import PatientWelcomePage from './PatientDashboard/WelcomeDashboard';
import PatientDiagnoses from './PatientDashboard/patientDiagnoses';
import PatientProfile from './PatientDashboard/PatientProfile';
import PatientAppointment from './PatientDashboard/patientAppoitment';
import PatientMyAppointment from './PatientDashboard/myAppointment';
import PatientMessage from './PatientDashboard/patientMessage';

import DoctorDashboard from './DoctorDashboard/doctorDashboard';
import DoctorWelcomePage from './DoctorDashboard/welcomeDashboard'
import DoctorDiagnoses from './DoctorDashboard/doctorDiagnoses';
import DoctorCreateDiagnoses from './DoctorDashboard/createDiagnosis';
import DoctorProfile from './DoctorDashboard/doctorProfile';
import DoctorAppointments from './DoctorDashboard/myAppointment';
import DoctorMessage from './DoctorDashboard/doctorMessage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mfapage" element={<MFAPage />} />

        <Route path="/adminDashboard" element={<AdminDashboard/>}>
        <Route path="usersManagment" element={<AdminUserManagment/>} />
        <Route path="doctorsManagment" element={<AdminDoctorManagment/>} />
        </Route>

        <Route path="/patientdashboard" element={<PatientDashboard />}>
        <Route path="dashboard" element={<PatientWelcomePage />} />
        <Route path="diagnoses" element={<PatientDiagnoses />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="appointment" element={<PatientAppointment/>} />
        <Route path="myappointment" element={<PatientMyAppointment/>} />
        <Route path="message" element={<PatientMessage/>} />
        </Route>

        <Route path="/doctordashboard" element={<DoctorDashboard />}>
        <Route path="dashboard" element={<DoctorWelcomePage />} />
        <Route path="diagnoses" element={<DoctorDiagnoses />} />
        <Route path="createDiagnosis" element={<DoctorCreateDiagnoses />} />
        <Route path="profile" element={<DoctorProfile />} />
        <Route path="myappointment" element={<DoctorAppointments />} />
        <Route path="message" element={<DoctorMessage />} />
        </Route>


      </Routes>
    </Router>
  );
}

export default App;