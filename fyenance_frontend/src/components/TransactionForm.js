import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import "./TransactionForm.css";

function TransactionForm({ transaction, onCancel }) {
  const { addTransaction, updateTransaction, categories, budgets } = useGlobalContext();

  const [formData, setFormData] = useState({
    type: "Expense",
    category: "", // This will store the index of the selected category
    budget: "", // This will store the index of the selected budget
    amount: "",
    date_created: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      const selectedCategory = categories.findIndex((cat) => cat.name === transaction.category);
      const selectedBudget = budgets.findIndex((bud) => bud.name === transaction.budget);

      setFormData({
        ...transaction,
        amount: transaction.amount ? String(transaction.amount) : "",
        category: selectedCategory !== -1 ? selectedCategory : "",
        budget: selectedBudget !== -1 ? selectedBudget : "",
      });
    } else {
      resetForm();
    }
  }, [transaction, categories, budgets]);

  const resetForm = () => {
    setFormData({
      type: "Expense",
      category: "",
      budget: "",
      amount: "",
      date_created: new Date().toISOString().split("T")[0],
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value, // Convert amount to number
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value !== "" ? parseInt(value, 10) : "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount) newErrors.amount = "Amount is required.";
    if (!formData.date_created) newErrors.date_created = "Date is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const payload = {
        amount: parseFloat(formData.amount).toFixed(2), // Ensure valid decimal format
        type: formData.type,
        date_created: formData.date_created,
        category: formData.category !== "" ? categories[formData.category].id : null,
        budget: formData.budget !== "" ? budgets[formData.budget].id : null,
      };

      console.log("Submitting Payload:", payload);
      if (transaction) {
        updateTransaction(transaction.transaction_id, payload);
      } else {
        addTransaction(payload);
      }
      resetForm();
      onCancel();
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
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </label>

        {formData.type === "Expense" && (
          <>
            <label>
              Category:
              <select
                name="category"
                value={formData.category}
                onChange={handleDropdownChange}
              >
                <option value="">Select Category (optional)</option>
                {categories.map((category, index) => (
                  <option key={category.id} value={index}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Budget:
              <select
                name="budget"
                value={formData.budget}
                onChange={handleDropdownChange}
              >
                <option value="">Select Budget (optional)</option>
                {budgets.map((budget, index) => (
                  <option key={budget.id} value={index}>
                    {budget.name}
                  </option>
                ))}
              </select>
            </label>
          </>
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
          {errors.amount && <p className="error">{errors.amount}</p>}
        </label>

        <label>
          Transaction Date:
          <input
            type="date"
            name="date_created"
            value={formData.date_created}
            onChange={handleInputChange}
            required
          />
          {errors.date_created && <p className="error">{errors.date_created}</p>}
        </label>

        <div className="form-buttons">
          <button type="submit">{transaction ? "Update" : "Save"}</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;