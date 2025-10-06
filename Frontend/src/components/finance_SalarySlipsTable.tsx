import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, Receipt, Calendar, User, CheckCircle, Clock, XCircle, Filter, X, Download } from 'lucide-react';
import { SalarySlip, SalarySlipFilters } from '../types/salarySlip';
import { salarySlipService } from '../services/salarySlipService';
import SalarySlipPreviewModal from './finance_SalarySlipPreviewModal';
import { generateSalarySlipPDF } from '../utils/pdfGenerator';

interface SalarySlipsTableProps {
  className?: string;
}

const SalarySlipsTable: React.FC<SalarySlipsTableProps> = ({ className = '' }) => {
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>([]);
  const [filteredSalarySlips, setFilteredSalarySlips] = useState<SalarySlip[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingSlipId, setEditingSlipId] = useState<string | null>(null);
  const [filters, setFilters] = useState<SalarySlipFilters>({ 
    employeeId: undefined, 
    month: undefined, 
    paymentStatus: undefined 
  });
  
  // Download modal states
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedSlipForDownload, setSelectedSlipForDownload] = useState<SalarySlip | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Fetch all salary slips (no server-side filtering)
  const fetchSalarySlips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching all salary slips...');
      const data = await salarySlipService.getAllSalarySlips(); // No filters - get all data
      console.log(`✅ Fetched ${data.length} salary slips`);
      setSalarySlips(data);
      setFilteredSalarySlips(data); // Initialize filtered data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch salary slips');
      console.error('Error fetching salary slips:', err);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies - always fetch all data

  // Handle status click to start editing
  const handleStatusClick = (slipId: string) => {
    setEditingSlipId(slipId);
  };

  // Update payment status
  const handleStatusUpdate = async (id: string, newStatus: 'Pending' | 'Paid' | 'Unpaid') => {
    try {
      setUpdating(id);
      setError(null);
      setEditingSlipId(null); // Close editing mode
      
      const updatedSlip = await salarySlipService.updatePaymentStatus(id, {
        paymentStatus: newStatus
      });

      // Update both arrays
      setSalarySlips(prev => 
        prev.map(slip => 
          slip.id === id ? updatedSlip : slip
        )
      );
      
      setFilteredSalarySlips(prev => 
        prev.map(slip => 
          slip.id === id ? updatedSlip : slip
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment status');
      console.error('Error updating payment status:', err);
    } finally {
      setUpdating(null);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingSlipId(null);
  };

  // Handle download button click - Use ObjectId approach
  const handleDownloadClick = async (slip: SalarySlip) => {
    try {
      setDownloadLoading(true);
      setDownloadError(null);
      
      // Since we already have the salary slip data, we can use it directly
      // But let's fetch it by ObjectId to ensure we have the most up-to-date data
      const detailedSlip = await salarySlipService.getSalarySlipById(slip.id);
      setSelectedSlipForDownload(detailedSlip);
      setIsPreviewModalOpen(true);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Failed to fetch salary slip details');
      console.error('Error fetching salary slip for download:', err);
    } finally {
      setDownloadLoading(false);
    }
  };

  // Handle PDF download from preview modal
  const handleDownloadPDF = () => {
    if (selectedSlipForDownload) {
      try {
        generateSalarySlipPDF(selectedSlipForDownload);
        setIsPreviewModalOpen(false);
        setSelectedSlipForDownload(null);
      } catch (err) {
        setDownloadError(err instanceof Error ? err.message : 'Failed to generate PDF');
        console.error('Error generating PDF:', err);
      }
    }
  };

  // Close preview modal
  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setSelectedSlipForDownload(null);
    setDownloadError(null);
  };

  // Handle generate all salary slips
  const handleGenerateAllSalarySlips = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Generating all salary slips...');
      
      const result = await salarySlipService.generateBulkSalarySlips();
      console.log('✅ Generated salary slips:', result);
      
      // Refresh the salary slips list
      await fetchSalarySlips();
      
      // Show success message
      alert(`Successfully generated salary slips! Created: ${result.results?.created || 0}, Skipped: ${result.results?.skipped || 0}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate salary slips';
      setError(errorMessage);
      console.error('Error generating salary slips:', err);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort salary slips using useMemo (like AdditionalExpenses)
  const filteredAndSortedSalarySlips = useMemo(() => {
    let filtered = salarySlips.filter(slip => {
      // Employee ID filter (case-insensitive, partial matching)
      const matchesEmployeeId = !filters.employeeId || 
        slip.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase());

      // Month filter (case-insensitive, partial matching)
      const matchesMonth = !filters.month || 
        slip.month.toLowerCase().includes(filters.month.toLowerCase());

      // Payment status filter (exact match)
      const matchesPaymentStatus = !filters.paymentStatus || 
        slip.paymentStatus === filters.paymentStatus;

      return matchesEmployeeId && matchesMonth && matchesPaymentStatus;
    });

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered;
  }, [salarySlips, filters]);

  // Update filteredSalarySlips when filteredAndSortedSalarySlips changes
  useEffect(() => {
    setFilteredSalarySlips(filteredAndSortedSalarySlips);
  }, [filteredAndSortedSalarySlips]);

  // Apply filters
  const handleFilterChange = (key: keyof SalarySlipFilters, value: string) => {
    const trimmedValue = value.trim();
    setFilters(prev => ({
      ...prev,
      [key]: trimmedValue || undefined
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ 
      employeeId: undefined, 
      month: undefined, 
      paymentStatus: undefined 
    });
  };

  // Check if any filters are active
  const hasActiveFilters = filters.employeeId || filters.month || filters.paymentStatus;

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Unpaid':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Unpaid':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    fetchSalarySlips();
  }, [fetchSalarySlips]);

  if (loading && filteredSalarySlips.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
              <div className="text-gray-500">Loading salary slips...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Salary Slips</h3>
              <p className="text-sm text-gray-600">
                Manage employee salary slips and payment status
              </p>
            </div>
          </div>
          <button
            onClick={handleGenerateAllSalarySlips}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Generate All Salary Slips</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Employee ID
            </label>
            <input
              type="text"
              value={filters.employeeId || ''}
              onChange={(e) => handleFilterChange('employeeId', e.target.value)}
              placeholder="Type E to see all employees..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Month
            </label>
            <input
              type="text"
              value={filters.month || ''}
              onChange={(e) => handleFilterChange('month', e.target.value)}
              placeholder="Type 2025 or 12..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Payment Status
            </label>
            <select
              value={filters.paymentStatus || ''}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.employeeId && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Employee: {filters.employeeId}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, employeeId: undefined }))}
                  className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.month && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Month: {filters.month}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, month: undefined }))}
                  className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.paymentStatus && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Status: {filters.paymentStatus}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, paymentStatus: undefined }))}
                  className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error Messages */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <XCircle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {downloadError && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <XCircle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">Download Error: {downloadError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1200px' }}>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Employee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Month
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Basic Salary
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                OT Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Gross Salary
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                EPF Employee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                ETF Employer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Net Salary
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Payment Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-10">
                Download
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSalarySlips.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <Receipt className="w-12 h-12 text-gray-300 mb-2" />
                    {salarySlips.length === 0 ? (
                      <>
                        <p>No salary slips found</p>
                        <p className="text-sm">Generate salary slips to get started</p>
                      </>
                    ) : (
                      <>
                        <p>No matching records found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredSalarySlips.map((slip) => (
                <tr key={slip.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <User className="w-3 h-3 text-blue-600" />
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {slip.employeeName || slip.employeeId}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {slip.employeeId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                      {slip.month}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(slip.basicSalary)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(slip.otAmount)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">{formatCurrency(slip.grossSalary)}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="text-orange-600">{formatCurrency(slip.epfEmployeeContribution)}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="text-purple-600">{formatCurrency(slip.etfEmployerContribution)}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium text-green-600">
                      {formatCurrency(slip.netSalary)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {editingSlipId === slip.id ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={slip.paymentStatus}
                          onChange={(e) => handleStatusUpdate(slip.id, e.target.value as 'Pending' | 'Paid' | 'Unpaid')}
                          disabled={updating === slip.id}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          onBlur={handleCancelEdit}
                          autoFocus
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Unpaid">Unpaid</option>
                        </select>
                        {updating === slip.id && (
                          <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
                        )}
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStatusClick(slip.id)}
                        disabled={updating === slip.id}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors hover:bg-opacity-80 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${getStatusBadgeClass(slip.paymentStatus)}`}
                        title="Click to edit status"
                      >
                        {getStatusIcon(slip.paymentStatus)}
                        <span className="ml-1">{slip.paymentStatus}</span>
                        {updating === slip.id && (
                          <RefreshCw className="w-3 h-3 text-current animate-spin ml-1" />
                        )}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center sticky right-0 bg-white z-10 border-l border-gray-200">
                    <button
                      onClick={() => handleDownloadClick(slip)}
                      disabled={downloadLoading}
                      className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Download Salary Slip"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {downloadLoading ? 'Loading...' : 'Download'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {filteredSalarySlips.length} of {salarySlips.length} salary slip{filteredSalarySlips.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={fetchSalarySlips}
            disabled={loading}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Salary Slip Preview Modal */}
      <SalarySlipPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreviewModal}
        salarySlip={selectedSlipForDownload}
        loading={downloadLoading}
        onDownloadPDF={handleDownloadPDF}
      />
    </div>
  );
};

export default SalarySlipsTable;

