import React, { createContext, useState, useEffect, useContext } from 'react';

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const CURRENCIES = {
    GBP: {
      symbol: '£',
      rate: 0.88, // 1 EUR = 0.88 GBP (includes Stripe conversion buffer)
      code: 'GBP'
    },
    EUR: {
      symbol: '€',
      rate: 1, // Base currency
      code: 'EUR'
    }
  };

  const [selectedCurrency, setSelectedCurrency] = useState('GBP'); // GBP as default

  useEffect(() => {
    const saved = localStorage.getItem('selectedCurrency');
    if (saved && CURRENCIES[saved]) {
      setSelectedCurrency(saved);
    }
  }, []);

  const changeCurrency = (currency) => {
    if (CURRENCIES[currency]) {
      setSelectedCurrency(currency);
      localStorage.setItem('selectedCurrency', currency);
    }
  };

  // Smart .99 rounding: converts price and ensures it ends in .99
  const formatPrice = (eurPrice) => {
    const rate = CURRENCIES[selectedCurrency].rate;
    const converted = eurPrice * rate;

    // Round down to nearest integer, then add .99
    const roundedPrice = Math.floor(converted) + 0.99;

    const symbol = CURRENCIES[selectedCurrency].symbol;
    return `${symbol}${roundedPrice.toFixed(2)}`;
  };

  // Get raw converted value (for calculations)
  const convertPrice = (eurPrice) => {
    const rate = CURRENCIES[selectedCurrency].rate;
    const converted = eurPrice * rate;
    return Math.floor(converted) + 0.99;
  };

  // Format exact price without .99 rounding (for totals, subtotals, shipping)
  const formatExactPrice = (eurPrice) => {
    const rate = CURRENCIES[selectedCurrency].rate;
    const converted = eurPrice * rate;
    const symbol = CURRENCIES[selectedCurrency].symbol;
    return `${symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      changeCurrency,
      formatPrice,
      convertPrice,
      formatExactPrice,
      currencies: CURRENCIES,
      currentSymbol: CURRENCIES[selectedCurrency].symbol
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook for easier usage
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
