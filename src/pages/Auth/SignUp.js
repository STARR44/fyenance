// src/pages/signup.js
import React, { useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext"; // Import useGlobal to access signup function
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";
import GoogleIcon from "../../components/GoogleIcon";
import "./auth.css";

const Signup = () => {
  const { handleSignup, loading, error } = useGlobalContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // Use useNavigate for redirecting users to login

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        await handleSignup(username, email, password); // Handle signup from GlobalContext
        navigate("/login"); // Redirect to login after successful signup
      } catch (err) {
        console.error("Signup error", err);
      }
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div className="auth-container">
      <Logo />
      <h1 className="auth-title">Sign Up</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Username"
          className="auth-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="auth-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className="auth-error">{error}</p>}{" "}
        {/* Display error message */}
        <button
          type="submit"
          className="auth-button primary"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up with Email"}
        </button>
        <div className="auth-divider">
          <span>or</span>
        </div>
        <button type="button" className="auth-button google">
          <GoogleIcon className="google-icon" />{" "}
          {/* Pass className to inline SVG */}
          Sign up with Google
        </button>
        {/* <button type="button" className="auth-button google">
          <img src={googleIcon} alt="Google" className="google-icon" />
          Sign up with Google
        </button> */}
      </form>
      <p className="auth-footer">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
