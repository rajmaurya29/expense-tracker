import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL as string;

const SignUpScreen: React.FC = () => {
  const navigate=useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setEmailError("Please enter a valid email address.");
          return false;
        }
        setEmailError(null);
        return true;
      };
    
      const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.{8,})/;
        if (!passwordRegex.test(password)) {
          setPasswordError(
            "Password must be at least 8 characters long, contain one uppercase letter, and one special character."
          );
          return false;
        }
        setPasswordError(null);
        return true;
      };

      useEffect(() => {
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const arePasswordsMatching = password === confirm;
        setIsFormValid(isEmailValid && isPasswordValid && arePasswordsMatching);
      }, [email, password, confirm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}/users/register/`,
        { name, email, password },
        { withCredentials: true }
      );
      console.log(response.data.message);
      setSuccess(true);
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Check Your Email</h1>
            <p className="login-subtitle">
              We've sent a verification link to {email}. Please check your email and click the link to verify your account.
            </p>
          </div>
          <button
            type="button"
            className="login-button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Signup to continue</h1>
          <p className="login-subtitle">Please enter your details to create an account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label className="login-label">
            Full Name
            <input
              className="login-input"
              type="text"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="login-label">
            Email Address
            <input
              className="login-input"
              type="email"
              required
              placeholder="john@timetoprogram.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                validateEmail(e.target.value)
              }}
            />
          </label>
          {emailError && <div className="login-error">{emailError}</div>}

          <label className="login-label">
            Password
            <input
              className="login-input"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                validatePassword(e.target.value)
              }}
              minLength={8}
            />
          </label>
          {passwordError && <div className="login-error">{passwordError}</div>}


          <label className="login-label">
            Confirm Password
            <input
              className="login-input"
              type="password"
              required
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={8}
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
            disabled={submitting || !isFormValid}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "translateY(1px)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            {submitting ? "CREATING ACCOUNT..." : "SIGN UP"}
          </button>
        </form>

        <div className="login-footer">
          <span>Already have an account?</span>
          <button
            type="button"
            className="login-link"
            onClick={() =>navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
