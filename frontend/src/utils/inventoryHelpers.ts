import { format, differenceInDays, parseISO } from 'date-fns';

export const formatDate = (date: string): string => {
  return format(parseISO(date), 'MMM dd, yyyy');
};

export const formatCurrency = (amount: number): string => {
  return `Rs ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getDaysUntilExpiry = (expiryDate: string): number => {
  return differenceInDays(parseISO(expiryDate), new Date());
};

export const getExpiryStatus = (expiryDate: string): { text: string; color: string } => {
  const days = getDaysUntilExpiry(expiryDate);
  
  if (days < 0) {
    return { text: 'Expired', color: 'red' };
  } else if (days <= 3) {
    return { text: `${days} days left`, color: 'red' };
  } else if (days <= 7) {
    return { text: `${days} days left`, color: 'orange' };
  } else {
    return { text: `${days} days left`, color: 'green' };
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return '#10b981';
    case 'low-stock':
      return '#f59e0b';
    case 'out-of-stock':
      return '#ef4444';
    case 'expired':
      return '#991b1b';
    default:
      return '#6b7280';
  }
};
