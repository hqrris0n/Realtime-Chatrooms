import React from "react";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import SetttingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <div>
      
      <NavBar />

      {/* Each route is a new page. The items inside of HomePage is the first page on load */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/settings" element={<SetttingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

    </div>
  );
};

export default App;
