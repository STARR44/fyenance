import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import "./budgetForm.css";

function BudgetForm({ onCancel, initialData }) {
  const { addBudget, updateBudget } = useGlobalContext();
  const [formData, setFormData] = useState({
    name: "",
    allocated: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Budget Name is required.";
    if (!formData.allocated || Number(formData.allocated) <= 0) {
      newErrors.allocated = "Amount Allocated must be greater than zero.";
    }
    if (!formData.startDate) newErrors.startDate = "Start Date is required.";
    if (!formData.endDate) newErrors.endDate = "End Date is required.";
    else if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = "End Date must be later than Start Date.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      setTimeout(() => {
        if (initialData?.id) {
          updateBudget(initialData.id, {
            name: formData.name,
            allocated: Number(formData.allocated),
            startDate: formData.startDate,
            endDate: formData.endDate,
          });
        } else {
          addBudget({
            id: Date.now(),
            name: formData.name,
            allocated: Number(formData.allocated),
            startDate: formData.startDate,
            endDate: formData.endDate,
          });
        }
        setIsSubmitting(false);
        setFormData({ name: "", allocated: "", startDate: "", endDate: "" });
        onCancel(); // Close form after submit
      }, 1000);
    }
  };

  return (
    <div className="budget-form">
      <h3>{initialData.id ? "Edit Budget" : "New Budget"}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Budget Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter budget name"
            disabled={Boolean(initialData?.id)}
          />
          {errors.name && <small className="error">{errors.name}</small>}
        </label>
        <label>
          Amount Allocated:
          <input
            type="number"
            name="allocated"
            value={formData.allocated}
            onChange={handleInputChange}
            placeholder="Enter allocated amount"
          />
          {errors.allocated && (
            <small className="error">{errors.allocated}</small>
          )}
        </label>
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
          {errors.startDate && (
            <small className="error">{errors.startDate}</small>
          )}
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
          />
          {errors.endDate && <small className="error">{errors.endDate}</small>}
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
