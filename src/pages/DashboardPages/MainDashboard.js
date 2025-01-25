import React, { useState, useContext } from "react";
import {
  DashboardNav,
  ActionLinks,
  Greeting,
  NewUserPlaceholder,
} from "../../components/DashboardComponents";
import { FaPlus } from "react-icons/fa";
import DropdownMenu from "../../components/DashboardComponents/DropdownMenu";
import DashboardCards from "../../components/DashboardComponents/DashboardCards";
import RecentTransactions from "../../components/RecentTransactions";
import OverlaySpinner from "../../components/DashboardComponents/OverlaySpinner";
import { useGlobalContext } from "../../context/GlobalContext"; // Import global context
import AuthContext from "../../context/AuthContext";
import "./MainDashboard.css";

function DashboardPage() {
  // Access user from AuthContext
  const { user } = useContext(AuthContext);

  // Access global state from GlobalContext
  const { transactions, budgets, categories } = useGlobalContext();

  // Local state for dropdown visibility
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // Determine if the user has completed any actions or saved data
  const hasActions =
    transactions.length > 0 || budgets.length > 0; // Modify as per your conditions

  return (
    <div className="dashboard-page">
      <OverlaySpinner isLoading={!user || !categories.length} /> {/* Show spinner if data is loading */}
      <DashboardNav user={user} />
      <div className="dashboard-content">
        {!user || !hasActions ? ( // Show new user dialog if no actions completed
          <>
            <NewUserPlaceholder />
            <ActionLinks
              onActionComplete={() => {
                console.log("Action completed");
              }}
              isLoading={false} // Adjust loading logic if necessary
            />
          </>
        ) : (
          <div>
            <div className="greeting-and-add-container">
              <Greeting user={user} />
              <button
                className="add-button"
                onClick={() => setDropdownVisible(!isDropdownVisible)} // Toggle dropdown visibility
              >
                Add
                <FaPlus size={18} className="plus-icon" />
              </button>
              <DropdownMenu
                isDropdownVisible={isDropdownVisible}
                setDropdownVisible={setDropdownVisible}
              />
            </div>
            <DashboardCards categories={categories} /> {/* Show dashboard cards */}
            <RecentTransactions transactions={transactions} /> {/* Recent transactions */}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;





// // src/pages/DashboardPages/MainDashboard.js

// import React, { useState } from "react"; // Removed axios and useEffect as APIs are no longer needed
// import {
//   DashboardNav, // Navigation bar component for the dashboard
//   ActionLinks, // Component with action buttons
//   Greeting, // Component for greeting the user
//   NewUserPlaceholder, // Placeholder content for new users
// } from "../../components/DashboardComponents";
// import { FaPlus } from "react-icons/fa"; // Import the plus icon from react-icons
// import DropdownMenu from "../../components/DashboardComponents/DropdownMenu";
// import DashboardCards from "../../components/DashboardComponents/DashboardCards"; // Import the new component
// import RecentTransactions from "../../components/RecentTransactions"
// import OverlaySpinner from "../../components/DashboardComponents/OverlaySpinner"; // Spinner component for loading state
// import "./MainDashboard.css"; // Import styles specific to the dashboard page

// function DashboardPage() {
//   // State hooks for managing the dashboard data
//   const [user] = useState({
//     name: "John Doe", // Example username
//     email: "johndoe@example.com",
//   });

//   const [actionsCompleted, setActionsCompleted] = useState({
//     addTransaction: false, // Tracks if the 'Add Transaction' action is done
//     addBudget: false, // Tracks if the 'Add Budget' action is done
//     linkBankAccount: false, // Tracks if the 'Link Bank Account' action is done
//   });

//   // State to control dropdown visibility for the Add button for old users
//   const [isDropdownVisible, setDropdownVisible] = useState(false);

//   // Check if any action has been completed (for determining user status)
//   const hasActions = Object.values(actionsCompleted).some(
//     (isCompleted) => isCompleted
//   );

//   // Handle action completion ( Add Transaction, Budget...)
//   const handleActionComplete = (action) => {
//     setActionsCompleted((prevState) => ({
//       ...prevState,
//       [action]: true,
//     }));
//   };

//   return (
//     <div className="dashboard-page">
//       <OverlaySpinner isLoading={false} /> {/* Removed loading state */}
//       <DashboardNav user={user} />
//       <div className="dashboard-content">
//         {!user || !hasActions ? (
//           <>
//             <NewUserPlaceholder />
//             <ActionLinks
//               onActionComplete={handleActionComplete}
//               isLoading={false} // Removed loading state
//             />
//           </>
//         ) : (
//           <div>
//             <div className="greeting-and-add-container">
//               <Greeting user={user} />
//               <button
//                 className="add-button"
//                 onClick={() => setDropdownVisible(!isDropdownVisible)} // Toggle dropdown for Add Button
//               >
//                 Add
//                 <FaPlus size={18} className="plus-icon" />
//               </button>
//               {/* Pass the state and function to DropdownMenu for the Add button */}
//               <DropdownMenu
//                 isDropdownVisible={isDropdownVisible}
//                 setDropdownVisible={setDropdownVisible}
//               />
//             </div>

//             <DashboardCards />
//             <RecentTransactions />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default DashboardPage;
