import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import DashboardNav from "../components/DashboardComponents/DashboardNav";
import TransactionForm from "../components/TransactionForm";
import "./TransactionPage.css";

function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);
  const [categories, setCategories] = useState([       //Hardcoded for testing purposes
    { name: "Food", color: "#C34AEB" },
    { name: "Subscriptions", color: "#C32A81" },
    { name: "Transportation", color: "#5CEB1B" },
    { name: "Utilities", color: "#E3A576" },
    { name: "Miscellaneous", color: "#C2B6B6" },
  ]);
  const [editTransaction, setEditTransaction] = useState(null);
  const [activeHeader, setActiveHeader] = useState("Day");

  // Toggle form visibility
  const toggleForm = (transaction = null) => {
    setEditTransaction(transaction);
    setShowAddTransactionForm(!showAddTransactionForm);
  };

  // Handle form submission (add or update)
  const handleFormSubmit = (transactionData) => {
    if (editTransaction) {
      // Update existing transaction
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editTransaction.id ? { ...t, ...transactionData } : t
        )
      );
      alert("Transaction updated successfully!");
    } else {
      // Add new transaction with generated ID
      const newTransaction = {
        id: Date.now(),
        ...transactionData,
      };
      setTransactions((prev) => [...prev, newTransaction]);
      alert("Transaction added successfully!");
    }
    toggleForm();
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      alert("Transaction deleted successfully!");
    }
  };

  // Format date uniformly
  //   const formatDate = (dateString) => {
  //     const options = { year: "numeric", month: "short", day: "numeric" };
  //     return new Date(dateString).toLocaleDateString(undefined, options);
  //   };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = String(date.getFullYear()).slice(2); // Get last 2 digits of the year
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      {/* DashboardNav is placed first */}
      <DashboardNav />
      <div className="transaction-page">
        {/* Header Section */}
        <div className="transaction-header-container">
          <div className="time-periods">
            {["Day", "Week", "Month", "Year"].map((period) => (
              <button
                key={period}
                className={activeHeader === period ? "active" : ""}
                onClick={() => setActiveHeader(period)}
              >
                {period}
                {period === "Year" && <FaCaretDown />}
              </button>
            ))}
          </div>

          <button className="add-transaction-btn" onClick={() => toggleForm()}>
            Add Transaction
          </button>

          {/* Transaction Form */}
          {showAddTransactionForm && (
            <div className="transaction-form-container">
              <TransactionForm
                categories={categories}
                transaction={editTransaction}
                onSubmit={handleFormSubmit}
                onCancel={() => toggleForm()}
              />
            </div>
          )}
        </div>

        {/* Transaction Table */}
        <div className="transaction-table">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>
                    <span
                      className={`type ${
                        transaction.type === "income" ? "income" : "expense"
                      }`}
                    >
                      {transaction.type === "income" ? "Income" : "Expense"}
                      <span className="dropdown-icon"></span>
                    </span>
                  </td>
                  <td>{transaction.category || "-"}</td>
                  <td>{transaction.amount}</td>
                  <td>{formatDate(transaction.date)}</td>
                  <td>
                    <button onClick={() => toggleForm(transaction)}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(transaction.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Transaction Form
        {showAddTransactionForm && (
          <div className="transaction-form-container">
            <TransactionForm
              transaction={editTransaction}
              onSubmit={handleFormSubmit}
              onCancel={() => toggleForm()}
            />
          </div>
        )} */}
      </div>
    </>
  );
}

export default TransactionPage;
