// src/context/CurrencyContext.js

import React, { createContext, useState, useContext, useEffect } from "react";

// Create Currency Context
const CurrencyContext = createContext();

// CurrencyProvider component
export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("₦");  // Default to Naira
  
  // Fetch currency from localStorage if available
  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);
  
  // Function to change currency
  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);  // Persist the currency choice
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use currency context
export const useCurrency = () => {
  return useContext(CurrencyContext);
};
