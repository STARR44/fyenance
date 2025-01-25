import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useAxios from "../utils/useAxios"; // Ensure correct path to useAxios
import AuthContext from "./AuthContext"; // Assuming your AuthContext exists for authentication

const GlobalContext = createContext();

const baseURL = 'http://127.0.0.1:8000'

export const GlobalProvider = ({ children }) => {
  const axiosInstance = useAxios();
  const { authTokens } = useContext(AuthContext); // Get authTokens from AuthContext
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cashFlow, setCashFlow] = useState({ income: 0, expenses: 0 });
  const [balance, setBalance] = useState(0); // Initialize balance

  // Decode the token to get balance and other user data
  useEffect(() => {
    if (authTokens) {
      const decodedToken = jwtDecode(authTokens.access);
      setBalance(parseFloat(decodedToken.account_balance));
    }
  }, [authTokens]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, budgetsRes, categoriesRes] = await Promise.all([
          axiosInstance.get(`${baseURL}/api/transactions/`),
          axiosInstance.get(`${baseURL}/api/budgets/`),
          axiosInstance.get(`${baseURL}/api/categories/`),
        ]);

        setTransactions(transactionsRes.data);
        setBudgets(budgetsRes.data);
        setCategories(categoriesRes.data);

        // Optional: Calculate cash flow if not directly provided by backend
        const income = transactionsRes.data
          .filter((t) => t.type === "Income")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const expenses = transactionsRes.data
          .filter((t) => t.type === "Expense")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        setCashFlow({ income, expenses });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    console.log(budgets)
    console.log(categories)

    fetchData();
  // }, [axiosInstance]);
      if (authTokens) fetchData();
  }, [authTokens]);

  // Add a transaction
  // const addTransaction = async (transaction) => {
  //   try {
  //     const response = await axiosInstance.post(`${baseURL}/api/transactions/`, transaction);
  //     setTransactions((prev) => [...prev, response.data]);
  //   } catch (error) {
  //     console.error("Error adding transaction:", error);
  //   }
  // };

  const addTransaction = async (transaction) => {
    try {
      // Directly send transaction data to the server
      const response = await axiosInstance.post(`${baseURL}/api/transactions/`, transaction);
      setTransactions((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding transaction:", error.message);
    }
  };

  // const addTransaction = async (transaction) => {
  //   try {
  //     // Find the IDs for the category and budget
  //     const categoryObj = categories.find((cat) => cat.name === transaction.category);
  //     const budgetObj = budgets.find((budget) => budget.name === transaction.budget);
  
  //     // Throw an error if the category or budget is not found
  //     if (!categoryObj) throw new Error(`Category '${transaction.category}' not found.`);
  //     if (!budgetObj) throw new Error(`Budget '${transaction.budget}' not found.`);
  
  //     // Replace the category and budget names with their IDs
  //     const transactionData = {
  //       ...transaction,
  //       category: categoryObj.id,
  //       budget: budgetObj.id,
  //     };
  
  //     // Send the updated transaction data to the server
  //     const response = await axiosInstance.post(`${baseURL}/api/transactions/`, transactionData);
  //     setTransactions((prev) => [...prev, response.data]);
  //   } catch (error) {
  //     console.error("Error adding transaction:", error.message);
  //   }
  // };

  // Update a transaction
  const updateTransaction = async (id, updatedTransaction) => {
    try {
      const response = await axiosInstance.post(`${baseURL}/api/transactions/`, {
        transaction_id: id,
        ...updatedTransaction,
      });

      setTransactions((prev) =>
        prev.map((t) => (t.transaction_id === id ? response.data : t))
      );
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id) => {
    try {
      await axiosInstance.delete(`${baseURL}/api/transactions/`, {
        data: { transaction_id: id },
      });

      setTransactions((prev) => prev.filter((t) => t.transaction_id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Add a budget
  const addBudget = async (budget) => {
    try {
      const response = await axiosInstance.post(`${baseURL}/api/budgets/`, budget);
      setBudgets((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  // Update a budget
  const updateBudget = async (id, updatedBudget) => {
    try {
      const response = await axiosInstance.post(`${baseURL}/api/budgets/`, {
        name: id,
        ...updatedBudget,
      });

      setBudgets((prev) =>
        prev.map((b) => (b.id === id ? response.data : b))
      );
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  // Delete a budget
  const deleteBudget = async (id) => {
    try {
      await axiosInstance.delete(`${baseURL}/api/budgets/`, {
        data: { budget_id: id },
      });

      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        transactions,
        budgets,
        categories,
        balance,
        cashFlow,
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






// import React, { createContext, useContext, useState, useEffect } from "react";

// const GlobalContext = createContext();

// export const GlobalProvider = ({ children }) => {
//   const [transactions, setTransactions] = useState([]);
//   const [budgets, setBudgets] = useState([]);
//   const [balance, setBalance] = useState(0);
//   const [cashFlow, setCashFlow] = useState({ income: 0, expenses: 0 });
//   const [categories, setCategories] = useState([]);

//   const categoryData = [
//     { id: 1, name: "Food", color: "#C34AEB" },
//     { id: 2, name: "Subscriptions", color: "#C32A81" },
//     { id: 3, name: "Transportation", color: "#5CEB1B" },
//     { id: 4, name: "Utilities", color: "#E3A576" },
//     { id: 5, name: "Miscellaneous", color: "#C2B6B6" },
//   ];

//   useEffect(() => {
//     setCategories(categoryData);
//   }, []);

//   const recalculateTotals = (updatedTransactions, updatedBudgets) => {
//     const totalIncome = updatedTransactions
//       .filter((t) => t.type === "income")
//       .reduce((sum, t) => sum + Number(t.amount), 0);

//     const totalExpenses = updatedTransactions
//       .filter((t) => t.type === "expense")
//       .reduce((sum, t) => sum + Number(t.amount), 0);

//     setCashFlow({ income: totalIncome, expenses: totalExpenses });
//     setBalance(totalIncome - totalExpenses);

//     //  Calculate categories
//     const updatedCategories = categoryData.map((category) => {
//       const totalSpent = updatedTransactions
//         .filter((t) => t.categoryId === category.id && t.type === "expense")
//         .reduce((sum, t) => sum + Number(t.amount), 0);

//       // Only consider categories that have transactions
//       const usedCategories = categoryData.filter((cat) =>
//         updatedTransactions.some(
//           (t) => t.categoryId === cat.id && t.type === "expense"
//         )
//       );

//       const totalUsedExpenses = usedCategories.reduce((sum, cat) => {
//         const catSpent = updatedTransactions
//           .filter((t) => t.categoryId === cat.id && t.type === "expense")
//           .reduce((sum, t) => sum + Number(t.amount), 0);
//         return sum + catSpent;
//       }, 0);

//       // Normalize percentage based on only the used categories
//       const percentage =
//         totalUsedExpenses > 0 ? (totalSpent / totalUsedExpenses) * 100 : 0;

//       return {
//         ...category,
//         totalSpent,
//         percentage: parseFloat(percentage.toFixed(2)),
//       };
//     });

//     setCategories(updatedCategories);

//     // Update budget spent amounts
//     const updatedBudgetsWithSpent = updatedBudgets.map((budget) => {
//       const spent = updatedTransactions
//         .filter((t) => t.budgetId === budget.id && t.type === "expense")
//         .reduce((sum, t) => sum + Number(t.amount), 0);

//       return {
//         ...budget,
//         spent,
//         amountLeft: budget.allocated - spent,
//         status: getBudgetStatus(budget.allocated - spent),
//       };
//     });

//     setBudgets(updatedBudgetsWithSpent);
//   };

//   const getBudgetStatus = (amountLeft) => {
//     if (amountLeft < 0) return "Exceeded";
//     if (amountLeft === 0) return "Inactive";
//     return "Active";
//   };

//   const addTransaction = (transaction) => {
//     setTransactions((prevTransactions) => {
//       const updatedTransactions = [
//         ...prevTransactions,
//         { id: Date.now(), ...transaction },
//       ];
//       recalculateTotals(updatedTransactions, budgets);
//       return updatedTransactions;
//     });
//   };

//   const updateTransaction = (id, updatedTransaction) => {
//     setTransactions((prevTransactions) => {
//       const updatedTransactions = prevTransactions.map((t) =>
//         t.id === id ? { ...t, ...updatedTransaction } : t
//       );
//       recalculateTotals(updatedTransactions, budgets);
//       return updatedTransactions;
//     });
//   };

//   const deleteTransaction = (id) => {
//     setTransactions((prevTransactions) => {
//       const updatedTransactions = prevTransactions.filter((t) => t.id !== id);
//       recalculateTotals(updatedTransactions, budgets);
//       return updatedTransactions;
//     });
//   };

//   // Function to add a budget
//   const addBudget = (budget) => {
//     setBudgets((prevBudgets) => {
//       const newBudget = {
//         id: Date.now(),
//         ...budget,
//         spent: transactions
//           .filter((t) => t.budgetId === budget.id && t.type === "expense")
//           .reduce((sum, t) => sum + Number(t.amount), 0),
//       };
//       newBudget.amountLeft = newBudget.allocated - newBudget.spent;
//       newBudget.status = getBudgetStatus(newBudget.amountLeft);
//       const updatedBudgets = [...prevBudgets, newBudget];
//       recalculateTotals(transactions, updatedBudgets);
//       return updatedBudgets;
//     });
//   };

//   //Function to Update Budget
//   const updateBudget = (id, updatedBudget) => {
//     setBudgets((prevBudgets) => {
//       const updatedBudgets = prevBudgets.map((b) => {
//         if (b.id === id) {
//           const spent = transactions
//             .filter((t) => t.budgetId === id && t.type === "expense")
//             .reduce((sum, t) => sum + Number(t.amount), 0);

//           const amountLeft = updatedBudget.allocated - spent;

//           return {
//             ...b,
//             ...updatedBudget,
//             spent, 
//             amountLeft, 
//             status: getBudgetStatus(amountLeft), 
//           };
//         }
//         return b;
//       });

//       recalculateTotals(transactions, updatedBudgets);
//       return updatedBudgets;
//     });
//   };

//   //Function to delete Budget
//     const deleteBudget = (id) => {
//       setBudgets((prevBudgets) => {
//         const updatedBudgets = prevBudgets.filter((b) => b.id !== id);
//         recalculateTotals(transactions, updatedBudgets);
//         return updatedBudgets;
//       });
//     };

  
//   return (
//     <GlobalContext.Provider
//       value={{
//         transactions,
//         budgets,
//         balance,
//         cashFlow,
//         categories,
//         addTransaction,
//         updateTransaction,
//         deleteTransaction,
//         addBudget,
//         updateBudget,
//         deleteBudget,
//       }}
//     >
//       {children}
//     </GlobalContext.Provider>
//   );
// };

// export const useGlobalContext = () => {
//   return useContext(GlobalContext);
// };
