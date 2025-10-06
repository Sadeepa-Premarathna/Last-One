import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Users, AlertTriangle, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Total Products',
      value: '124',
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      name: 'Active Users',
      value: '89',
      icon: Users,
      color: 'bg-green-500',
      change: '+5%',
    },
    {
      name: 'Low Stock Alerts',
      value: '7',
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      change: '-2',
    },
    {
      name: 'Monthly Revenue',
      value: 'LKR 2.5M',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+18%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'} - Dairy Management System
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              user?.role === 'admin' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">View Products</span>
                <Package className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mt-1">Browse and search dairy products</p>
            </button>
            
            {user?.role === 'admin' && (
              <>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Manage Users</span>
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">View and manage user accounts</p>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Add Product</span>
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Add new dairy products to inventory</p>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-xs text-gray-600">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Product updated</p>
                <p className="text-xs text-gray-600">15 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Low stock alert</p>
                <p className="text-xs text-gray-600">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sri Lankan Context */}
      <div className="bg-gradient-to-r from-blue-50 to-dairy-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sri Lankan Dairy Market</h3>
        <p className="text-gray-600 text-sm">
          Managing quality dairy products for the Sri Lankan market with focus on freshness, 
          local preferences, and regulatory compliance. Our system helps track products from 
          farm to table ensuring the highest standards.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;