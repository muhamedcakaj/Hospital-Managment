import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './Login/index';
import SignUp from './SignUp/index';
import MFAPage from './MFA/index';
import PatientDashboard from './PatientDashboard/patientDashboard';
import Dashboard from './PatientDashboard/dashboard';
import AddCash from './PatientDashboard/addCash';
import UserDashboard from './PatientDashboard/userDashboard';
import AdminDashboard from './AdminDashboard/Admindashboard';
import AdminHome from './AdminDashboard/adminHome';
import AdminDashboardUsers from './AdminDashboard/Users/users';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mfapage" element={<MFAPage />} />
        
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="home" element={<Home />} />
          <Route path="addCash" element={<AddCash />} />
          <Route path="userDashboard" element={<UserDashboard />} />
        </Route>
        <Route path="/admindashboard" element={<AdminDashboard />}>
          <Route path="adminHome" element={<AdminHome />} />
          <Route path="adminDashboardUsers" element={<AdminDashboardUsers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;