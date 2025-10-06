import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { FaTimes, FaMoneyBillWave, FaUniversity, FaReceipt, FaUser } from 'react-icons/fa';
import api from '../../config/api';
import { MilkCollection, APIResponse } from '../../types';
import './Payment.css';

interface MakePaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
  collectionId?: string | null;
}

interface PaymentFormData {
  collectionId: string;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Check' | 'Mobile Payment';
  paymentStatus: 'Completed' | 'Pending' | 'Failed' | 'Cancelled';
  transactionReference: string;
  bankName: string;
  accountNumber: string;
  branch: string;
  receiptNumber: string;
  paidBy: string;
  notes: string;
}

interface PaymentSubmitData {
  collectionId: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionReference: string;
  receiptNumber: string;
  paidBy: string;
  notes: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    branch: string;
  };
}

const MakePaymentModal: React.FC<MakePaymentModalProps> = ({ 
  onClose, 
  onSuccess, 
  collectionId = null 
}) => {
  const [pendingCollections, setPendingCollections] = useState<MilkCollection[]>([]);
  const [formData, setFormData] = useState<PaymentFormData>({
    collectionId: collectionId || '',
    paymentMethod: 'Cash',
    paymentStatus: 'Completed',
    transactionReference: '',
    bankName: '',
    accountNumber: '',
    branch: '',
    receiptNumber: '',
    paidBy: '',
    notes: ''
  });
  const [selectedCollection, setSelectedCollection] = useState<MilkCollection | null>(null);

  useEffect(() => {
    fetchPendingCollections();
  }, []);

  useEffect(() => {
    if (collectionId) {
      const collection = pendingCollections.find((c: MilkCollection) => c._id === collectionId);
      if (collection) {
        setSelectedCollection(collection);
      }
    }
  }, [collectionId, pendingCollections]);

  const fetchPendingCollections = async (): Promise<void> => {
    try {
      const response = await api.get<APIResponse<MilkCollection[]>>('/payments/pending');
      setPendingCollections(response.data.data || response.data);
    } catch (error: any) {
      console.error('Error fetching pending collections:', error);
      alert('Failed to fetch pending collections');
    }
  };

  const handleCollectionChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const collectionId = e.target.value;
    setFormData({ ...formData, collectionId });
    
    const collection = pendingCollections.find((c: MilkCollection) => c._id === collectionId);
    setSelectedCollection(collection || null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!formData.collectionId) {
      alert('Please select a milk collection');
      return;
    }

    try {
      const paymentData: PaymentSubmitData = {
        collectionId: formData.collectionId,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentStatus,
        transactionReference: formData.transactionReference,
        receiptNumber: formData.receiptNumber,
        paidBy: formData.paidBy,
        notes: formData.notes
      };

      // Add bank details if payment method is Bank Transfer
      if (formData.paymentMethod === 'Bank Transfer' && formData.bankName) {
        paymentData.bankDetails = {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          branch: formData.branch
        };
      }

      await api.post('/payments', paymentData);
      alert('Payment recorded successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error creating payment:', error);
      alert(error.response?.data?.message || 'Failed to record payment');
    }
  };

  const formatCurrency = (amount: number | undefined): string => {
    return `Rs. ${Number(amount || 0).toFixed(2)}`;
  };

  const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <FaMoneyBillWave /> Make Payment
          </h2>
          <button className="btn-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Collection Selection */}
            <div className="form-group">
              <label>Select Milk Collection *</label>
              <select
                name="collectionId"
                value={formData.collectionId}
                onChange={handleCollectionChange}
                required
                disabled={collectionId !== null}
              >
                <option value="">-- Select Collection --</option>
                {pendingCollections.map((collection: MilkCollection) => {
                  const farmerName = collection.farmer && typeof collection.farmer === 'object' 
                    ? `${collection.farmer.firstName} ${collection.farmer.lastName}` 
                    : (collection.farmer || 'Unknown');
                  
                  return (
                    <option key={collection._id} value={collection._id}>
                      {collection.collectionId} - {farmerName} - {formatDate(collection.collectionDate)} - {formatCurrency(collection.totalAmount)}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Collection Details Display */}
            {selectedCollection && (
              <div className="collection-details-box">
                <h3>Collection Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Farmer:</label>
                    <p>
                      {selectedCollection.farmer && typeof selectedCollection.farmer === 'object'
                        ? `${selectedCollection.farmer.firstName} ${selectedCollection.farmer.lastName}`
                        : (selectedCollection.farmer || 'N/A')}
                    </p>
                  </div>
                  <div className="detail-item">
                    <label>Collection Date:</label>
                    <p>{formatDate(selectedCollection.collectionDate)}</p>
                  </div>
                  <div className="detail-item">
                    <label>Quantity:</label>
                    <p>{selectedCollection.quantity} {selectedCollection.unit}</p>
                  </div>
                  <div className="detail-item">
                    <label>Price per Liter:</label>
                    <p>{formatCurrency(selectedCollection.pricePerLiter)}</p>
                  </div>
                  <div className="detail-item highlight">
                    <label>Total Amount:</label>
                    <p className="amount-highlight">{formatCurrency(selectedCollection.totalAmount)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="form-group">
              <label>Payment Method *</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Check</option>
                <option value="Mobile Payment">Mobile Payment</option>
              </select>
            </div>

            {/* Bank Details (shown only for Bank Transfer) */}
            {formData.paymentMethod === 'Bank Transfer' && (
              <div className="bank-details-section">
                <h3><FaUniversity /> Bank Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bank Name *</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      required
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Number *</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter account number"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="Enter branch name"
                  />
                </div>
              </div>
            )}

            {/* Transaction Reference */}
            <div className="form-group">
              <label><FaReceipt /> Transaction Reference</label>
              <input
                type="text"
                name="transactionReference"
                value={formData.transactionReference}
                onChange={handleChange}
                placeholder="Enter transaction reference number"
              />
            </div>

            {/* Receipt Number */}
            <div className="form-group">
              <label>Receipt Number</label>
              <input
                type="text"
                name="receiptNumber"
                value={formData.receiptNumber}
                onChange={handleChange}
                placeholder="Enter receipt number"
              />
            </div>

            {/* Payment Status */}
            <div className="form-group">
              <label>Payment Status *</label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                required
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Paid By */}
            <div className="form-group">
              <label><FaUser /> Paid By</label>
              <input
                type="text"
                name="paidBy"
                value={formData.paidBy}
                onChange={handleChange}
                placeholder="Enter staff name who processed payment"
              />
            </div>

            {/* Notes */}
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Enter any additional notes"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              <FaMoneyBillWave /> Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakePaymentModal;
