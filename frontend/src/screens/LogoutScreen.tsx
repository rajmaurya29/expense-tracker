import React, { useEffect, useState } from "react";
// import "../index.css"; // ensure global styles are loaded somewhere in your app
import { useDispatch,useSelector } from "react-redux";
import type { RootState,AppDispatch } from "../redux/store";
import { logoutUser } from "../redux/slices/UserSlice";
import {  useNavigate } from "react-router-dom";
// const API_URL = import.meta.env.VITE_API_URL as string;

const LogoutScreen: React.FC = () => {
  
  const navigate=useNavigate();
  const userName = useSelector((state: RootState) => state.userInfo.userInfo);
  useEffect(()=>{
    if(!userName)
        navigate("/login");
  })

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const dispatch=useDispatch<AppDispatch>();
  const handleLogout = async () => {
    setIsProcessing(true);
    setMessage(null);
    try {
      // TODO: replace with real sign-out
      // e.g., await api.logout(); localStorage.removeItem("token");
      await new Promise((r) => setTimeout(r, 700));
      dispatch(logoutUser());
      setMessage("You have been logged out.");
      navigate("/login");
      // Optional: redirect after success
      // setTimeout(() => (window.location.href = "/login"), 800);
    } catch {
      setMessage("Failed to log out. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelAndReturn = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/dashboard";
  };

  return (
    <div className="auth-page logout-page">
      <div className="auth-card logout-card">
        <div className="auth-header">
          <h1 className="auth-title">Logout</h1>
          <p className="auth-subtitle">Are you sure you want to log out?</p>
        </div>

        <div className="logout-actions">
          <button
            className={`btn btn-primary ${isProcessing ? "is-loading" : ""}`}
            onClick={handleLogout}
            disabled={isProcessing}
          >
            {isProcessing ? "LOGGING OUT..." : "Yes, Logout"}
          </button>

          <button className="btn btn-ghost" onClick={cancelAndReturn}>
            Cancel
          </button>
        </div>

        {message && <div className="auth-message">{message}</div>}
      </div>
    </div>
  );
};

export default LogoutScreen;
