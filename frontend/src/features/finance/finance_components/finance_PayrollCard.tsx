import React from 'react';

interface PayrollCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

const PayrollCard: React.FC<PayrollCardProps> = ({
  title,
  value,
  icon,
  color,
  bgColor,
  description
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div
      className={`${bgColor} p-6 rounded-xl border border-gray-200`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            Current Month
          </span>
        </div>
      </div>
      
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        {title}
      </h3>
      
      <p className="text-3xl font-bold text-gray-900 mb-2">
        {formatCurrency(value)}
      </p>
      
      <p className="text-xs text-gray-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default PayrollCard;

