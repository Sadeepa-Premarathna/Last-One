// Currency formatting utilities for Sri Lankan Rupees (LKR)

export const formatCurrency = (amount: number): string => {
  return `LKR ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 1000000) {
    return `LKR ${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `LKR ${(amount / 1000).toFixed(1)}K`;
  }
  return `LKR ${amount.toLocaleString('en-LK')}`;
};

export const formatCurrencyForCSV = (amount: number): string => {
  return `LKR ${amount.toFixed(2)}`;
};

export const formatCurrencyBasic = (amount: number): string => {
  return `LKR ${amount.toLocaleString()}`;
};