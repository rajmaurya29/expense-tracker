import React, { useState } from "react";
// import "./index.css"; // uses the same classes as the login screen
import { useNavigate } from "react-router-dom";

const SignUpScreen: React.FC = () => {
  const navigate=useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Demo-only: simulate async signup
      await new Promise((r) => setTimeout(r, 900));
      console.log("Signup:", { name, email, password });
    } catch (err: any) {
      setError(err?.message || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
              minLength={6}
            />
          </label>

          <label className="login-label">
            Confirm Password
            <input
              className="login-input"
              type="password"
              required
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={6}
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
