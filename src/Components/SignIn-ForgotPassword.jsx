import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-card">
        <div className="fp-header">
          <div className="fp-logo">EKC</div>
          <h2>Forgot Password</h2>
          <p className="fp-subtitle">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {error && <p className="fp-error">{error}</p>}

        {success ? (
          <div className="fp-success-box">
            <div className="fp-success-icon">✉</div>
            <h3>Check your inbox</h3>
            <p>
              A password reset link has been sent to <strong>{email}</strong>.
              Check your spam folder if you don't see it.
            </p>
            <button className="fp-back-btn" onClick={() => navigate("/signin")}>
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            <form className="fp-form" onSubmit={handleSubmit}>
              <div className="fp-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="fp-btn" disabled={loading}>
                {loading ? (
                  <span className="fp-btn-loading">
                    <span className="fp-spinner"></span> Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <p className="fp-footer">
              Remember your password?{" "}
              <span onClick={() => navigate("/signin")}>Sign In</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
