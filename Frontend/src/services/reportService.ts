import { ReportFilters, PayrollReportData, PerformanceReportData, BalanceSheetData, ProfitLossData } from '../types/reports';
import { getEmployeeData, calculatePayrollSummary } from '../data/payrollData';
import { calculateTotals } from '../data/revenueExpenseData';
import { getMonthlyData } from '../data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const reportService = {
  async generatePayrollReport(filters: ReportFilters): Promise<PayrollReportData> {
    await delay(1000);
    
    const employees = getEmployeeData();
    const summary = calculatePayrollSummary(employees);
    
    // Simulate different data based on time period
    const multiplier = filters.timePeriod === 'Monthly' ? 1 : 12;
    
    return {
      totalGrossSalary: summary.totalGrossSalary * multiplier,
      totalEpfEmployee: summary.totalEpfEmployee * multiplier,
      totalEpfEmployer: summary.totalEpfEtfEmployer * 0.75 * multiplier, // EPF portion
      totalEtfEmployer: summary.totalEpfEtfEmployer * 0.25 * multiplier, // ETF portion
      totalNetSalary: summary.totalNetSalary * multiplier,
      totalEmployees: employees.length,
      periodLabel: getPeriodLabel(filters.timePeriod, filters.selectedMonth),
      previousPeriodComparison: {
        grossSalaryChange: Math.random() * 10 - 5, // Random change between -5% and +5%
        netSalaryChange: Math.random() * 8 - 4
      }
    };
  },

  async generatePerformanceReport(filters: ReportFilters): Promise<PerformanceReportData> {
    await delay(1000);
    
    const totals = calculateTotals();
    const monthlyData = getMonthlyData();
    
    // Simulate different data based on time period
    const multiplier = filters.timePeriod === 'Monthly' ? 1 : 12;
    
    const revenue = totals.totalRevenue * multiplier;
    const expenses = totals.totalExpenses * multiplier;
    const profit = revenue - expenses;
    
    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      totalProfit: profit,
      profitMargin: (profit / revenue) * 100,
      periodLabel: getPeriodLabel(filters.timePeriod, filters.selectedMonth),
      expenseBreakdown: {
        salaries: totals.totalSalaries * multiplier,
        milkPurchases: totals.totalMilkPurchases * multiplier,
        additionalExpenses: totals.totalAdditionalExpenses * multiplier
      },
      previousPeriodComparison: {
        revenueChange: Math.random() * 15 - 7.5,
        expensesChange: Math.random() * 10 - 5,
        profitChange: Math.random() * 20 - 10
      },
      monthlyData: filters.timePeriod === 'Yearly' ? monthlyData.slice(0, 8).map(item => ({
        period: item.month,
        revenue: item.revenue,
        expenses: item.expenses,
        profit: item.revenue - item.expenses
      })) : undefined
    };
  },

  async generateBalanceSheetReport(filters: ReportFilters): Promise<BalanceSheetData> {
    await delay(1000);
    
    try {
      // Calculate date range based on filters
      const now = new Date();
      let startDate: Date;
      let endDate: Date;
      
      if (filters.timePeriod === 'Monthly' && filters.selectedMonth) {
        startDate = new Date(now.getFullYear(), filters.selectedMonth - 1, 1);
        endDate = new Date(now.getFullYear(), filters.selectedMonth, 0, 23, 59, 59);
      } else {
        // Yearly
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      }

      // Fetch data from backend (simulated for now - replace with actual API calls)
      const balanceSheetData = await this.fetchBalanceSheetData(startDate, endDate);
      
      // Check if we have any meaningful data
      const hasData = balanceSheetData.cash > 0 || balanceSheetData.accountsReceivable > 0 || 
                     balanceSheetData.wagesPayable > 0 || balanceSheetData.accountsPayable > 0;
      
      if (!hasData) {
        throw new Error('No records found for selected period');
      }
      
      return {
        period: getPeriodLabel(filters.timePeriod, filters.selectedMonth),
        assets: {
          currentAssets: {
            cash: balanceSheetData.cash,
            bank: balanceSheetData.bank,
            accountsReceivable: balanceSheetData.accountsReceivable,
            rawMilkInventory: balanceSheetData.rawMilkInventory,
            packagedGoodsInventory: balanceSheetData.packagedGoodsInventory,
            totalCurrentAssets: balanceSheetData.cash + balanceSheetData.bank + balanceSheetData.accountsReceivable + 
                               balanceSheetData.rawMilkInventory + balanceSheetData.packagedGoodsInventory
          },
          nonCurrentAssets: {
            ppe: balanceSheetData.ppe,
            totalNonCurrentAssets: balanceSheetData.ppe
          },
          totalAssets: balanceSheetData.cash + balanceSheetData.bank + balanceSheetData.accountsReceivable + 
                      balanceSheetData.rawMilkInventory + balanceSheetData.packagedGoodsInventory + balanceSheetData.ppe
        },
        liabilities: {
          currentLiabilities: {
            accountsPayable: balanceSheetData.accountsPayable,
            wagesPayable: balanceSheetData.wagesPayable,
            taxPayable: balanceSheetData.taxPayable,
            shortTermLoans: balanceSheetData.shortTermLoans,
            totalCurrentLiabilities: balanceSheetData.accountsPayable + balanceSheetData.wagesPayable + 
                                   balanceSheetData.taxPayable + balanceSheetData.shortTermLoans
          },
          nonCurrentLiabilities: {
            longTermLoans: balanceSheetData.longTermLoans,
            totalNonCurrentLiabilities: balanceSheetData.longTermLoans
          },
          totalLiabilities: balanceSheetData.accountsPayable + balanceSheetData.wagesPayable + 
                           balanceSheetData.taxPayable + balanceSheetData.shortTermLoans + balanceSheetData.longTermLoans
        },
        equity: {
          ownersEquity: (balanceSheetData.cash + balanceSheetData.bank + balanceSheetData.accountsReceivable + 
                        balanceSheetData.rawMilkInventory + balanceSheetData.packagedGoodsInventory + balanceSheetData.ppe) - 
                       (balanceSheetData.accountsPayable + balanceSheetData.wagesPayable + 
                        balanceSheetData.taxPayable + balanceSheetData.shortTermLoans + balanceSheetData.longTermLoans)
        }
      };
    } catch (error) {
      console.error('Error generating balance sheet report:', error);
      throw new Error('Failed to generate balance sheet report');
    }
  },

  // Helper method to fetch balance sheet data from backend
  async fetchBalanceSheetData(startDate: Date, endDate: Date): Promise<{
    cash: number;
    bank: number;
    accountsReceivable: number;
    rawMilkInventory: number;
    packagedGoodsInventory: number;
    ppe: number;
    accountsPayable: number;
    wagesPayable: number;
    taxPayable: number;
    shortTermLoans: number;
    longTermLoans: number;
  }> {
    // TODO: Replace with actual API calls to backend
    // For now, simulate data fetching with realistic values
    
    // Simulate API calls to fetch orders and salary slips
    const paidOrdersTotal = await this.fetchPaidOrdersTotal(startDate, endDate);
    const unpaidOrdersTotal = await this.fetchUnpaidOrdersTotal(startDate, endDate);
    const unpaidSalariesTotal = await this.fetchUnpaidSalariesTotal(startDate, endDate);
    
    return {
      // Current Assets
      cash: paidOrdersTotal, // Cash from paid orders
      bank: 200000, // Hardcoded bank balance
      accountsReceivable: unpaidOrdersTotal, // Unpaid orders
      rawMilkInventory: 40000, // Hardcoded raw milk inventory
      packagedGoodsInventory: 60000, // Hardcoded packaged goods inventory
      
      // Non-current Assets
      ppe: 1000000, // Hardcoded Property, Plant, and Equipment
      
      // Current Liabilities
      accountsPayable: 25000, // Hardcoded unpaid bills to farmers
      wagesPayable: unpaidSalariesTotal, // Unpaid salaries
      taxPayable: 15000, // Hardcoded tax payable
      shortTermLoans: 20000, // Hardcoded short-term loans
      
      // Non-current Liabilities
      longTermLoans: 300000 // Hardcoded long-term loans
    };
  },

  // Simulate fetching paid orders total
  async fetchPaidOrdersTotal(_startDate: Date, _endDate: Date): Promise<number> {
    // TODO: Replace with actual API call
    // Example: GET /api/orders?status=Paid&startDate=${startDate}&endDate=${endDate}
    await delay(200);
    return Math.floor(Math.random() * 100000) + 50000; // Random between 50k-150k
  },

  // Simulate fetching unpaid orders total
  async fetchUnpaidOrdersTotal(_startDate: Date, _endDate: Date): Promise<number> {
    // TODO: Replace with actual API call
    // Example: GET /api/orders?status=Unpaid&startDate=${startDate}&endDate=${endDate}
    await delay(200);
    return Math.floor(Math.random() * 50000) + 20000; // Random between 20k-70k
  },

  // Simulate fetching unpaid salaries total
  // ✅ Fetch Unpaid Salaries Total
// ✅ Fetch Unpaid Salaries Total - Real API call
async fetchUnpaidSalariesTotal(startDate: Date, endDate: Date): Promise<number> {
  try {
    console.log('🔍 Frontend: Making API call to:', 
      `http://localhost:8000/api/salary-slip/unpaid-total?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );
    
    const response = await fetch(
      `http://localhost:8000/api/salary-slip/unpaid-total?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );
    
    console.log('📊 Frontend: Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Frontend: API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error('❌ Frontend: Expected JSON but got:', responseText.substring(0, 200));
      throw new Error('Response is not JSON');
    }
    
    const data = await response.json();
    console.log('✅ Frontend: API Success Response:', data);
    
    return data.totalAmount || 0;
  } catch (error) {
    console.error("❌ Frontend: Error fetching unpaid salaries:", error);
    return 0;
  }
},

  async generateProfitLossReport(filters: ReportFilters): Promise<ProfitLossData> {
    await delay(1000);
    
    const totals = calculateTotals();
    
    // Simulate different data based on time period
    const multiplier = filters.timePeriod === 'Monthly' ? 1 : 12;
    
    const milkSales = totals.totalRevenue * 0.8 * multiplier;
    const otherRevenue = totals.totalRevenue * 0.2 * multiplier;
    const totalRevenue = milkSales + otherRevenue;
    
    const costOfGoodsSold = totals.totalMilkPurchases * multiplier;
    const operatingExpenses = (totals.totalSalaries + totals.totalAdditionalExpenses) * multiplier;
    const totalExpenses = costOfGoodsSold + operatingExpenses;
    
    const grossProfit = totalRevenue - costOfGoodsSold;
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = (netProfit / totalRevenue) * 100;
    
    return {
      revenue: {
        totalRevenue,
        milkSales,
        otherRevenue
      },
      expenses: {
        costOfGoodsSold,
        operatingExpenses,
        totalExpenses
      },
      profit: {
        grossProfit,
        netProfit,
        profitMargin
      },
      periodLabel: getPeriodLabel(filters.timePeriod, filters.selectedMonth),
      previousPeriodComparison: {
        revenueChange: Math.random() * 15 - 7.5,
        expensesChange: Math.random() * 10 - 5,
        profitChange: Math.random() * 20 - 10
      }
    };
  }
};

function getPeriodLabel(timePeriod: string, selectedMonth?: number): string {
  const now = new Date();
  
  switch (timePeriod) {
    case 'Monthly':
      if (selectedMonth) {
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[selectedMonth - 1]} ${now.getFullYear()}`;
      }
      return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    case 'Yearly':
      return now.getFullYear().toString();
    
    default:
      return 'Current Period';
  }
}