import React from "react";
import "./Greeting.css";

function Greeting({ user }) {
  const currentHour = new Date().getHours();
  let greeting = "Good Morning";

  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good Evening";
  }

  return (
    <div className="greeting-text">
      <h1>{greeting}, {user ? user.name : "Guest"}!</h1>
    </div>
  );
}

export default Greeting;
