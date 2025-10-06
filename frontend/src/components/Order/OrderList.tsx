import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { FaShoppingCart, FaTruck, FaCalendar, FaMapMarkerAlt, FaDollarSign, FaCheckCircle, FaClock, FaMap, FaThLarge } from 'react-icons/fa';
import Modal from '../Modal/Modal';
import AssignDriverModal from './AssignDriverModal';
import OrderMapFree from './OrderMapFree';
import { Order, APIResponse } from '../../types';
import './OrderList.css';
import './OrderMap.css';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get<APIResponse<Order[]>>('/orders');
      setOrders(response.data.data || []);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch orders. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAssignDriverModal = (orderId: string): void => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
    fetchOrders();
  };

  const handleStatusChange = async (orderId: string, newStatus: string): Promise<void> => {
    if (window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      try {
        await api.patch(`/orders/${orderId}/status`, { status: newStatus });
        alert('Order status updated successfully!');
        fetchOrders();
      } catch (err: any) {
        alert('Failed to update order status. Please try again.');
        console.error('Error:', err);
      }
    }
  };

  const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <>
      <div className="list-container">
        <div className="list-header">
          <div className="list-header-content">
            <h2><FaShoppingCart /> Order Management</h2>
            <p>View and manage customer orders</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* View Toggle */}
        {orders.length > 0 && (
          <div className="view-toggle">
            <button
              className={viewMode === 'cards' ? 'active' : ''}
              onClick={() => setViewMode('cards')}
            >
              <FaThLarge /> Card View
            </button>
            <button
              className={viewMode === 'map' ? 'active' : ''}
              onClick={() => setViewMode('map')}
            >
              <FaMap /> Map View
            </button>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="empty-state">
            <FaShoppingCart className="empty-icon" />
            <h3>No Orders Found</h3>
            <p>Orders from the database will appear here</p>
          </div>
        ) : viewMode === 'map' ? (
          <OrderMapFree orders={orders} />
        ) : (
          <div className="cards-grid">
            {orders.map((order) => (
              <div key={order._id} className="data-card order-card">
                <div className="card-status">
                  <span className={`badge badge-${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="card-avatar">
                  <FaShoppingCart />
                </div>

                <div className="card-main">
                  <h3 className="card-title">Order #{order.orderId}</h3>
                  <p className="card-subtitle">{order.customerName}</p>
                </div>

                {/* Progress Bar */}
                <div className="order-progress">
                  <div className="progress-steps">
                    <div className={`progress-step ${order.status !== 'Cancelled' ? 'completed' : ''}`}>
                      <div className="step-circle">
                        <FaShoppingCart />
                      </div>
                      <span className="step-label">Order Placed</span>
                    </div>
                    
                    <div className={`progress-line ${order.assignedDriver && order.status !== 'Cancelled' ? 'completed' : ''}`}></div>
                    
                    <div className={`progress-step ${order.assignedDriver && order.status !== 'Cancelled' ? 'completed' : order.status === 'Assigned' || order.status === 'In Transit' || order.status === 'Delivered' ? 'completed' : ''}`}>
                      <div className="step-circle">
                        <FaTruck />
                      </div>
                      <span className="step-label">Driver Assigned</span>
                    </div>
                    
                    <div className={`progress-line ${order.status === 'In Transit' || order.status === 'Delivered' ? 'completed' : ''}`}></div>
                    
                    <div className={`progress-step ${order.status === 'In Transit' || order.status === 'Delivered' ? 'completed' : ''}`}>
                      <div className="step-circle">
                        <FaTruck />
                      </div>
                      <span className="step-label">In Delivery</span>
                    </div>
                    
                    <div className={`progress-line ${order.status === 'Delivered' ? 'completed' : ''}`}></div>
                    
                    <div className={`progress-step ${order.status === 'Delivered' ? 'completed' : ''}`}>
                      <div className="step-circle">
                        <FaCheckCircle />
                      </div>
                      <span className="step-label">Delivered</span>
                    </div>
                  </div>
                </div>

                <div className="card-details">
                  <div className="detail-row">
                    <FaCalendar className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Order Date</span>
                      <span className="detail-value">{formatDate(order.orderDate)}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaClock className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Requested Delivery</span>
                      <span className="detail-value">{formatDate(order.requestedDeliveryDate)}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaMapMarkerAlt className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Delivery Address</span>
                      <span className="detail-value">
                        {order.deliveryAddress?.city}, {order.deliveryAddress?.district}
                      </span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaDollarSign className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Total Amount</span>
                      <span className="detail-value">Rs. {order.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaTruck className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Assigned Driver</span>
                      <span className="detail-value">
                        {order.assignedDriver 
                          ? typeof order.assignedDriver === 'object'
                            ? `${order.assignedDriver.firstName} ${order.assignedDriver.lastName}`
                            : order.assignedDriver
                          : 'Not Assigned'}
                      </span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaCheckCircle className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Payment Status</span>
                      <span className={`detail-value payment-${order.paymentStatus?.toLowerCase()}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {order.products && order.products.length > 0 && (
                    <div className="detail-row">
                      <FaShoppingCart className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Products</span>
                        <span className="detail-value">
                          {order.products.length} item(s)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => order._id && openAssignDriverModal(order._id)}
                    disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                  >
                    <FaTruck /> {order.assignedDriver ? 'Change Driver' : 'Assign Driver'}
                  </button>
                  
                  {order.status === 'Assigned' && (
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => order._id && handleStatusChange(order._id, 'In Transit')}
                    >
                      Start Delivery
                    </button>
                  )}

                  {order.status === 'In Transit' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => order._id && handleStatusChange(order._id, 'Delivered')}
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Assign Driver to Order"
        size="medium"
      >
        <AssignDriverModal orderId={selectedOrderId} onSuccess={closeModal} />
      </Modal>
    </>
  );
};

export default OrderList;
