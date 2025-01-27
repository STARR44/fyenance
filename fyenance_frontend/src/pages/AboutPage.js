import React from "react";
import "./AboutPage.css";
import Logo from "../components/Logo"; // Importing the Logo component
import CTA from "../features/CTA/CTA";

function AboutPage() {
  return (
    <div className="about-page">
      <header className="about-header">
        <Logo />
      </header>

      <main className="about-content">
        <hr className="faint-line" /> {/* Added faint line before heading */}
        <h3>
          Welcome to <span className="highlight-text">fye</span>
          <span className="feynance">nance</span>
        </h3>
        <hr className="faint-line" /> {/* Added faint line after heading */}
        <p className="first-paragraph">
          fyenance is an intuitive web app designed to help you manage your
          expenses and take control of your finances. Our mission is to empower
          you to live a debt-free life by providing the tools to easily track
          and optimize your spending.
        </p>
        <p className="second-paragraph">
          Whether you’re exploring our landing page, signing up for an account,
          or learning more about personal finance, we’re excited to be part of
          your journey toward financial freedom. This project is built with{" "}
          <strong>React</strong>, a powerful JavaScript library that ensures a
          smooth, interactive, and organized experience, and{" "}
          <strong>Django</strong>, a robust Python framework, which powers our
          secure and scalable backend.
        </p>
        <p className="mission-text">
          <strong>Our Mission:</strong> To provide a simple, user-friendly
          interface with refreshing mint green aesthetics, making your financial
          management experience enjoyable and efficient.{" "}
          <span role="img" aria-label="smiling face">
            😊
          </span>
        </p>
      </main>
      {/* CTA section inside main */}
    
      <CTA /> 
      <footer className="about-footer">
        <Logo />
      </footer>
    </div>
  );
}

export default AboutPage;
