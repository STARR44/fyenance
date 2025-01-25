// src/pages/login.js
import React, { useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext"; // Import useGlobal to access login function
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../components/Logo";
import GoogleIcon from "../../components/GoogleIcon";
import "./auth.css";

const Login = () => {
  const { handleLogin, loading, error } = useGlobalContext();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(identifier, password);
      navigate("/dashboard"); // Redirect after login
    } catch (err) {
      console.error("Login error", err);
    }
  };
  return (
    <div className="auth-container">
      <Logo />
      <h1 className="auth-title">Login</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Username or Email"
          className="auth-input"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="auth-error">{error}</p>}{" "}
        {/* Display error message */}
        <button
          type="submit"
          className="auth-button primary"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign in"}
        </button>
        <div className="auth-divider">
          <span>or</span>
        </div>
        <button type="button" className="auth-button google">
          <GoogleIcon className="google-icon" />{" "}
          {/* Pass className to your inline SVG */}
          Sign in with Google
        </button>
        {/* <button type="button" className="auth-button google">
          <img src={googleIcon} alt="Google" className="google-icon" />
          Sign in with Google
        </button> */}
      </form>
      <p className="auth-footer">
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Login;
