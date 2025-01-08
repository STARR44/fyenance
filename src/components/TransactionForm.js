import React, { useState, useEffect } from "react";
import "./TransactionForm.css";

function TransactionForm({ categories, transaction, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    type: transaction ? transaction.type : "income", // Default to 'income'
    category: transaction ? transaction.category : "", // Default to empty string if not editing
    amount: transaction ? transaction.amount : "",
    date: transaction ? transaction.date : "",
    // type: "income",
    // category: "",
    // amount: "",
    // date: "",
  });

  const [submittedData, setSubmittedData] = useState(null);

  // Populate form when editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        // Ensure amount is a number (if applicable)
        amount: transaction.amount ? String(transaction.amount) : "",
      });
    } else {
      // Reset form data for new transactions
      setFormData({
        type: "income",
        category: "",
        amount: "",
        date: "",
      });
    }
  }, [transaction]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.date) {
      onSubmit(formData);
      setSubmittedData(formData); // Stores the submitted data for display
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div className="transaction-form">
      <h3>{transaction ? "Edit Transaction" : "New Transaction"}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Transaction Type:
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        {/* Show category only if type is expense */}
        {formData.type === "expense" && (
          <label>
            Category:
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>{" "}
              {/* Placeholder option */}
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          
        )}

        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Transaction Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </label>

        <div className="form-buttons">
          <button type="submit">{transaction ? "Update" : "Save"}</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>

      {submittedData && (
        <div className="submitted-data">
          <h4>Transaction Details</h4>
          <p className={`type-display ${submittedData.type}`}>
            <strong>Transaction Type:</strong> {submittedData.type}
          </p>
          {submittedData.type === "expense" && (
            <p className="category-display">
              <strong>Category:</strong> {submittedData.category}
            </p>
          )}
          <p className="amount-display">
            <strong>Amount:</strong> ${submittedData.amount}
          </p>
          <p className="date-display">
            <strong>Transaction Date:</strong> {submittedData.date}
          </p>
        </div>
      )}
    </div>
  );
}

export default TransactionForm;
