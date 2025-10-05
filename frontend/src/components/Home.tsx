import React, { ReactElement, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaUsers, FaBoxOpen, FaWineBottle, FaShoppingCart, FaMoneyBillWave, FaDatabase } from 'react-icons/fa';
import api from '../config/api';

interface Feature {
  icon: ReactElement;
  title: string;
  description: string;
  path: string;
  color: string;
}

interface Stats {
  drivers: number;
  farmers: number;
  deliveries: number;
  milkCollections: number;
  orders: number;
  payments: number;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    drivers: 0,
    farmers: 0,
    deliveries: 0,
    milkCollections: 0,
    orders: 0,
    payments: 0
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async (): Promise<void> => {
    try {
      setLoading(true);
      
      const [driversRes, farmersRes, deliveriesRes, collectionsRes, ordersRes, paymentsRes] = await Promise.all([
        api.get('/drivers'),
        api.get('/farmers'),
        api.get('/deliveries'),
        api.get('/milk-collections'),
        api.get('/orders'),
        api.get('/payments')
      ]);

      setStats({
        drivers: driversRes.data.data?.length || 0,
        farmers: farmersRes.data.data?.length || 0,
        deliveries: deliveriesRes.data.data?.length || 0,
        milkCollections: collectionsRes.data.data?.length || 0,
        orders: ordersRes.data.data?.length || 0,
        payments: paymentsRes.data.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const features: Feature[] = [
    {
      icon: <FaTruck />,
      title: 'Driver Management',
      description: 'Manage drivers, vehicles, and route assignments',
      path: '/drivers',
      color: '#667eea'
    },
    {
      icon: <FaUsers />,
      title: 'Farmer Management',
      description: 'Register and manage farmers and their farm details',
      path: '/farmers',
      color: '#28a745'
    },
    {
      icon: <FaBoxOpen />,
      title: 'Delivery Management',
      description: 'Track product deliveries and customer orders',
      path: '/deliveries',
      color: '#ffc107'
    },
    {
      icon: <FaWineBottle />,
      title: 'Milk Collection',
      description: 'Record and manage milk collections from farmers',
      path: '/milk-collections',
      color: '#dc3545'
    }
  ];

  return (
    <div className="home">
      <div className="card">
        <div className="home-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#2a5298', marginBottom: '1rem' }}>
            Welcome to Daily Licious
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>
            Sri Lanka's Premier Dairy Management Solution
          </p>
          <p style={{ marginTop: '1rem', color: '#888' }}>
            Streamline your dairy operations with our comprehensive management system
          </p>
        </div>

        {/* Database Statistics */}
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px', color: 'white' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <FaDatabase /> Database Statistics {loading && '(Loading...)'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <FaTruck style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.drivers}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Drivers</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <FaUsers style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.farmers}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Farmers</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <FaShoppingCart style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.orders}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Orders</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <FaBoxOpen style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.deliveries}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Deliveries</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <FaWineBottle style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.milkCollections}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Collections</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <FaMoneyBillWave style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.payments}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Payments</div>
            </div>
          </div>
        </div>

        <div className="home-cards">
          {features.map((feature: Feature, index: number) => (
            <div
              key={index}
              className="home-card"
              onClick={() => navigate(feature.path)}
              style={{ borderTop: `4px solid ${feature.color}` }}
            >
              <div className="home-card-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>{feature.description}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: '#f8f9fa', borderRadius: '10px' }}>
          <h3 style={{ color: '#2a5298', marginBottom: '1rem' }}>System Features</h3>
          <ul style={{ lineHeight: '2', color: '#666' }}>
            <li>✅ Real-time delivery tracking and status updates</li>
            <li>✅ Automated milk quality assessment and grading</li>
            <li>✅ Driver route optimization and assignment</li>
            <li>✅ Farmer payment tracking and bank integration</li>
            <li>✅ Comprehensive reporting and analytics</li>
            <li>✅ Multi-product delivery management</li>
            <li>✅ Morning and evening collection sessions</li>
            <li>✅ Customer signature capture for deliveries</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
