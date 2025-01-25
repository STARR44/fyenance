import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import "./TransactionForm.css";

function TransactionForm({ transaction, onCancel }) {
  const { addTransaction, updateTransaction, categories, budgets } =
    useGlobalContext();

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
      setFormData({
        ...transaction,
        amount: transaction.amount ? String(transaction.amount) : "",
        category: categories.findIndex(
          (cat) => cat.name === transaction.category
        ),
        budget: budgets.findIndex((bud) => bud.name === transaction.budget),
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
  
    if (name === "category" || name === "budget") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? Number(value) : "", // Convert ID string to number or reset to empty
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "amount" ? Number(value) : value, // For other fields
      }));
    }
  
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  
  //   // If the name is category or budget, find the index in the respective array
  //   if (name === "category") {
  //     const categoryIndex = categories.findIndex((cat) => cat.name === value);
  //     setFormData((prev) => ({
  //       ...prev,
  //       category: categoryIndex >= 0 ? categoryIndex : "", // Store the index or empty if not found
  //     }));
  //   } else if (name === "budget") {
  //     const budgetIndex = budgets.findIndex((bud) => bud.name === value);
  //     setFormData((prev) => ({
  //       ...prev,
  //       budget: budgetIndex >= 0 ? budgetIndex : "", // Store the index or empty if not found
  //     }));
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: name === "amount" ? Number(value) : value, // For other inputs
  //     }));
  //   }
  
  //   setErrors((prev) => ({ ...prev, [name]: "" }));
  // };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: name === "amount" ? Number(value) : value,
  //   }));

  //   setErrors((prev) => ({ ...prev, [name]: "" }));
  // };

  const handleDropdownChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
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
  
     // Debugging step to verify payload
  
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const payload = {
        amount: parseFloat(formData.amount).toFixed(2), // Ensure valid decimal format
        type: formData.type,
        date_created: formData.date_created,
      };
  
      // Add category and budget only for Expenses
      if (formData.type === "Expense") {
        payload.category =
          formData.category && categories[formData.category - 1]
            ? categories[formData.category - 1].id
            : null;
        payload.budget =
          formData.budget && budgets[formData.budget - 1]
            ? budgets[formData.budget - 1].id
            : null;
      }
      console.log("Form Data:", formData);
      console.log("Transaction.id:", transaction.id);

      console.log("Submitting Payload:", payload);
        // const payload = {
        //   ...formData,
        //   category: formData.category
        //     ? categories[formData.category - 1]?.id || null
        //     : null,
        //   budget: formData.budget
        //     ? budgets[formData.budget - 1]?.id || null
        //     : null,
        //   amount: parseFloat(formData.amount).toFixed(2), // Ensure amount is in decimal format
        // };
      if (transaction) {
        updateTransaction(transaction.id, formData);
      } else {
        addTransaction(payload);
      }
      resetForm();
      onCancel();
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const validationErrors = validateForm();
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //   } else {
  //     const payload = {
  //       ...formData,
  //       category: categories[formData.category]?.name || null,
  //       budget: budgets[formData.budget]?.name || null,
  //     };
  //     if (transaction) {
  //       updateTransaction(transaction.id, payload);
  //     } else {
  //       addTransaction(payload);
  //     }
  //     resetForm();
  //     onCancel();
  //   }
  // };

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
                value={formData.category || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Category (optional)</option>
                {categories.map((category, index) => (
                  <option key={category.id} value={index + 1}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Budget:
              <select
                name="budget"
                value={formData.budget || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Budget (optional)</option>
                {budgets.map((budget, index) => (
                  <option key={budget.id} value={index + 1}>
                    {budget.name}
                  </option>
                ))}
              </select>
            </label>
            {/* <label>
              Category:
              <select
                name="category"
                value={formData.category}
                onChange={handleDropdownChange}
              >
                <option value="">Select Category (optional)</option>
                {categories.map((category, index) => (
                  <option key={index} value={index}>
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
                  <option key={index} value={index}>
                    {budget.name}
                  </option>
                ))}
              </select>
            </label> */}
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
