import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { BalanceSheetData, ProfitLossData, ReportMetadata } from '../finance_types/reports';

interface ReportPreviewProps {
  reportType: 'Balance Sheet' | 'Profit & Loss Statement';
  balanceSheetData?: BalanceSheetData;
  profitLossData?: ProfitLossData;
  metadata: ReportMetadata;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  reportType,
  balanceSheetData,
  profitLossData,
  metadata
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };


  if (reportType === 'Balance Sheet' && balanceSheetData) {
    return (
      <div id="report-preview" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Report Header */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">DL</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{metadata.companyName}</h1>
                  <p className="text-gray-600">Dairy Products Manufacturing</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-gray-800">{metadata.reportTitle}</h2>
              <p className="text-gray-600">{metadata.timePeriod}</p>
              <p className="text-sm text-gray-500">Generated: {metadata.generatedDate} at {metadata.generatedTime}</p>
            </div>
          </div>
        </div>

        {/* Balance Sheet Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assets */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              ASSETS
            </h3>
            
            {/* Current Assets */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Assets</h4>
              <div className="space-y-2 ml-4">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Cash - paid orders</span>
                  <span className="text-sm font-medium">{formatCurrency(balanceSheetData.assets.currentAssets.cash)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Bank</span>
                  <span className="text-sm font-medium">{formatCurrency(balanceSheetData.assets.currentAssets.bank)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Accounts Receivable</span>
                  <span className="text-sm font-medium">{formatCurrency(balanceSheetData.assets.currentAssets.accountsReceivable)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Inventory - raw milk</span>
                  <span className="text-sm font-medium">{formatCurrency(balanceSheetData.assets.currentAssets.rawMilkInventory)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Inventory - packaged goods</span>
                  <span className="text-sm font-medium">{formatCurrency(balanceSheetData.assets.currentAssets.packagedGoodsInventory)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-green-300 bg-green-100 rounded px-2">
                  <span className="text-sm font-semibold text-gray-800">Total Current Assets</span>
                  <span className="text-sm font-bold">{formatCurrency(balanceSheetData.assets.currentAssets.totalCurrentAssets)}</span>
                </div>
              </div>
            </div>

            {/* Non-current Assets */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Non-current Assets</h4>
              <div className="space-y-2 ml-4">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Property, Plant, and Equipment</span>
                  <span className="text-sm font-medium">{formatCurrency(balanceSheetData.assets.nonCurrentAssets.ppe)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-green-300 bg-green-100 rounded px-2">
                  <span className="text-sm font-semibold text-gray-800">Total Non-current Assets</span>
                  <span className="text-sm font-bold">{formatCurrency(balanceSheetData.assets.nonCurrentAssets.totalNonCurrentAssets)}</span>
                </div>
              </div>
            </div>

            {/* Total Assets */}
            <div className="flex justify-between items-center py-3 bg-green-200 rounded px-3">
              <span className="font-bold text-gray-800">TOTAL ASSETS</span>
              <span className="font-bold text-lg text-gray-900">{formatCurrency(balanceSheetData.assets.totalAssets)}</span>
            </div>
          </div>

          {/* Liabilities */}
          <div className="bg-red-50 rounded-lg p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
              LIABILITIES
            </h3>
            
            {/* Current Liabilities */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Liabilities</h4>
              <div className="space-y-2 ml-4">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Accounts Payable</span>
                  <span className="text-sm font-medium">{formatCurrency(balanceSheetData.liabilities.currentLiabilities.accountsPayable)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Wages Payable</span>
                  <span className="text-sm font-medium">{formatCurrency(balanceSheetData.liabilities.currentLiabilities.wagesPayable)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Tax Payable</span>
                  <span className="text-sm font-medium">{formatCurrency(balanceSheetData.liabilities.currentLiabilities.taxPayable)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Short-term Loans</span>
                  <span className="text-sm font-medium">{formatCurrency(balanceSheetData.liabilities.currentLiabilities.shortTermLoans)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-red-300 bg-red-100 rounded px-2">
                  <span className="text-sm font-semibold text-gray-800">Total Current Liabilities</span>
                  <span className="text-sm font-bold">{formatCurrency(balanceSheetData.liabilities.currentLiabilities.totalCurrentLiabilities)}</span>
                </div>
              </div>
            </div>

            {/* Non-current Liabilities */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Non-current Liabilities</h4>
              <div className="space-y-2 ml-4">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Long-term Loans</span>
                  <span className="text-sm font-medium">{formatCurrency(balanceSheetData.liabilities.nonCurrentLiabilities.longTermLoans)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-red-300 bg-red-100 rounded px-2">
                  <span className="text-sm font-semibold text-gray-800">Total Non-current Liabilities</span>
                  <span className="text-sm font-bold">{formatCurrency(balanceSheetData.liabilities.nonCurrentLiabilities.totalNonCurrentLiabilities)}</span>
                </div>
              </div>
            </div>

            {/* Total Liabilities */}
            <div className="flex justify-between items-center py-3 bg-red-200 rounded px-3">
              <span className="font-bold text-gray-800">TOTAL LIABILITIES</span>
              <span className="font-bold text-lg text-gray-900">{formatCurrency(balanceSheetData.liabilities.totalLiabilities)}</span>
            </div>
          </div>

          {/* Equity */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-blue-600" />
              EQUITY
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 bg-blue-100 rounded px-3">
                <span className="font-semibold text-gray-800">Owner's Equity</span>
                <span className="font-bold text-lg text-gray-900">{formatCurrency(balanceSheetData.equity.ownersEquity)}</span>
              </div>
            </div>

            {/* Balance Verification */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Balance Verification</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Total Assets = Total Liabilities + Equity</div>
                <div className="font-mono">
                  {formatCurrency(balanceSheetData.assets.totalAssets)} = {formatCurrency(balanceSheetData.liabilities.totalLiabilities)} + {formatCurrency(balanceSheetData.equity.ownersEquity)}
                </div>
                <div className={`font-semibold ${Math.abs(balanceSheetData.assets.totalAssets - (balanceSheetData.liabilities.totalLiabilities + balanceSheetData.equity.ownersEquity)) < 1 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(balanceSheetData.assets.totalAssets - (balanceSheetData.liabilities.totalLiabilities + balanceSheetData.equity.ownersEquity)) < 1 ? '✓ BALANCED' : '✗ NOT BALANCED'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (reportType === 'Profit & Loss Statement' && profitLossData) {
    // Calculate detailed breakdown based on current data
    const salesRevenue = profitLossData.revenue.milkSales;
    const otherRevenue = profitLossData.revenue.otherRevenue;
    const totalRevenue = profitLossData.revenue.totalRevenue;
    
    // Break down COGS (assuming 60% of total expenses are COGS)
    const rawMaterials = profitLossData.expenses.costOfGoodsSold * 0.6;
    const directLabor = profitLossData.expenses.costOfGoodsSold * 0.3;
    const directProductionCosts = profitLossData.expenses.costOfGoodsSold * 0.1;
    const totalCOGS = profitLossData.expenses.costOfGoodsSold;
    
    const grossProfit = profitLossData.profit.grossProfit;
    
    // Break down Operating Expenses
    const salariesWages = profitLossData.expenses.operatingExpenses * 0.7;
    const utilities = profitLossData.expenses.operatingExpenses * 0.15;
    const marketingSales = profitLossData.expenses.operatingExpenses * 0.1;
    const otherOperatingExpenses = profitLossData.expenses.operatingExpenses * 0.05;
    const totalOperatingExpenses = profitLossData.expenses.operatingExpenses;
    
    const operatingIncome = grossProfit - totalOperatingExpenses;
    const netProfit = profitLossData.profit.netProfit;
    const profitMargin = profitLossData.profit.profitMargin;

    return (
      <div id="report-preview" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Report Header */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">DL</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{metadata.companyName}</h1>
                  <p className="text-gray-600">Dairy Products Manufacturing</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-gray-800">{metadata.reportTitle}</h2>
              <p className="text-gray-600">{metadata.timePeriod}</p>
              <p className="text-sm text-gray-500">Generated: {metadata.generatedDate} at {metadata.generatedTime}</p>
            </div>
          </div>
        </div>

        {/* Professional P&L Statement Layout */}
        <div className="max-w-4xl mx-auto">
          {/* Revenue Section */}
          <div className="bg-green-50 rounded-lg p-6 mb-4 border border-green-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              REVENUE (Money coming in)
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 ml-4">Sales </span>
                <span className="font-medium text-gray-900">{formatCurrency(salesRevenue)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 ml-4">Other Revenue </span>
                <span className="font-medium text-gray-900">{formatCurrency(otherRevenue)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-green-100 rounded px-3 border-t border-green-300">
                <span className="font-bold text-gray-800">Total Revenue</span>
                <span className="font-bold text-lg text-gray-900">{formatCurrency(totalRevenue)}</span>
              </div>
            </div>
          </div>

          {/* COGS Section */}
          <div className="bg-orange-50 rounded-lg p-6 mb-4 border border-orange-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-orange-600" />
              COST OF GOODS SOLD (COGS) (Cost of making products)
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 ml-4">Raw materials</span>
                <span className="font-medium text-gray-900">{formatCurrency(rawMaterials)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 ml-4">Direct labor</span>
                <span className="font-medium text-gray-900">{formatCurrency(directLabor)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 ml-4">Direct production costs</span>
                <span className="font-medium text-gray-900">{formatCurrency(directProductionCosts)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-orange-100 rounded px-3 border-t border-orange-300">
                <span className="font-bold text-gray-800">Total COGS</span>
                <span className="font-bold text-lg text-gray-900">{formatCurrency(totalCOGS)}</span>
              </div>
            </div>
          </div>

          {/* Gross Profit */}
          <div className="bg-blue-50 rounded-lg p-6 mb-4 border border-blue-200">
            <div className="flex justify-between items-center py-3">
              <span className="text-lg font-bold text-gray-800">Gross Profit = Revenue – COGS</span>
              <span className="font-bold text-xl text-blue-900">{formatCurrency(grossProfit)}</span>
            </div>
          </div>

          {/* Operating Expenses Section */}
          <div className="bg-red-50 rounded-lg p-6 mb-4 border border-red-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
              OPERATING EXPENSES (Cost of running the business)
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 ml-4">Salaries & Wages</span>
                <span className="font-medium text-gray-900">{formatCurrency(salariesWages)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 ml-4">Utilities </span>
                <span className="font-medium text-gray-900">{formatCurrency(utilities)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 ml-4">Marketing & Sales </span>
                <span className="font-medium text-gray-900">{formatCurrency(marketingSales)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 ml-4">Other Operating Expenses</span>
                <span className="font-medium text-gray-900">{formatCurrency(otherOperatingExpenses)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-red-100 rounded px-3 border-t border-red-300">
                <span className="font-bold text-gray-800">Total Operating Expenses</span>
                <span className="font-bold text-lg text-gray-900">{formatCurrency(totalOperatingExpenses)}</span>
              </div>
            </div>
          </div>

          {/* Operating Income */}
          <div className="bg-purple-50 rounded-lg p-6 mb-4 border border-purple-200">
            <div className="flex justify-between items-center py-3">
              <span className="text-lg font-bold text-gray-800">Operating Income = Gross Profit – Operating Expenses</span>
              <span className="font-bold text-xl text-purple-900">{formatCurrency(operatingIncome)}</span>
            </div>
          </div>

          {/* Net Profit Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-4 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-gray-600" />
              NET PROFIT (Final bottom line)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 bg-gray-100 rounded px-3">
                <span className="font-bold text-gray-800">Net Profit (Loss) = Operating Income – Other Expenses</span>
                <span className={`font-bold text-xl ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netProfit)}
                </span>
              </div>
            </div>
          </div>

          {/* Profit Margin */}
          <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-indigo-600" />
              PROFIT MARGIN (Efficiency measure)
            </h3>
            <div className="flex justify-between items-center py-3">
              <span className="text-lg font-bold text-gray-800">Profit Margin = (Net Profit ÷ Revenue) × 100</span>
              <span className={`font-bold text-2xl ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return null;
};

export default ReportPreview;

