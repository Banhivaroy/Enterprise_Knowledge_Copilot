import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase.js";
import {doc,setDoc} from "firebase/firestore"

function SignUp() {
  const navigate = useNavigate();
    const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        createdAt: new Date(),
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
        <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>
        <p className="subtitle">
          Start your journey with Enterprise Knowledge Copilot
        </p>

        {error && <p className="error-message">{error}</p>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          
          {formData.confirmPassword && (
            <p className={`password-match ${formData.password === formData.confirmPassword ? "match" : "no-match"}`}>
              {formData.password === formData.confirmPassword
                ? "Passwords match"
                : "Passwords do not match"}
            </p>
          )}

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="footer-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/signin")}>Sign In</span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
