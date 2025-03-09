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
import ClusterCourses from './pages/ClusterCourses';
// import RoomPage from './pages/chat/RoomPage';
// import ChatPage from './pages/chat/ChatPage';
// import CourseRecommendations from './pages/CourseRecommendations';

// import CourseRecommendations from './CourseRecommendatio'

const App = () => {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<InstructorDashboard/>} />
        <Route path="/landing" element={<StudentLandingPage/>} />
        <Route path="/course/:courseId" element={<CourseContent/>} />
        <Route path="/courses" element={<ProfileCourses/>} />
        <Route path="/video/:courseId/:lectureId" element={<VideoPlayer />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        
        {/* <Route path="/rooms" element={<RoomPage />} />
        <Route path="/chat/:room" element={<ChatPage />} />*/}
        {/* <Route path="/recommend/:id" element={<CourseRecommendations />} />  */}


        <Route path="/cluster/:clusterId/:startIndex?" element={<ClusterCourses />} />

        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
