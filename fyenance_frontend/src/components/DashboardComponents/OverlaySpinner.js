// src/components/OverlaySpinner.js
import React from "react";
import { Circles } from "react-loader-spinner"; // spinner style
import "./OverlaySpinner.css"; // Overlay styles here

function OverlaySpinner({ isLoading }) {
  if (!isLoading) return null; // Don't render if not loading

  return (
    <div className="overlay-spinner">
      <div className="spinner-container">
        <Circles height="80" width="80" color="#4ECC5A" />
      </div>
    </div>
  );
}

export default OverlaySpinner;
