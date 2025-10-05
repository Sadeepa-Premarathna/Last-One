export interface ReportFilters {
  timePeriod: 'Monthly' | 'Yearly';
  reportType: 'Balance Sheet' | 'Profit & Loss Statement';
  selectedMonth?: number; // 1-12 for months, only used when timePeriod is 'Monthly'
}

export interface PayrollReportData {
  totalGrossSalary: number;
  totalEpfEmployee: number;
  totalEpfEmployer: number;
  totalEtfEmployer: number;
  totalNetSalary: number;
  totalEmployees: number;
  periodLabel: string;
  previousPeriodComparison?: {
    grossSalaryChange: number;
    netSalaryChange: number;
  };
}

export interface PerformanceReportData {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  profitMargin: number;
  periodLabel: string;
  expenseBreakdown: {
    salaries: number;
    milkPurchases: number;
    additionalExpenses: number;
  };
  previousPeriodComparison?: {
    revenueChange: number;
    expensesChange: number;
    profitChange: number;
  };
  monthlyData?: Array<{
    period: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
}

export interface BalanceSheetData {
  period: string;
  assets: {
    currentAssets: {
      cash: number;
      bank: number;
      accountsReceivable: number;
      rawMilkInventory: number;
      packagedGoodsInventory: number;
      totalCurrentAssets: number;
    };
    nonCurrentAssets: {
      ppe: number;
      totalNonCurrentAssets: number;
    };
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: {
      accountsPayable: number;
      wagesPayable: number;
      taxPayable: number;
      shortTermLoans: number;
      totalCurrentLiabilities: number;
    };
    nonCurrentLiabilities: {
      longTermLoans: number;
      totalNonCurrentLiabilities: number;
    };
    totalLiabilities: number;
  };
  equity: {
    ownersEquity: number;
  };
}

export interface ProfitLossData {
  revenue: {
    totalRevenue: number;
    milkSales: number;
    otherRevenue: number;
  };
  expenses: {
    costOfGoodsSold: number;
    operatingExpenses: number;
    totalExpenses: number;
  };
  profit: {
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
  };
  periodLabel: string;
  previousPeriodComparison?: {
    revenueChange: number;
    expensesChange: number;
    profitChange: number;
  };
}

export interface ReportMetadata {
  companyName: string;
  reportTitle: string;
  timePeriod: string;
  generatedDate: string;
  generatedTime: string;
}