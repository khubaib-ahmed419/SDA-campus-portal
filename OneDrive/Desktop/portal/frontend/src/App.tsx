import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Welcome from "./pages/Welcome";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import FundRaise from "./pages/FundRaise";
import FundraiseDetails from "./pages/FundraiseDetails";
import LostAndFound from "./pages/LostAndFound";
import StudyGroups from "./pages/StudyGroups";
import StudentDashboard from "./pages/Dashboard";
import StudyGroupDetails from "./pages/studyGroupDetails";
import Profile from "./pages/Profile";

function App() {
  // Global mode state
  const [mode, setMode] = useState<"light" | "dark">("light");

  // Optional: toggle function
  const toggleMode = () => {
    setMode(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${mode}`}>
        {/* PAGE CONTENT */}
        <div className="flex-grow">
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Welcome mode={mode} toggleMode={toggleMode} />} />
            <Route path="/signup" element={<SignUp mode={mode} toggleMode={toggleMode} />} />
            <Route path="/login" element={<Login mode={mode} toggleMode={toggleMode} />} />
            <Route path="/forgot-password" element={<ForgotPassword mode={mode} toggleMode={toggleMode} />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/student/dashboard"
              element={
                <>
                  <Navbar mode={mode} toggleMode={toggleMode} />
                  <StudentDashboard mode={mode} toggleMode={toggleMode} />
                </>
              }
            />
            <Route
              path="/fundraise"
              element={
                <>
                  <Navbar mode={mode} toggleMode={toggleMode} />
                  <FundRaise mode={mode} toggleMode={toggleMode} />
                </>
              }
            />
            <Route
              path="/lost&found"
              element={
                <>
                  <Navbar mode={mode} toggleMode={toggleMode} />
                  <LostAndFound mode={mode} toggleMode={toggleMode}/>
                </>
              }
            />
            <Route
              path="/studygroups"
              element={
                <>
                  <Navbar mode={mode} toggleMode={toggleMode} />
                  <StudyGroups mode={mode} toggleMode={toggleMode} />
                </>
              }
            />
            <Route
              path="/study-groups/:id"
              element={
                <>
                  <Navbar mode={mode} toggleMode={toggleMode} />
                  <StudyGroupDetails mode={mode} toggleMode={toggleMode} />
                </>
              }
            />
            <Route
              path="/fundraise/:id"
              element={
                <>
                  <Navbar mode={mode} toggleMode={toggleMode} />
                  <FundraiseDetails mode={mode} toggleMode={toggleMode}  />
                </>
              }
            />
            <Route
              path="/student/profile/:id"
              element={
                <>
                  <Navbar mode={mode} toggleMode={toggleMode} />
                  <Profile mode={mode}   />
                </>
              }
            />
          </Routes>
        </div>

        {/* FOOTER */}
        <Footer mode={mode} toggleMode={toggleMode} />
      </div>
    </Router>
  );
}

export default App;
