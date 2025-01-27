import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import Logo from "../../components/Logo";
import GoogleIcon from "../../components/GoogleIcon";
import "./Auth.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loginUser } = useContext(AuthContext);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (response.ok) {
        alert("Account created successfully! Logging you in...");
        loginUser({
          preventDefault: () => {},
          target: {
            username: { value: username },
            password: { value: password },
          },
        });
      } else {
        const data = await response.json();
        alert(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <Logo className="custom-logo" />
      <h1 className="auth-title">Sign Up</h1>
      <form className="auth-form" onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Enter Username"
          className="auth-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="auth-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button primary">
          Sign Up with Email
        </button>
        <div className="auth-divider">
          <span>or</span>
        </div>
        <button type="button" className="auth-button google">
          <GoogleIcon className="google-icon" />
          Sign up with Google
        </button>
      </form>
      <p className="auth-footer">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default SignUp;
