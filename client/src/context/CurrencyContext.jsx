import { createContext, useContext, useMemo, useState } from "react";

const CURRENCY_STORAGE_KEY = "inventory-display-currency";

const currencies = {
  USD: { label: "US Dollar", rate: 1 / 193 },
  GHS: { label: "Ghanaian Cedi", rate: 15 / 193 },
  LRD: { label: "Liberian Dollar", rate: 1 },
  EUR: { label: "Euro", rate: 0.92 / 193 },
  GBP: { label: "British Pound", rate: 0.79 / 193 },
};

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
    return savedCurrency && currencies[savedCurrency] ? savedCurrency : "LRD";
  });

  const changeCurrency = (nextCurrency) => {
    if (!currencies[nextCurrency]) return;
    setCurrency(nextCurrency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, nextCurrency);
  };

  const formatCurrency = (value) => {
    const amount = Number(value) * currencies[currency].rate;

    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(amount) ? amount : 0);
  };

  const value = useMemo(
    () => ({
      currency,
      currencies,
      changeCurrency,
      formatCurrency,
    }),
    [currency]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }

  return context;
}
