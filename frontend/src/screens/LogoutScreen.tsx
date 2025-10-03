import React, { useEffect, useState } from "react";
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
     
      await dispatch(logoutUser()).unwrap();
      setMessage("You have been logged out.");
      navigate("/login");
      
    } catch {
      setIsProcessing(false);
      setMessage("Failed to log out. Please try again.");
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
