import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserDashboard from './pages/user/dashboard/userDashboard';
import ProtectedRoute from './middleware/protectedRoute';
import Home from './pages/default/home';
import LoginPage from './pages/user/login/login';
import RegisterPage from './pages/user/login/register';
import { Toaster } from 'react-hot-toast';
// import { ProfileSettings } from './pages/user/dashboard/profile-settings';
import InstructorDashboard from './pages/user/dashboard/instructor-dashboard';
import StudentLandingPage from './pages/default/landingPage';

const App = () => {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<InstructorDashboard/>} />
        <Route path="/landing" element={<StudentLandingPage/>} />
        


        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
