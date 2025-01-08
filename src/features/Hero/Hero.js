import React from "react";
import "./Hero.css";

function Hero () {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Keep an <span className="hero-phrase">eye</span> on your
          money
        </h1>
        {/* Button Above the Video */}
        <button className="hero-btn">Get Started</button>
        <video className="hero-video" controls>
          <source src="" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
</section>
  );
};

export default Hero;
