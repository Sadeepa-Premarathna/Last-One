import React, { useState } from 'react';
import FinanceApp from './features/finance/financeApp';
import HRApp from './features/hr/hrApp';
import EmployeeApp from './features/employee/employeeApp';
import InventoryApp from './features/inventory/inventoryApp';
import DeliveryApp from './features/delivery/deliveryApp';
import OrderApp from './features/order/orderApp';
import './App.css';

// Home/Dashboard component
const HomePage: React.FC<{ onModuleSelect: (module: string) => void }> = ({ onModuleSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-30"></div>
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent relative">
                Welcome to Dairy Licious
              </h1>
            </div>
          </div>
          <p className="text-2xl text-gray-700 mb-8 font-medium">
            Complete Management System for Dairy Manufacturing
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Streamline your dairy operations with our comprehensive suite of management tools
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onModuleSelect('finance')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 font-semibold"
            >
              <span className="flex items-center gap-2">
                Go to Finance
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => onModuleSelect('hr')}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 font-semibold"
            >
              <span className="flex items-center gap-2">
                Go to HR
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => onModuleSelect('employee')}
              className="group px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 font-semibold"
            >
              <span className="flex items-center gap-2">
                Go to Employee
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => onModuleSelect('inventory')}
              className="group px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 font-semibold"
            >
              <span className="flex items-center gap-2">
                Go to Inventory
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => onModuleSelect('delivery')}
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 font-semibold"
            >
              <span className="flex items-center gap-2">
                Go to Delivery
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => onModuleSelect('order')}
              className="group px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 font-semibold"
            >
              <span className="flex items-center gap-2">
                Go to Orders
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Module Cards with Glassmorphism */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Finance Module Card */}
          <div
            onClick={() => onModuleSelect('finance')}
            className="group relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer border border-blue-200 transform hover:-translate-y-3 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform group-hover:rotate-6 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Finance</h2>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                Comprehensive financial management system for tracking revenue, expenses, payroll, and generating reports.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Payroll Management</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Revenue & Expense Tracking</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Allowance Management</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Financial Reports</span>
                </div>
              </div>
            </div>
          </div>

          {/* HR Module Card */}
          <div
            onClick={() => onModuleSelect('hr')}
            className="group relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer border border-purple-200 transform hover:-translate-y-3 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform group-hover:rotate-6 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">HR Management</h2>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                Complete human resources management system for employee records, attendance, leave, and payroll.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Employee Records</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Attendance Tracking</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Leave Management</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Payroll Processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Module Card */}
          <div
            onClick={() => onModuleSelect('employee')}
            className="group relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer border border-green-200 transform hover:-translate-y-3 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform group-hover:rotate-6 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">Employee</h2>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                Employee management system for tracking staff information, attendance records, and leave applications.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-600 to-green-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Employee Dashboard</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-600 to-green-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Attendance Management</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-600 to-green-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Leave Applications</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-600 to-green-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Employee Reports</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Module Card */}
          <div
            onClick={() => onModuleSelect('inventory')}
            className="group relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer border border-orange-200 transform hover:-translate-y-3 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform group-hover:rotate-6 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">Inventory</h2>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                Inventory management system for products, raw materials, milk collection, and stock tracking.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Product Management</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Raw Material Tracking</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Milk Collection</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">AI Analyzer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Module Card */}
          <div
            onClick={() => onModuleSelect('delivery')}
            className="group relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer border border-indigo-200 transform hover:-translate-y-3 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-indigo-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform group-hover:rotate-6 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">Delivery</h2>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                Delivery management system for drivers, farmers, orders, milk collection, and payments.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Driver Management</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Farmer Records</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Order Tracking</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Payment Processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Management Module Card */}
          <div
            onClick={() => onModuleSelect('order')}
            className="group relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer border border-teal-200 transform hover:-translate-y-3 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform group-hover:rotate-6 transition-transform duration-500">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">Orders</h2>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                Comprehensive order management system for tracking customer orders, status, and payments.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-teal-600 to-teal-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Order Tracking</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-teal-600 to-teal-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Customer Management</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-teal-600 to-teal-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Payment Status</span>
                </div>
                <div className="flex items-center group/item">
                  <div className="w-2 h-2 bg-gradient-to-r from-teal-600 to-teal-400 rounded-full mr-3 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium">Order Statistics</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Features */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">System Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-800">Analytics</h4>
              <p className="text-sm text-gray-600 mt-2">Real-time insights</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-semibold text-gray-800">Secure</h4>
              <p className="text-sm text-gray-600 mt-2">Data protection</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold text-gray-800">Fast</h4>
              <p className="text-sm text-gray-600 mt-2">Quick processing</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-2">📱</div>
              <h4 className="font-semibold text-gray-800">Responsive</h4>
              <p className="text-sm text-gray-600 mt-2">All devices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [activeModule, setActiveModule] = useState<string>('home');

  const handleModuleSelect = (module: string) => {
    setActiveModule(module);
  };

  return (
    <div className="app-container">
      {activeModule === 'home' && <HomePage onModuleSelect={handleModuleSelect} />}
      {activeModule === 'finance' && (
        <div>
          <button
            onClick={() => handleModuleSelect('home')}
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-colors duration-200"
          >
            ← Back to Home
          </button>
          <FinanceApp />
        </div>
      )}
      {activeModule === 'hr' && (
        <div>
          <button
            onClick={() => handleModuleSelect('home')}
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-lg transition-colors duration-200"
          >
            ← Back to Home
          </button>
          <HRApp />
        </div>
      )}
      {activeModule === 'employee' && (
        <div>
          <button
            onClick={() => handleModuleSelect('home')}
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg transition-colors duration-200"
          >
            ← Back to Home
          </button>
          <EmployeeApp />
        </div>
      )}
      {activeModule === 'inventory' && (
        <div>
          <button
            onClick={() => handleModuleSelect('home')}
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-lg transition-colors duration-200"
          >
            ← Back to Home
          </button>
          <InventoryApp />
        </div>
      )}
      {activeModule === 'delivery' && (
        <div>
          <button
            onClick={() => handleModuleSelect('home')}
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg transition-colors duration-200"
          >
            ← Back to Home
          </button>
          <DeliveryApp />
        </div>
      )}
      {activeModule === 'order' && (
        <div>
          <button
            onClick={() => handleModuleSelect('home')}
            className="fixed top-4 right-4 z-50 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-lg transition-colors duration-200"
          >
            ← Back to Home
          </button>
          <OrderApp />
        </div>
      )}
    </div>
  );
}

export default App;
