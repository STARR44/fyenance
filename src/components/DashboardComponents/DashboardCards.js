import React, { useState } from "react";
import { useCurrency } from "../../context/currencyContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { useGlobalContext } from "../../context/GlobalContext";
import "./DashboardCards.css";

function DashboardCards() {
  const { balance, cashFlow, budgets, categories, transactions } = useGlobalContext();
  const { currency } = useCurrency();
  const [activeSegment, setActiveSegment] = useState("cashflow");

  if (!cashFlow || !Array.isArray(categories) || !Array.isArray(budgets)) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-cards">
      {/* Total Balance Card */}
      <div className="card total-balance-card">
        <h3>Total Balance</h3>
        <p className="balance-placeholder">{formatCurrency(balance, currency)}</p>
      </div>

      {/* Cashflow and Budget Card */}
      <div className="card cashflow-budget-card">
        <div className="header-container">
          <div
            className={`header ${activeSegment === "cashflow" ? "active" : ""}`}
            onClick={() => setActiveSegment("cashflow")}
          >
            <h3>CashFlow</h3>
          </div>
          <div
            className={`header ${activeSegment === "budget" ? "active" : ""}`}
            onClick={() => setActiveSegment("budget")}
          >
            <h3>Budget</h3>
          </div>
        </div>
        <div className="content">
          {activeSegment === "cashflow" ? (
            <div className="cashflow-content active">
              <div className="content-item">
                <p className="income-text">Income</p>
                <p className="amount">{formatCurrency(cashFlow.income, currency)}</p>
              </div>
              <div className="content-item">
                <p className="expenses-text">Expenses</p>
                <p className="amount">{formatCurrency(cashFlow.expenses, currency)}</p>
              </div>
            </div>
          ) : (
            <div className="budget-content active">
              {budgets.slice(0, 2).map((budget) => (
                <div key={budget.id} className="budget-item">
                  <p className="budget-name">{budget.name}</p>
                  <p className="amount-left">{formatCurrency(budget.amount_left, currency)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories Card */}
      <div className="card categories-card">
        <h3>Categories</h3>
        <div className="progress-bar single-bar">
          {categories
            .filter((cat) => typeof cat.percentage === "number" && cat.percentage > 0)
            .map((category) => (
              <div
                key={category.id}
                className="progress-segment"
                style={{
                  width: `${category.percentage}%`,
                  backgroundColor: category.color,
                  minWidth: `${Math.max(category.percentage, 1)}%`,
                }}
              ></div>
            ))}
        </div>
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-item">
              <div className="category-header">
                <div
                  className="color-circle"
                  style={{ backgroundColor: category.color }}
                ></div>
                <p className="category-name">{category.name}</p>
              </div>
              <p className="percentage">
                {typeof category.percentage === "number"
                  ? `${category.percentage.toFixed(0)}%`
                  : "0%"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;



// import React, { useState } from "react";
// import { useCurrency } from "../../context/currencyContext";
// import { formatCurrency } from "../../utils/formatCurrency";
// import { useGlobalContext } from "../../context/GlobalContext";
// import "./DashboardCards.css";

// function DashboardCards() {
//   const { balance, cashFlow, budgets, categories, transactions } = useGlobalContext();
//   const { currency } = useCurrency();
//   const [activeSegment, setActiveSegment] = useState("cashflow");

//   if (!cashFlow || !Array.isArray(categories) || !Array.isArray(budgets)) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="dashboard-cards">
//       {/* Total Balance Card */}
//       <div className="card total-balance-card">
//         <h3>Total Balance</h3>
//         <p className="balance-placeholder">{formatCurrency(balance, currency)}</p>
//       </div>

//       {/* Cashflow and Budget Card */}
//       <div className="card cashflow-budget-card">
//         <div className="header-container">
//           <div
//             className={`header ${activeSegment === "cashflow" ? "active" : ""}`}
//             onClick={() => setActiveSegment("cashflow")}
//           >
//             <h3>CashFlow</h3>
//           </div>
//           <div
//             className={`header ${activeSegment === "budget" ? "active" : ""}`}
//             onClick={() => setActiveSegment("budget")}
//           >
//             <h3>Budget</h3>
//           </div>
//         </div>
//         <div className="content">
//           {activeSegment === "cashflow" ? (
//             <div className="cashflow-content active">
//               <div className="content-item">
//                 <p className="income-text">Income</p>
//                 <p className="amount">{formatCurrency(cashFlow.income, currency)}</p>
//               </div>
//               <div className="content-item">
//                 <p className="expenses-text">Expenses</p>
//                 <p className="amount">{formatCurrency(cashFlow.expenses, currency)}</p>
//               </div>
//             </div>
//           ) : (
//             <div className="budget-content active">
//               {budgets.slice(0, 2).map((budget) => (
//                 <div key={budget.id} className="budget-item">
//                   <p className="budget-name">{budget.name}</p>
//                   <p className="amount-left">{formatCurrency(budget.amountLeft, currency)}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Categories Card */}
//       <div className="card categories-card">
//         <h3>Categories</h3>
//         <div className="progress-bar single-bar">
//           {categories
//             .filter((cat) => typeof cat.percentage === "number" && cat.percentage > 0)
//             .map((category) => (
//               <div
//                 key={category.id}
//                 className="progress-segment"
//                 style={{
//                   width: `${category.percentage}%`,
//                   backgroundColor: category.color,
//                   minWidth: `${Math.max(category.percentage, 1)}%`,
//                 }}
//               ></div>
//             ))}
//         </div>
//         <div className="categories-grid">
//           {categories.map((category) => (
//             <div key={category.id} className="category-item">
//               <div className="category-header">
//                 <div
//                   className="color-circle"
//                   style={{ backgroundColor: category.color }}
//                 ></div>
//                 <p className="category-name">{category.name}</p>
//               </div>
//               <p className="percentage">
//                 {typeof category.percentage === "number"
//                   ? `${category.percentage.toFixed(0)}%`
//                   : "0%"}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DashboardCards;









// import React, { useState } from "react";
// import { useCurrency } from "../../context/currencyContext"; // Use the Currency context
// import { formatCurrency } from "../../utils/formatCurrency"; // Import the utility function
// import { useGlobalContext } from "../../context/GlobalContext";
// import "./DashboardCards.css";

// function DashboardCards() {
//   const { balance, cashFlow, budgets, categories, transactions } =
//     useGlobalContext();
//   const { currency } = useCurrency(); // Access the current currency
//   const [activeSegment, setActiveSegment] = useState("cashflow");

//   // Prevents 'undefined' errors when data is still loading
//   if (!cashFlow || !Array.isArray(categories) || !Array.isArray(budgets)) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="dashboard-cards">
//       {/* Total Balance Card */}
//       <div className="card total-balance-card">
//         <h3>Total Balance</h3>
//         <p className="balance-placeholder">
//           {formatCurrency(balance, currency)}
//         </p>
//       </div>

//       {/* Cashflow and Budget Card */}
//       <div className="card cashflow-budget-card">
//         <div className="header-container">
//           <div
//             className={`header ${activeSegment === "cashflow" ? "active" : ""}`}
//             onClick={() => setActiveSegment("cashflow")}
//           >
//             <h3>CashFlow</h3>
//           </div>
//           <div
//             className={`header ${activeSegment === "budget" ? "active" : ""}`}
//             onClick={() => setActiveSegment("budget")}
//           >
//             <h3>Budget</h3>
//           </div>
//         </div>

//         <div className="content">
//           {activeSegment === "cashflow" ? (
//             <div className="cashflow-content active">
//               <div className="content-item">
//                 <p className="income-text">Income</p>
//                 <p className="amount">
//                   {formatCurrency(cashFlow.income, currency)}
//                 </p>
//               </div>
//               <div className="content-item">
//                 <p className="expenses-text">Expenses</p>
//                 <p className="amount">
//                   {formatCurrency(cashFlow.expenses, currency)}
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="budget-content active">
//               {budgets.length > 0 ? (
//                 budgets.slice(0, 2).map((budget) => (
//                   <div key={budget.id} className="budget-item">
//                     <p className="budget-name">{budget.name}</p>
//                     <div className="amount-row">
//                       <p className="amount-left-label">Amount Left:</p>
//                       <p className="amount-value">
//                         {formatCurrency(budget.amountLeft, currency)}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p>No active budgets</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

      // {/* Categories Card */}
      // <div className="card categories-card">
      //   <h3>Categories</h3>

      //   {/* Progress Bar */}
      //   <div className="progress-bar single-bar">
      //     {transactions.length === 0 ||
      //     !categories.some((category) => category.percentage > 0) ? (
      //       <div
      //         className="progress-segment"
      //         style={{
      //           width: "100%",
      //           backgroundColor: "#ccc",
      //         }}
      //       ></div>
      //     ) : (
      //       categories
      //         .filter((category) => category.percentage > 0) // Only show categories with transactions
      //         .map((category) => (
      //           <div
      //             key={category.id}
      //             className="progress-segment"
      //             style={{
      //               width: `${category.percentage}%`,
      //               backgroundColor: category.color,
      //               minWidth:
      //                 category.percentage > 0
      //                   ? `${category.percentage}%`
      //                   : "4px",
      //             }}
      //           ></div>
      //         ))
      //     )}
      //   </div>

//         {/* Categories Grid */}
//         <div className="categories-grid">
//           {categories.map((category) => {
//             // Find if the category has related transactions
//             const hasTransactions = transactions.some(
//               (transaction) => transaction.categoryId === category.id
//             );

//             return (
//               <div key={category.id} className="category-item">
//                 <div className="category-header">
//                   <div
//                     className="color-circle"
//                     style={{
//                       backgroundColor: category.color,
//                       opacity: hasTransactions ? 1 : 0.4, // Reduce opacity for unused categories
//                     }}
//                   ></div>
//                   <p className="category-name">{category.name}</p>
//                 </div>
//                 <p className="percentage">
//                   {transactions.length === 0
//                     ? "0%"
//                     : category.percentage > 0
//                     ? category.percentage.toFixed(0) + "%"
//                     : "0%"}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DashboardCards;
