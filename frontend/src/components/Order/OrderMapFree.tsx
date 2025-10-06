import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { FaMapMarkerAlt, FaTruck, FaHome, FaCheckCircle } from 'react-icons/fa';
import { Order } from '../../types';
import 'leaflet/dist/leaflet.css';
import './OrderMap.css';

// Import marker images
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface OrderMapFreeProps {
  orders: Order[];
}

type CityCoordinates = [number, number];

const OrderMapFree: React.FC<OrderMapFreeProps> = ({ orders }) => {
  // Sri Lanka center coordinates (Colombo)
  const centerPosition: LatLngExpression = [6.9271, 79.8612];

  // Function to get coordinates from city name
  const getCityCoordinates = (city: string | undefined): CityCoordinates => {
    const cityCoordinates: Record<string, CityCoordinates> = {
      'Colombo': [6.9271, 79.8612],
      'Kandy': [7.2906, 80.6337],
      'Negombo': [7.2094, 79.8358],
      'Galle': [6.0535, 80.2210],
      'Matara': [5.9549, 80.5550],
      'Gampaha': [7.0840, 79.9990],
      'Jaffna': [9.6615, 80.0255],
      'Trincomalee': [8.5874, 81.2152],
      'Anuradhapura': [8.3114, 80.4037],
      'Kurunegala': [7.4818, 80.3609],
      'Batticaloa': [7.7310, 81.6747],
      'Badulla': [6.9934, 81.0550],
      'Ratnapura': [6.7056, 80.4036],
      'Kegalle': [7.2513, 80.3464],
      'Nuwara Eliya': [6.9497, 80.7891]
    };
    
    return cityCoordinates[city || 'Colombo'] || [6.9271, 79.8612];
  };

  // Create custom marker icons based on status
  const createCustomIcon = (status: string): L.DivIcon => {
    const colors: Record<string, string> = {
      'Pending': '#ef4444',
      'Assigned': '#eab308',
      'In Transit': '#3b82f6',
      'Delivered': '#10b981',
      'Cancelled': '#6b7280'
    };

    const color = colors[status] || colors['Pending'];

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <div style="
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  // Get status icon
  const getStatusIcon = (status: string): React.ReactElement => {
    switch(status) {
      case 'Pending':
        return <FaHome style={{ color: '#ef4444' }} />;
      case 'Assigned':
      case 'In Transit':
        return <FaTruck style={{ color: '#3b82f6' }} />;
      case 'Delivered':
        return <FaCheckCircle style={{ color: '#10b981' }} />;
      default:
        return <FaMapMarkerAlt style={{ color: '#6b7280' }} />;
    }
  };

  return (
    <div className="map-container">
      <div className="map-header">
        <h3><FaMapMarkerAlt /> Order Tracking Map</h3>
        <p>Track all delivery locations in real-time (Free OpenStreetMap)</p>
      </div>

      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-marker" style={{ background: '#ef4444' }}></span>
          <span>Pending</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker" style={{ background: '#eab308' }}></span>
          <span>Assigned</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker" style={{ background: '#3b82f6' }}></span>
          <span>In Transit</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker" style={{ background: '#10b981' }}></span>
          <span>Delivered</span>
        </div>
      </div>

      <MapContainer
        center={centerPosition}
        zoom={8}
        scrollWheelZoom={true}
        style={{ height: '600px', borderRadius: '12px', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {orders.map((order) => {
          const position = getCityCoordinates(order.deliveryAddress?.city || 'Colombo');
          
          return (
            <Marker
              key={order._id}
              position={position}
              icon={createCustomIcon(order.status)}
            >
              <Popup>
                <div className="map-info-window">
                  <div className="info-header">
                    {getStatusIcon(order.status)}
                    <h4>Order #{order.orderId}</h4>
                  </div>
                  <div className="info-content">
                    <p><strong>Customer:</strong> {order.customerName}</p>
                    <p><strong>Phone:</strong> {order.customerPhone}</p>
                    <p><strong>Address:</strong> {order.deliveryAddress?.street || order.customerAddress}</p>
                    <p><strong>City:</strong> {order.deliveryAddress?.city}</p>
                    <p><strong>Status:</strong> <span className={`status-badge-${order.status.toLowerCase().replace(' ', '-')}`}>{order.status}</span></p>
                    <p><strong>Amount:</strong> Rs. {order.totalAmount?.toFixed(2)}</p>
                    {order.assignedDriver && (
                      <p>
                        <strong>Driver:</strong>{' '}
                        {typeof order.assignedDriver === 'object'
                          ? `${order.assignedDriver.firstName} ${order.assignedDriver.lastName}`
                          : order.assignedDriver}
                      </p>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default OrderMapFree;
