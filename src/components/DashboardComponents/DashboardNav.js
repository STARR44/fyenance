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

// import React, { useState, useEffect, useRef } from "react"; // Added useState for menu toggle
// import { Link } from "react-router-dom"; // Import Link from react-router-dom
// import { FaBell } from "react-icons/fa"; // Import icons from React Icons
// import { FaRegUserCircle } from "react-icons/fa"; // Import circular profile icon
// import { BsSun } from "react-icons/bs";
// import { FaSun, FaSignOutAlt } from "react-icons/fa"; // Added icons for Settings, Light Mode, and Logout
// import Logo from "../Logo"; // Import the Logo component
// import "./DashboardNav.css"; // Import the CSS file for styling

// function DashboardNav({ user }) {
//   const [showMenu, setShowMenu] = useState(false); // Added state to track dropdown visibility
//   const [activeLink, setActiveLink] = useState("/dashboard"); // <-- Added this state to track the active link
//   const menuRef = useRef(null); // Added useRef to track the dropdown menu element

//   const toggleMenu = () => {
//     setShowMenu((prev) => !prev); // Toggle the dropdown menu visibility
//     // setShowMenu(!showMenu); // Added function to toggle dropdown menu
//   };

//   // Added useEffect to close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowMenu(false); // Close the menu if clicked outside
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside); // Added event listener for clicks outside
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside); // Clean up event listener on unmount
//     };
//   }, []);

//   // function to update the active link state
//   const handleLinkClick = (link) => {
//     setActiveLink(link); // Update the active link
//   };

//   return (
//     <nav className="dashboard-nav">
//       <Logo /> {/* This will display the logo */}
//       <ul className="dash-nav">
//         <li>
//           <Link
//             to="/dashboard"
//             className={activeLink === "/dashboard" ? "active" : ""} // Conditionally apply the active class
//             onClick={() => handleLinkClick("/dashboard")} // Call handleLinkClick on click
//           >
//             Dashboard
//           </Link>
//           {/* <a href="/dashboard" className="active">
//             Dashboard
//           </a> */}
//         </li>
//         <li>
//           <Link
//             to="/budget"
//             className={activeLink === "/budget" ? "active" : ""} // Conditionally apply the active class
//             onClick={() => handleLinkClick("/budget")} // Call handleLinkClick on click
//           >
//             Budgets
//           </Link>
//         </li>
//         <li>
//           <Link
//             to="/transactions"
//             className={activeLink === "/transactions" ? "active" : ""} // Conditionally apply the active class
//             onClick={() => handleLinkClick("/transactions")} // Call handleLinkClick on click
//           >
//             Transactions
//           </Link>
//           {/* <Link to="/transactions">Transactions</Link> */}
//         </li>
//       </ul>
//       <div className="icons">
//         <FaBell size={20} /> {/* Notification Icon */}
//         {/* {showMenu && ( // Added conditional rendering for dropdown menu, also, added Profile Section */}
//         <div className="profile" onClick={toggleMenu} ref={menuRef}>
//           <FaRegUserCircle size={20} /> {/* Profile Icon */}
//           {showMenu && (
//             //Dropdown menu for profile options
//             <div className="profile-menu">
//               {/* Profile icon and username section */}
//               <p className="profile-info">
//                 <FaRegUserCircle size={20} /> {/* Profile Icon */}
//                 <strong>{user ? user.name : "Guest"}</strong>{" "}
//                 {/* Display username */}
//               </p>{" "}
//               {/* Placeholder for username */}
//               <p className="email-text">
//                 {user ? user.email : "Guest@example.com"}
//               </p>{" "}
//               {/* Placeholder for email */}
//               <hr /> {/* Divider */}
//               <p>
//                 <BsSun size={16} color="B2BEB5" /> Light mode
//               </p>{" "}
//               {/* Lightmode icon next to text */}
//               <Link to="/settings" className="settings-link">
//                 <p>
//                   <FaSun size={16} /> Settings
//                 </p>{" "}
//               </Link>
//               {/* Settings icon next to text */}
//               <p>
//                 <FaSignOutAlt size={16} /> Logout
//               </p>{" "}
//               {/* Logout icon next to text */}
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default DashboardNav;
