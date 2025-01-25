import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import "./budgetForm.css";

function BudgetForm({ onCancel, initialData }) {
  const { addBudget, updateBudget } = useGlobalContext();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    amount_allocated: initialData?.amount_allocated ?? "", // Ensure a default value
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing an existing budget
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        start_date: initialData.start_date
          ? initialData.start_date.slice(0, 10)
          : "",
          end_date: initialData.end_date ? initialData.end_date.slice(0, 10) : "",
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    
    // Check for empty or invalid name
    if (!formData.name?.trim()) {
      newErrors.name = "Budget Name is required.";
    }
  
    // Check for valid amount
    if (!formData.amount_allocated || Number(formData.amount_allocated) <= 0) {
      newErrors.amount_allocated = "Amount Allocated must be greater than zero.";
    }
  
    // Check for start date
    if (!formData.start_date) {
      newErrors.start_date = "Start Date is required.";
    }
  
    // Check for end date and ensure it is after start date
    if (!formData.end_date) {
      newErrors.end_date = "End Date is required.";
    } else if (new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = "End Date must be later than Start Date.";
    }
  
    // Update error state
    setErrors(newErrors);
  
    // Return whether the form is valid (no errors)
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validate form before submission
    if (validate()) {
      setIsSubmitting(true);
  
      setTimeout(() => {
        const payload = {
          name: formData.name.trim(),
          amount_allocated: Number(formData.amount_allocated),
          start_date: formData.start_date,
          end_date: formData.end_date,
        };
  
        if (initialData?.id) {
          updateBudget(initialData.id, payload);
        } else {
          addBudget(payload);
        }
  
        setIsSubmitting(false);
        setFormData({ name: "", amount_allocated: "", start_date: "", end_date: "" });
        onCancel(); // Close the form after successful submission
      }, 1000);
    }
  };

  return (
    <div className="budget-form">
      <h3>{initialData?.id ? "Edit Budget" : "New Budget"}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Budget Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter budget name"
          />
          {errors.name && <small className="error">{errors.name}</small>}
        </label>
        <label>
          Amount Allocated:
          <input
            type="number"
            name="amount_allocated"
            value={formData.amount_allocated}
            onChange={handleInputChange}
            placeholder="Enter allocated amount"
          />
          {errors.amount_allocated && <small className="error">{errors.amount_allocated}</small>}
        </label>
        <label>
          Start Date:
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
          />
          {errors.start_date && <small className="error">{errors.start_date}</small>}
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleInputChange}
          />
          {errors.end_date && <small className="error">{errors.end_date}</small>}
        </label>
        <div className="form-buttons">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default BudgetForm;
