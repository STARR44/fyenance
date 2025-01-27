import React from "react";
import Logo from "../../components/Logo"; // Importing the Logo component
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      {/* Logo section */}
      <section className="footer-logo-container">
        <Logo /> {/* Logo imported and reused */}
        {/* Subtitle under the logo */}
        <p className="footer-subtitle">
          Keep an <span className="footer-unique-color">eye</span> on your money
        </p>
      </section>
      <p className="footer-copyright">&copy; copyright 2024 fyenance.</p>
    </footer>
  );
}

export default Footer;
