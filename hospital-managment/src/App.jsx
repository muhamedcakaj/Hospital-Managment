import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './Login/index';
import SignUp from './SignUp/index';
import MFAPage from './MFA/index';
import PatientDashboard from './PatientDashboard/patientDashboard';
import PatientDiagnoses from './PatientDashboard/patientDiagnoses'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mfapage" element={<MFAPage />} />
        
        <Route path="/patientdashboard" element={<PatientDashboard />}>
        <Route path="diagnoses" element={<PatientDiagnoses />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;