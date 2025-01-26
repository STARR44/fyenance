// src/components/DashboardComponents/DropdownMenu.js

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Using useNavigate from v6

const DropdownMenu = ({ isDropdownVisible, setDropdownVisible }) => {
  const navigate = useNavigate(); // Using useNavigate from v6
  const dropdownRef = useRef(null); // Ref to track the dropdown element

  const handleNavigate = (page) => {
    setDropdownVisible(false); // Close the dropdown after selection
    navigate(page); // Navigate to the selected page
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setDropdownVisible]);

  if (!isDropdownVisible) return null; // Don't render the dropdown if it's not visible

  return (
    <div ref={dropdownRef} className="add-dropdown">
      <ul>
        <li onClick={() => handleNavigate("/transactions")}>Add Transaction</li>
        <li onClick={() => handleNavigate("/budget")}>Add Budget</li>
        <li onClick={() => handleNavigate("/settings?tab=general")}>Add Category</li> 
      </ul>
    </div>
  );
};

export default DropdownMenu;
