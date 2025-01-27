import React from "react";
import { Link } from "react-router-dom"; // Added Link for navigation
import "./Logo.css";
import logo from "../assets/images/logo-icon.png"; // Import the image file

function Logo() {
  return (
    <Link to="/" className="logo-container">
      <img src={logo} alt="Site Logo" />
      <span className="logo-text">
        <span className="highlight">fye</span>nance
      </span>
    </Link>
  );
}

export default Logo;
