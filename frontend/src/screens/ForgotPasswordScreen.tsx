import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const ForgotPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await api.post("/users/forgot-password/", { email });
      setSuccess(true);
      console.log(response.data.message);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send reset email. Please try again.");
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
              If an account exists with that email, we've sent password reset instructions.
            </p>
          </div>
          <button
            type="button"
            className="login-button"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Forgot Password</h1>
          <p className="login-subtitle">
            Enter your email address and we'll send you a link to reset your password
          </p>
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

          {error && (
            <div role="alert" className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`login-button ${submitting ? "is-loading" : ""}`}
            disabled={submitting}
          >
            {submitting ? "SENDING..." : "SEND RESET LINK"}
          </button>
        </form>

        <div className="login-footer">
          <span>Remember your password?</span>
          <button
            type="button"
            className="login-link"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
