import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from './Login/index';
import SignUp from './SignUp/index';
import MFAPage from './MFA/index';

import PatientDashboard from './PatientDashboard/patientDashboard';
import PatientDiagnoses from './PatientDashboard/patientDiagnoses';
import PatientProfile from './PatientDashboard/PatientProfile';
import PatientAppointment from './PatientDashboard/patientAppoitment';

import DoctorDashboard from './DoctorDashboard/doctorDashboard';
import DoctorDiagnoses from './DoctorDashboard/doctorDiagnoses';
import DoctorCreateDiagnoses from './DoctorDashboard/createDiagnosis';
import DoctorProfile from './DoctorDashboard/doctorProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mfapage" element={<MFAPage />} />
        
        <Route path="/patientdashboard" element={<PatientDashboard />}>
        <Route path="diagnoses" element={<PatientDiagnoses />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="appointment" element={<PatientAppointment/>} />
        </Route>

        <Route path="/doctordashboard" element={<DoctorDashboard />}>
        <Route path="diagnoses" element={<DoctorDiagnoses />} />
        <Route path="createDiagnosis" element={<DoctorCreateDiagnoses />} />
        <Route path="profile" element={<DoctorProfile />} />
        </Route>


      </Routes>
    </Router>
  );
}

export default App;