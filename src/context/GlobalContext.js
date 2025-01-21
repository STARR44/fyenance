import React, { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [balance, setBalance] = useState(0);
  const [cashFlow, setCashFlow] = useState({ income: 0, expenses: 0 });
  const [categories, setCategories] = useState([]);

  const categoryData = [
    { id: 1, name: "Food", color: "#C34AEB" },
    { id: 2, name: "Subscriptions", color: "#C32A81" },
    { id: 3, name: "Transportation", color: "#5CEB1B" },
    { id: 4, name: "Utilities", color: "#E3A576" },
    { id: 5, name: "Miscellaneous", color: "#C2B6B6" },
  ];

  useEffect(() => {
    setCategories(categoryData);
  }, []);

  const recalculateTotals = (updatedTransactions, updatedBudgets) => {
    const totalIncome = updatedTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = updatedTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    setCashFlow({ income: totalIncome, expenses: totalExpenses });
    setBalance(totalIncome - totalExpenses);

    //  Calculate categories
    const updatedCategories = categoryData.map((category) => {
      const totalSpent = updatedTransactions
        .filter((t) => t.categoryId === category.id && t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Only consider categories that have transactions
      const usedCategories = categoryData.filter((cat) =>
        updatedTransactions.some(
          (t) => t.categoryId === cat.id && t.type === "expense"
        )
      );

      const totalUsedExpenses = usedCategories.reduce((sum, cat) => {
        const catSpent = updatedTransactions
          .filter((t) => t.categoryId === cat.id && t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0);
        return sum + catSpent;
      }, 0);

      // Normalize percentage based on only the used categories
      const percentage =
        totalUsedExpenses > 0 ? (totalSpent / totalUsedExpenses) * 100 : 0;

      return {
        ...category,
        totalSpent,
        percentage: parseFloat(percentage.toFixed(2)),
      };
    });

    setCategories(updatedCategories);

    // Update budget spent amounts
    const updatedBudgetsWithSpent = updatedBudgets.map((budget) => {
      const spent = updatedTransactions
        .filter((t) => t.budgetId === budget.id && t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        ...budget,
        spent,
        amountLeft: budget.allocated - spent,
        status: getBudgetStatus(budget.allocated - spent),
      };
    });

    setBudgets(updatedBudgetsWithSpent);
  };

  const getBudgetStatus = (amountLeft) => {
    if (amountLeft < 0) return "Exceeded";
    if (amountLeft === 0) return "Inactive";
    return "Active";
  };

  const addTransaction = (transaction) => {
    setTransactions((prevTransactions) => {
      const updatedTransactions = [
        ...prevTransactions,
        { id: Date.now(), ...transaction },
      ];
      recalculateTotals(updatedTransactions, budgets);
      return updatedTransactions;
    });
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions((prevTransactions) => {
      const updatedTransactions = prevTransactions.map((t) =>
        t.id === id ? { ...t, ...updatedTransaction } : t
      );
      recalculateTotals(updatedTransactions, budgets);
      return updatedTransactions;
    });
  };

  const deleteTransaction = (id) => {
    setTransactions((prevTransactions) => {
      const updatedTransactions = prevTransactions.filter((t) => t.id !== id);
      recalculateTotals(updatedTransactions, budgets);
      return updatedTransactions;
    });
  };

  // Function to add a budget
  const addBudget = (budget) => {
    setBudgets((prevBudgets) => {
      const newBudget = {
        id: Date.now(),
        ...budget,
        spent: transactions
          .filter((t) => t.budgetId === budget.id && t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0),
      };
      newBudget.amountLeft = newBudget.allocated - newBudget.spent;
      newBudget.status = getBudgetStatus(newBudget.amountLeft);
      const updatedBudgets = [...prevBudgets, newBudget];
      recalculateTotals(transactions, updatedBudgets);
      return updatedBudgets;
    });
  };

  //Function to Update Budget
  const updateBudget = (id, updatedBudget) => {
    setBudgets((prevBudgets) => {
      const updatedBudgets = prevBudgets.map((b) => {
        if (b.id === id) {
          const spent = transactions
            .filter((t) => t.budgetId === id && t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amount), 0);

          const amountLeft = updatedBudget.allocated - spent;

          return {
            ...b,
            ...updatedBudget,
            spent, 
            amountLeft, 
            status: getBudgetStatus(amountLeft), 
          };
        }
        return b;
      });

      recalculateTotals(transactions, updatedBudgets);
      return updatedBudgets;
    });
  };

  //Function to delete Budget
    const deleteBudget = (id) => {
      setBudgets((prevBudgets) => {
        const updatedBudgets = prevBudgets.filter((b) => b.id !== id);
        recalculateTotals(transactions, updatedBudgets);
        return updatedBudgets;
      });
    };

  
  return (
    <GlobalContext.Provider
      value={{
        transactions,
        budgets,
        balance,
        cashFlow,
        categories,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
