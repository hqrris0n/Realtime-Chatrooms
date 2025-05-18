import React from "react";
import NavBar from "./components/NavBar";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import SetttingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useEffect } from "react";
import { useAuthStore } from "./store/userAuthStore";
import {Loader} from "lucide-react";

const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);
  
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    );
  };

  return (
    <div>
      <NavBar />

      {/* Each route is a new page. The items inside of HomePage is the first page on load */}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/"/>} />
        <Route path="/login" element={!authUser ? <LogInPage /> : <Navigate to="/"/>} />
        <Route path="/settings" element={<SetttingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  );
};

export default App;
