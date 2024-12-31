// src/pages/DashboardPages/MainDashboard.js
import React, { useState, useEffect } from "react"; // React for component creation and useState for state management

import {
  DashboardNav, // Navigation bar component for the dashboard
  ActionLinks, // Component with action buttons
  Greeting, // Component for greeting the user
  NewUserPlaceholder, // Placeholder content for new users
} from "../../components/DashboardComponents";
import { FaPlus } from "react-icons/fa"; // Import the plus icon from react-icons
import DashboardCards from "../../components/DashboardComponents/DashboardCards"; // Import the new component
import "./MainDashboard.css"; // Import styles specific to the dashboard page

function DashboardPage() {
  // Placeholder user details (To be replaced with real authentication data later)
  const [user] = useState({
    name: "John Doe", // Example username
    email: "johndoe@example.com",
  });

  
  // State to track the completion of specific user actions
  const [actionsCompleted, setActionsCompleted] = useState({
    addTransaction: false, // Tracks if "Add a Transaction" is completed
    addBudget: false, // Tracks if "Create a Budget" is completed
    linkBankAccount: false, // Tracks if "Link a Bank Account" is completed
  });

  // Fetch user data from the API when the component mounts

  // Load data from localStorage for actions
  useEffect(() => {
    const savedActions = localStorage.getItem("actionsCompleted");
    if (savedActions) {
      setActionsCompleted(JSON.parse(savedActions)); // Parse and set the saved data
    }
  }, []); // Empty dependency array ensures this runs only on mount

  // Save data to localStorage whenever actionsCompleted state changes
  useEffect(() => {
    localStorage.setItem("actionsCompleted", JSON.stringify(actionsCompleted));
  }, [actionsCompleted]); // Runs every time actionsCompleted changes

  // Checks if at least one action is completed
  const hasActions = Object.values(actionsCompleted).some(
    (isCompleted) => isCompleted
  ); // Checks if at least one action is completed

  // const handleActionClick = () => {
  //   setHasActions(true); // Updates the state when an action is taken
  // };

  const handleActionComplete = (action) => {
    setActionsCompleted((prevState) => ({
      ...prevState,
      [action]: true,
    })); // Marks the specific action as completed
  };

  return (
    <div className="dashboard-page">
      <DashboardNav user={user} /> {/* Pass user data to DashboardNav */}
      <div className="dashboard-content">
        {/* Conditional rendering based on whether actions have been completed */}
        {!hasActions ? (
          <>
            <NewUserPlaceholder />{" "}
            {/* Render placeholder content and action buttons for new users */}
            <ActionLinks onActionComplete={handleActionComplete} />{" "}
            {/* Actions to be taken by users */}
          </>
        ) : (
          <div>
            {/* Greeting and Add Button Container */}
            <div className="greeting-and-add-container">
              {/* Greeting Message */}
              <Greeting user={user} /> {/* Greeting based on user data */}
              {/* Add Button */}
              <button className="add-button">
                {" "}
                Add
                <FaPlus size={18} className="plus-icon" />{" "}
                {/* React icon for "+" */}
              </button>
            </div>
            {/* Cards and Tables will go here (to be added later) */}
            <DashboardCards /> {/* Render the cards */}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
