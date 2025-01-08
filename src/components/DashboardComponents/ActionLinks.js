import React from "react"; // Import React for creating the component
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./ActionLinks.css"; // Action link-specific styles

function ActionLinks({ onActionComplete }) {
  const navigate = useNavigate(); // Initialize navigation

  const handleLinkBankAccount = () => {
    // Navigate to Settings with the Financial tab active
    navigate("/settings?tab=financial-data");
  };

  return (
    <div className="action-links">
      {/* Button to handle "Add a Transaction" action */}
      <p className="action-text" onClick={() => onActionComplete("addTransaction")}>
        Add a Transaction
      </p>

      {/* Button to handle "Add a Budget" action */}
      <p className="action-text" onClick={() => onActionComplete("addBudget")}>
        Add a Budget
      </p>

      {/* Button to handle "Link a Bank Account" action */}
      <p className="link-bank" onClick={handleLinkBankAccount}>
        Link a Bank Account in <span className="settings-link">Settings</span>
      </p>
    </div>
  );
}

export default ActionLinks;














// import React from "react";  // Import React for creating the component
// import "./ActionLinks.css"; // Action link-specific styles

// function ActionLinks({ onActionComplete }) {
//   return (
//     <div className="action-links">
//       {/* Button to handle "Add a Transaction" action */}
//       <p className="action-text" onClick={() => onActionComplete("addTransaction")}>
//         Add a Transaction
//       </p>
//       {/* Button to handle "Add a Budget" action */}
//       <p className="action-text" onClick={() => onActionComplete("addBudget")}>
//         Add a Budget
//       </p>
//       {/* Button to handle "Link a Bank Account" action */}
//       <p className="link-bank" onClick={() => onActionComplete("linkBankAccount")}>
//         Link a Bank Account in <span className="settings-link">Settings</span>
//       </p>
//     </div>
//   );
// }

// export default ActionLinks;
