import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext"; // Import AuthContext
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";
import GoogleIcon from "../../components/GoogleIcon";
import "./Auth.css";

const Login = () => {
  const { loginUser } = useContext(AuthContext); // Get loginUser from AuthContext
  const [identifier, setIdentifier] = useState(""); // For username or email
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call loginUser with a custom form structure
    const form = new FormData();
    form.append("username", identifier);
    form.append("password", password);
    loginUser({
      preventDefault: () => {},
      target: {
        username: { value: identifier },
        password: { value: password },
      },
    });
  };

  return (
    <div className="auth-container">
      <Logo className="custom-logo" />
      <h1 className="auth-title">Login</h1>
      <form className="auth-form login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Username"
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
        <button type="submit" className="auth-button primary">
          Sign in
        </button>
        <div className="auth-divider">
          <span>or</span>
        </div>
        <button type="button" className="auth-button google">
          <GoogleIcon className="google-icon" />
          Sign in with Google
        </button>
      </form>
      <p className="auth-footer">
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Login;