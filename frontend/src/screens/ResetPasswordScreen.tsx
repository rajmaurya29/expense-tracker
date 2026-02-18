import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/api";

const ResetPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!uid || !token) {
      setError("Invalid reset link");
    }
  }, [uid, token]);

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain one uppercase letter, and one special character."
      );
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePassword(password)) {
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("/users/reset-password/", {
        uid,
        token,
        password,
      });
      setSuccess(true);
      console.log(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to reset password. The link may be expired."
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
            <h1 className="login-title">Password Reset Successful</h1>
            <p className="login-subtitle">
              Your password has been reset successfully. Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Reset Password</h1>
          <p className="login-subtitle">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label className="login-label">
            New Password
            <input
              className="login-input"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            disabled={submitting || !uid || !token}
          >
            {submitting ? "RESETTING..." : "RESET PASSWORD"}
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

export default ResetPasswordScreen;
