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
import CourseContent from './pages/course/course-content';
import ProfileCourses from './pages/course/ProfileCourses';
import VideoPlayer from './pages/course/videoPlayer';
import Cart from './pages/cart/Cart';
import Checkout from './pages/cart/Checkout';
import RoomPage from './pages/chat/RoomPage';

import ChatList from './pages/user/chat/chat-list';
import ChatRoom from './pages/user/chat/chat-room';
import NetworkNavbar from './components/network-navbar';
import NetworkPage from './pages/network/network';
import ChatDetail from './pages/network/chat';




const App = () => {
  return (
    <Router>
      <Toaster />
      <NetworkNavbar/>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<InstructorDashboard/>} />
        <Route path="/course/:courseId" element={<CourseContent/>} />
        <Route path="/courses" element={<ProfileCourses/>} />
        <Route path="/video/:courseId/:lectureId" element={<VideoPlayer />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/network" element={<NetworkPage />} />
        <Route path="/network/chat" element={<ChatDetail />} />
        
        
  

        <Route path="/" element={<StudentLandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;