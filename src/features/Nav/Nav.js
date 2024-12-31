import React from "react";
import { Link } from "react-router-dom"; // Import Link for routing
import "./Nav.css";
import Logo from "../../components/Logo"; 

function Nav() {
  return (
    <nav className="navbar">
      <Logo />
      <ul className="nav-links">
        <li>
        <Link to="/about" className="nav-link">About Us</Link> {/* Link instead of a */}
        </li>
      </ul>
      <div className="nav-buttons">
        <button>Signup</button>
        <button>Login</button>
      </div>
    </nav>
  );
}

export default Nav;
