import { createContext, useState, useEffect, useContext } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  // Available currencies
  const currencies = [
    { symbol: '$', name: 'Dollar', code: 'USD' },
    { symbol: '₹', name: 'Rupee', code: 'INR' },
    { symbol: '€', name: 'Euro', code: 'EUR' },
    { symbol: '¥', name: 'Yuan', code: 'CNY' }
  ];

  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('currency');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return currencies[0];
      }
    }
    return currencies[0];
  });

  useEffect(() => {
    localStorage.setItem('currency', JSON.stringify(currency));
  }, [currency]);

  // Format amount with current currency
  const formatAmount = (amount) => {
    return `${currency.symbol}${Number(amount).toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencies, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};
