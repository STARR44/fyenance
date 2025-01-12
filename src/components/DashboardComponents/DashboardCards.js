// src/components/DashboardComponents/DashboardCards.js
import React, { useState } from "react";
// import TransactionForm from "../TransactionForm";
import "./DashboardCards.css"; // styles for the cards here

function DashboardCards() {
  const [activeSegment, setActiveSegment] = useState("cashflow");
  const [transactions, setTransactions] = useState([
    { type: "income", amount: 5000, category: "Food" }, // Hardcoded for testing purposes
    { type: "expense", amount: 2000, category: "Food" },
    { type: "expense", amount: 1500, category: "Transportation" },
    { type: "income", amount: 7000, category: "Subscriptions" },
    { type: "expense", amount: 1000, category: "Utilities" },
  ]); // Hardcoded test transactions
  // const [transactions, setTransactions] = useState([]); // State for transactions
  // Define categories array with sample data
  const categories = [
    { name: "Food", color: "#C34AEB" },
    { name: "Subscriptions", color: "#C32A81" },
    { name: "Transportation", color: "#5CEB1B" },
    { name: "Utilities", color: "#E3A576" },
    { name: "Miscellaneous", color: "#C2B6B6" },
  ];

  // Function to calculate total income
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  // Function to calculate total expenses
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Function to calculate Categories
  const categoryTotals = categories.map((category) => {
    const totalSpent = transactions
      .filter((t) => t.category === category.name && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage =
      totalExpenses > 0 ? Math.min((totalSpent / totalExpenses) * 100, 100) : 0;
    console.log(
      `Category: ${category.name}, Total Spent: ${totalSpent}, Percentage: ${percentage}`
    );

    return { ...category, totalSpent, percentage };
  });

  // Cashflow calculation
  // const cashflow = totalIncome - totalExpenses;

  // Function to add a new transaction (for demo purposes)
  // const handleAddTransaction = (newTransaction) => {
  //   setTransactions([...transactions, newTransaction]);
  // };

  return (
    <div className="dashboard-cards">
      {/* Total Balance Card */}
      <div className="card total-balance-card">
        <h3>Total Balance</h3>
        <p className="balance-placeholder">
          Link a bank account to view your balance.
        </p>
      </div>

      {/* Cashflow and Budget Card */}
      <div className="card cashflow-budget-card">
        {/* Container for both Cashflow and Budget headers */}
        <div className="header-container">
          {/* Cashflow header */}
          <div
            className={`header ${activeSegment === "cashflow" ? "active" : ""}`}
            onClick={() => setActiveSegment("cashflow")}
          >
            <h3>Cashflow</h3>
          </div>

          {/* Budget header */}
          <div
            className={`header ${activeSegment === "budget" ? "active" : ""}`}
            onClick={() => setActiveSegment("budget")}
          >
            <h3>Budget</h3>
          </div>
        </div>

        {/* Content for the active segment */}
        <div className="content">
          {activeSegment === "cashflow" ? (
            <div className="cashflow-content active">
              <div className="content-item">
                <p className="income-text">Income</p>
                <p className="amount">₦{totalIncome.toFixed(2)}</p>
              </div>
              <div className="content-item">
                <p className="expenses-text">Expenses</p>
                <p className="amount">₦{totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <div className="budget-content active">
              <p>No active budgets</p>
            </div>
          )}
        </div>
      </div>

      {/* Categories Card */}
      <div className="card categories-card">
        <h3>Categories</h3>
        {/* Single progress bar */}
        <div className="progress-bar single-bar">
          {categoryTotals.map((category, index) => (
            <div
              key={index}
              className="progress-segment"
              style={{
                width: `${category.percentage}%`,
                backgroundColor: category.color,
                minWidth:
                  category.percentage > 0 ? `${category.percentage}%` : "1px", // Ensure visibility even for 0%
              }}
            ></div>
          ))}
        </div>

        {/* Categories displayed in rows of three */}
        <div className="categories-grid">
          {categoryTotals.map((category, index) => (
            <div key={index} className="category-item">
              {/* Color circle and category name */}
              <div className="category-header">
                <div
                  className="color-circle"
                  style={{ backgroundColor: category.color }}
                ></div>
                <p className="category-name">{category.name}</p>
              </div>
              {/* Percentage underneath the category */}
              <p className="percentage">{category.percentage.toFixed(0)}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;