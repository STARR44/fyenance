import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom"; // Added useLocation for automatic active link handling
import { FaBell, FaRegUserCircle, FaSun, FaSignOutAlt } from "react-icons/fa";
import { BsSun } from "react-icons/bs";
import Logo from "../Logo";
import "./DashboardNav.css";

function DashboardNav({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation(); // Track current location for active link logic

  const toggleMenu = () => setShowMenu((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="dashboard-nav">
      <Logo />
      <ul className="dash-nav">
        <li>
          <Link
            to="/dashboard"
            className={isActive("/dashboard") ? "active" : ""}
            aria-label="Dashboard"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/budget"
            className={isActive("/budget") ? "active" : ""}
            aria-label="Budgets"
          >
            Budgets
          </Link>
        </li>
        <li>
          <Link
            to="/transactions"
            className={isActive("/transactions") ? "active" : ""}
            aria-label="Transactions"
          >
            Transactions
          </Link>
        </li>
      </ul>
      <div className="icons">
        <FaBell size={20} aria-label="Notifications" />
        <div
          className="profile"
          onClick={toggleMenu}
          ref={menuRef}
          aria-label="Profile"
        >
          <FaRegUserCircle size={20} />
          {showMenu && (
            <div className="profile-menu">
              <p className="profile-info">
                <FaRegUserCircle size={20} />
                <strong>{user ? user.name : "Guest"}</strong>
              </p>
              <p className="email-text">
                {user ? user.email : "guest@example.com"}
              </p>
              <hr />
              <p>
                <BsSun size={16} color="B2BEB5" /> Light mode
              </p>
              <Link to="/settings" className="settings-link">
                <p>
                  <FaSun size={16} /> Settings
                </p>
              </Link>
              <p>
                <FaSignOutAlt size={16} /> Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default DashboardNav;

