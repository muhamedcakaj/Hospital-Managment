import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './Login/login';
import SignUp from './SignUp/index';
import MFAPage from './Login/mfa';
import Home from './Dashboard/home';
import Dashboard from './Dashboard/dashboard';
import AddCash from './Dashboard/addCash';
import UserDashboard from './Dashboard/userDashboard';
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