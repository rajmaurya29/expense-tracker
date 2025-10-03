import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import type { RootState,AppDispatch } from "../redux/store";
import { loginUser } from "../redux/slices/UserSlice";
// import "./index.css"; // make sure this file is imported once (here or in your app root)
// const API_URL = import.meta.env.VITE_API_URL as string;

const LoginScreen: React.FC = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userSelector=useSelector((s:RootState)=>s.userInfo)
  
    useEffect(()=>{
      // console.log()
      if(userSelector.userInfo) navigate("/");
    },[userSelector])
  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Demo login
      // await new Promise((r) => setTimeout(r, 800));
      await dispatch(loginUser({ email, password })).unwrap()
      // console.log("Login
      // :", { email, password });
    } catch (err: any) {
      setSubmitting(false)
      setError(err?.message || "Invalid Credentials");
    } 
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Please enter your details to log in</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label className="login-label">
            Email Address
            <input
              className="login-input"
              type="email"
              required
              placeholder="john@timetoprogram.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="login-label">
            Password
            <input
              className="login-input"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && (
            <div role="alert" className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`login-button ${submitting ? "is-loading" : ""}`}
            disabled={submitting}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "translateY(1px)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            {submitting ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <div className="login-footer">
          <span>Don’t have an account?</span>
          <button
            type="button"
            className="login-link"
            onClick={() => navigate("/signup")}
          >
            SignUp
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
