// src/utils/formatCurrency.js
export const formatCurrency = (amount, currency, showDecimals = true) => {
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  return `${currency}${formattedAmount}`;
};

