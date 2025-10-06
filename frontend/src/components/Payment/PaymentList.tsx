import React, { useState, useEffect, ChangeEvent, ReactElement } from 'react';
import {
  FaMoneyBillWave,
  FaPlus,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaBan,
  FaUniversity,
  FaCalendarAlt,
  FaUser,
  FaReceipt,
  FaTrash
} from 'react-icons/fa';
import api from '../../config/api';
import MakePaymentModal from './MakePaymentModal';
import { Payment, PaymentStats, APIResponse } from '../../types';
import './Payment.css';

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<PaymentStats>({
    totalPaid: 0,
    totalPending: 0,
    completedPayments: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  useEffect(() => {
    // Ensure payments is an array before filtering
    if (!Array.isArray(payments)) {
      setFilteredPayments([]);
      return;
    }

    let filtered: Payment[] = [...payments];

    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter((payment: Payment) => payment.paymentStatus === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((payment: Payment) =>
        payment.paymentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, filterStatus]);

  const fetchPayments = async (): Promise<void> => {
    try {
      const response = await api.get<APIResponse<Payment[]>>('/payments');
      // Handle nested data structure from backend
      const paymentsData = response.data.data || response.data;
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      setPayments([]); // Set empty array on error
      alert('Failed to fetch payments: ' + (error.response?.data?.message || error.message));
    }
  };

  const fetchStats = async (): Promise<void> => {
    try {
      const response = await api.get<APIResponse<PaymentStats>>('/payments/stats');
      // Handle nested data structure from backend
      const statsData = response.data.data || response.data;
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      // Set default stats on error
      setStats({
        totalPaid: 0,
        totalPending: 0,
        completedPayments: 0,
        pendingPayments: 0
      });
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this payment? This will also revert the milk collection status to Pending.')) {
      try {
        await api.delete(`/payments/${id}`);
        alert('Payment deleted successfully');
        fetchPayments();
        fetchStats();
      } catch (error) {
        console.error('Error deleting payment:', error);
        alert('Failed to delete payment');
      }
    }
  };

  const getStatusIcon = (status: string): ReactElement => {
    switch (status) {
      case 'Completed':
        return <FaCheckCircle className="status-icon completed" />;
      case 'Pending':
        return <FaClock className="status-icon pending" />;
      case 'Failed':
        return <FaTimes className="status-icon failed" />;
      case 'Cancelled':
        return <FaBan className="status-icon cancelled" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  const getPaymentMethodIcon = (method: string): ReactElement => {
    switch (method) {
      case 'Bank Transfer':
        return <FaUniversity />;
      case 'Cash':
        return <FaMoneyBillWave />;
      case 'Check':
        return <FaReceipt />;
      case 'Mobile Payment':
        return <FaMoneyBillWave />;
      default:
        return <FaMoneyBillWave />;
    }
  };

  const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number | undefined): string => {
    return `Rs. ${Number(amount || 0).toFixed(2)}`;
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <div className="header-title">
          <FaMoneyBillWave className="header-icon" />
          <h1>Payment Management</h1>
        </div>
        <button 
          className="btn-add-payment"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus /> Make Payment
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card stat-total-paid">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalPaid)}</h3>
            <p>Total Paid</p>
            <span className="stat-count">{stats.completedPayments} payments</span>
          </div>
        </div>
        <div className="stat-card stat-total-pending">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalPending)}</h3>
            <p>Total Pending</p>
            <span className="stat-count">{stats.pendingPayments} collections</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="payment-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Payment ID, Farmer, Transaction Ref..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <FaFilter className="filter-icon" />
          <select
            value={filterStatus}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Payment Cards Grid */}
      <div className="payment-cards-grid">
        {filteredPayments.length === 0 ? (
          <div className="no-data">
            <FaMoneyBillWave className="no-data-icon" />
            <p>No payments found</p>
          </div>
        ) : (
          filteredPayments.map((payment: Payment) => (
            <div key={payment._id} className={`payment-card ${payment.paymentStatus.toLowerCase()}`}>
              <div className="payment-card-header">
                <div className="payment-id-section">
                  <h3>{payment.paymentId}</h3>
                  <div className="status-badge">
                    {getStatusIcon(payment.paymentStatus)}
                    <span>{payment.paymentStatus}</span>
                  </div>
                </div>
                <div className="payment-amount">
                  <h2>{formatCurrency(payment.amount)}</h2>
                </div>
              </div>

              <div className="payment-card-body">
                <div className="payment-info-row">
                  <div className="info-item">
                    <FaUser className="info-icon" />
                    <div>
                      <label>Farmer</label>
                      <p>{payment.farmerName || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaCalendarAlt className="info-icon" />
                    <div>
                      <label>Payment Date</label>
                      <p>{formatDate(payment.paymentDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="payment-info-row">
                  <div className="info-item">
                    {getPaymentMethodIcon(payment.paymentMethod)}
                    <div>
                      <label>Payment Method</label>
                      <p>{payment.paymentMethod}</p>
                    </div>
                  </div>
                  {payment.transactionReference && (
                    <div className="info-item">
                      <FaReceipt className="info-icon" />
                      <div>
                        <label>Transaction Ref</label>
                        <p>{payment.transactionReference}</p>
                      </div>
                    </div>
                  )}
                </div>

                {payment.bankDetails && payment.bankDetails.bankName && (
                  <div className="payment-info-row">
                    <div className="info-item full-width">
                      <FaUniversity className="info-icon" />
                      <div>
                        <label>Bank Details</label>
                        <p>
                          {payment.bankDetails.bankName} - {payment.bankDetails.accountNumber}
                          {payment.bankDetails.branch && ` (${payment.bankDetails.branch})`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {payment.collectionId && typeof payment.collectionId === 'object' && (
                  <div className="payment-info-row">
                    <div className="info-item">
                      <FaReceipt className="info-icon" />
                      <div>
                        <label>Collection ID</label>
                        <p>{payment.collectionId.collectionId || 'N/A'}</p>
                      </div>
                    </div>
                    {payment.receiptNumber && (
                      <div className="info-item">
                        <FaReceipt className="info-icon" />
                        <div>
                          <label>Receipt Number</label>
                          <p>{payment.receiptNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {payment.paidBy && (
                  <div className="payment-info-row">
                    <div className="info-item">
                      <FaUser className="info-icon" />
                      <div>
                        <label>Paid By</label>
                        <p>{payment.paidBy}</p>
                      </div>
                    </div>
                  </div>
                )}

                {payment.notes && (
                  <div className="payment-notes">
                    <label>Notes:</label>
                    <p>{payment.notes}</p>
                  </div>
                )}
              </div>

              <div className="payment-card-footer">
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(payment._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <MakePaymentModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchPayments();
            fetchStats();
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default PaymentList;
