import React, { useState, useEffect, useRef } from "react";
import { FaCaretDown } from "react-icons/fa";
import DashboardNav from "../components/DashboardComponents/DashboardNav";
import TransactionForm from "../components/TransactionForm";
import { useGlobalContext } from "../context/GlobalContext"; // Import the context
import "./TransactionPage.css";

function TransactionPage() {
  const {
    transactions,
    budgets,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useGlobalContext(); // Access context values and methods

  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const formRef = useRef(null);
  const [activeHeader, setActiveHeader] = useState("Day");

  const toggleForm = (transaction = null) => {
    setEditTransaction(transaction);
    setShowAddTransactionForm(!showAddTransactionForm);
  };

  const handleFormSubmit = (transactionData) => {
    if (editTransaction) {
      updateTransaction(editTransaction.transaction_id, transactionData);
    } else {
      addTransaction({...transactionData });
    }
    toggleForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
      alert("Transaction deleted successfully!");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear().toString().slice(2)}`;
  };

  const formatAmount = (amount) => `₦${Number(amount).toLocaleString()}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowAddTransactionForm(false);
      }
    };

    if (showAddTransactionForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddTransactionForm]);

  return (
    <>
      <DashboardNav />
      <div className="transaction-page">
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

          {showAddTransactionForm && (
            <div ref={formRef} className="transaction-form-container">
              <TransactionForm
                categories={categories}
                budgets={budgets}
                transaction={editTransaction}
                onSubmit={handleFormSubmit}
                onCancel={() => toggleForm()}
              />
            </div>
          )}
        </div>

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
              {transactions.map((transaction) => {
                const categoryObj = categories.find(
                  (cat) => cat.id === transaction.categoryId
                );
                return (
                  <tr key={transaction.transaction_id}>
                    <td>{transaction.transaction_id}</td>
                    <td>                      
                      <span
                        className={`type ${
                          transaction.type === "Income" ? "Income" : "Expense"
                        }`}
                        style={{
                          color: transaction.type === "Income" ? "#4ECC5A" : "#EE3535",
                        }}
                      >
                        {transaction.type === "Income" ? "Income" : "Expense"}
                        <span className="dropdown-icon"></span>
                      </span>
                    </td>
                    <td>{categoryObj ? categoryObj.name : "-"}</td>
                    <td
                      style={{
                        color:
                          transaction.type === "Income" ? "#4ECC5A" : "#EE3535",
                      }}
                    >
                      {formatAmount(transaction.amount)}
                    </td>
                    <td>{formatDate(transaction.date_created)}</td>
                    <td>
                      <button onClick={() => toggleForm(transaction)}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(transaction.transaction_id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default TransactionPage;
