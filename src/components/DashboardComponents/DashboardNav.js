import React, { useState, useEffect, useRef } from "react"; // Added useState for menu toggle
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { FaBell } from "react-icons/fa"; // Import icons from React Icons
import { FaRegUserCircle } from "react-icons/fa"; // Import circular profile icon
import { BsSun } from "react-icons/bs";
import { FaSun, FaSignOutAlt } from "react-icons/fa"; // Added icons for Settings, Light Mode, and Logout
import Logo from "../Logo"; // Import the Logo component
import "./DashboardNav.css"; // Import the CSS file for styling

function DashboardNav({ user }) {
  const [showMenu, setShowMenu] = useState(false); // Added state to track dropdown visibility
  const menuRef = useRef(null); // Added useRef to track the dropdown menu element

  const toggleMenu = () => {
    setShowMenu((prev) => !prev); // Toggle the dropdown menu visibility
    // setShowMenu(!showMenu); // Added function to toggle dropdown menu
  };

  // Added useEffect to close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false); // Close the menu if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Added event listener for clicks outside
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up event listener on unmount
    };
  }, []);

  return (
    <nav className="dashboard-nav">
      <Logo /> {/* This will display the logo */}
      <ul className="dash-nav">
        <li>
          <a href="/dashboard" className="active">
            Dashboard
          </a>
        </li>
        <li>
          <Link to="/budget">Budgets</Link>
        </li>
        <li>
          <Link to="/transactions">Transactions</Link>
        </li>
      </ul>
      <div className="icons">
        <FaBell size={20} /> {/* Notification Icon */}
        {/* {showMenu && ( // Added conditional rendering for dropdown menu, also, added Profile Section */}
        <div className="profile" onClick={toggleMenu} ref={menuRef}>
          <FaRegUserCircle size={20} /> {/* Profile Icon */}
          {showMenu && (
            //Dropdown menu for profile options
            <div className="profile-menu">
              {/* Profile icon and username section */}
              <p className="profile-info">
                <FaRegUserCircle size={20} /> {/* Profile Icon */}
                <strong>{user ? user.name : "Guest"}</strong>{" "}
                {/* Display username */}
              </p>{" "}
              {/* Placeholder for username */}
              <p className="email-text">
                {user ? user.email : "Guest@example.com"}
              </p>{" "}
              {/* Placeholder for email */}
              <hr /> {/* Divider */}
              <p>
                <BsSun size={16} color="B2BEB5" /> Light mode
              </p>{" "}
              {/* Lightmode icon next to text */}
              <Link to="/settings" className="settings-link">
                <p>
                  <FaSun size={16} /> Settings
                </p>{" "}
              </Link>
              {/* Settings icon next to text */}
              <p>
                <FaSignOutAlt size={16} /> Logout
              </p>{" "}
              {/* Logout icon next to text */}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default DashboardNav;
