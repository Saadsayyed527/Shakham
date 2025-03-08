import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import userDashboard from './pages/user/dashboard/userDashboard';
import ProtectedRoute from './middleware/protectedRoute';
import Home from './pages/default/home';
import LoginPage from './pages/user/login/login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><userDashboard /></ProtectedRoute>} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
