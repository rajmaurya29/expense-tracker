import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/api";

const VerifyEmailScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!uid || !token) {
        setError("Invalid verification link");
        setVerifying(false);
        return;
      }

      try {
        const response = await api.post("/users/verify-email/", {
          uid,
          token,
        });
        setSuccess(true);
        console.log(response.data.message);
        setTimeout(() => navigate("/login"), 3000);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to verify email. The link may be expired."
        );
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [uid, token, navigate]);

  if (verifying) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Verifying Email...</h1>
            <p className="login-subtitle">Please wait while we verify your email address</p>
          </div>
          <div className="loader-container">
            <div className="loader">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Email Verified!</h1>
            <p className="login-subtitle">
              Your email has been verified successfully. Redirecting to login...
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
          <h1 className="login-title">Verification Failed</h1>
          <p className="login-subtitle">{error}</p>
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
};

export default VerifyEmailScreen;
