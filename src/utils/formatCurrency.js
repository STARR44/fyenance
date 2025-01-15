// src/utils/formatCurrency.js
export const formatCurrency = (amount, currency) => {
    const formattedAmount = new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  
    return `${currency}${formattedAmount}`;
  };
  