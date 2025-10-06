# Dairy Licious - Integrated Admin Dashboard

## Overview
This document describes the integrated admin dashboard structure for the Dairy Licious management system, connecting all module dashboards through a centralized landing page.

## Architecture

### Main Application Entry Point
- **File**: `Frontend/src/App.tsx`
- **Router**: React Router DOM with nested routes for each module

### Landing Page
- **File**: `Frontend/src/pages/AdminLanding.tsx`
- **Route**: `/` (root)
- **Purpose**: Central navigation hub for all modules

## Module Structure

### 1. Inventory Management Module
- **Base Route**: `/inventory/*`
- **Main Component**: `InventoryApp.tsx`
- **Sub-routes**:
  - `/inventory/` - Dashboard
  - `/inventory/products` - Products management
  - `/inventory/raw-material` - Raw materials
  - `/inventory/shop` - Shop view
  - `/inventory/ai-analyzer` - AI-powered analytics
  - `/inventory/add-product-mobile` - Mobile product form

**Features**:
- Product tracking with QR codes
- Stock management
- Raw milk collection tracking
- AI-powered insights and analytics
- Mobile-responsive forms

### 2. HR Management Module
- **Base Route**: `/hr/*`
- **Main Component**: `HRApp.tsx`
- **Sub-routes**:
  - `/hr/` - HR Dashboard
  - `/hr/employees` - Employee records
  - `/hr/attendance` - Attendance tracking
  - `/hr/leaves` - Leave management
  - `/hr/payroll` - Payroll management
  - `/hr/reports` - HR reports

**Features**:
- Employee records management
- Attendance tracking with corrections
- Leave application processing
- Automated payroll calculations
- Comprehensive reporting
- Bulk employee upload

### 3. Finance Management Module
- **Base Route**: `/finance/*`
- **Main Component**: `FinanceApp.tsx`
- **Sub-routes**:
  - `/finance/` - Finance Dashboard
  - `/finance/payroll` - Payroll dashboard
  - `/finance/allowances` - Allowance management
  - `/finance/revenue-expenses` - Revenue/Expense tracker
  - `/finance/additional-expenses` - Additional expenses
  - `/finance/reports` - Financial reports

**Features**:
- Payroll processing and salary slips
- Revenue and expense tracking
- Allowance management
- Additional expense tracking
- PDF report generation
- Financial analytics and charts

### 4. Delivery & Collection Module
- **Base Route**: `/delivery/*`
- **Main Component**: `DeliveryApp.tsx`
- **Sub-routes**:
  - `/delivery/` - Delivery home/dashboard
  - `/delivery/orders` - Order management
  - `/delivery/drivers` - Driver management
  - `/delivery/farmers` - Farmer records
  - `/delivery/milk-collections` - Milk collection tracking
  - `/delivery/deliveries` - Delivery tracking
  - `/delivery/payments` - Payment management

**Features**:
- Real-time delivery tracking
- Driver assignment and management
- Farmer management
- Milk collection tracking
- Order fulfillment
- Payment processing
- Route optimization maps
- PDF report generation for deliveries

### 5. Order Management Module
- **Route**: `/orders`
- **Main Component**: `OrderList.tsx`

**Features**:
- Order status tracking
- Order assignment
- Driver assignment modal
- Order history

### 6. Online Shop Module
- **Base Route**: `/shop/*`
- **Main Component**: `ShopApp.tsx`
- **Sub-routes**:
  - `/shop/` - Shop home
  - `/shop/products` - Product catalog
  - `/shop/cart` - Shopping cart
  - `/shop/checkout` - Checkout process
  - `/shop/orders` - Customer orders
  - `/shop/tracking/:orderId` - Order tracking

**Features**:
- E-commerce platform
- Product browsing with categories
- Shopping cart with mini-sidebar
- Multi-step checkout process
- Order tracking
- AI-powered chatbot
- Voice search support
- Customer satisfaction tracking

## Navigation Flow

```
Admin Landing (/)
│
├─→ Inventory Management (/inventory)
│   └─→ Dashboard, Products, Raw Materials, AI Analyzer, Shop
│
├─→ HR Management (/hr)
│   └─→ Dashboard, Employees, Attendance, Leaves, Payroll, Reports
│
├─→ Finance Management (/finance)
│   └─→ Dashboard, Payroll, Allowances, Revenue/Expenses, Reports
│
├─→ Delivery & Collection (/delivery)
│   └─→ Home, Orders, Drivers, Farmers, Collections, Deliveries, Payments
│
├─→ Order Management (/orders)
│   └─→ Order List with Management
│
└─→ Online Shop (/shop)
    └─→ Home, Products, Cart, Checkout, Orders, Tracking
```

## Shared Components

### Context Providers
- **CartContext**: Shopping cart state management

### Common UI Components
- Sidebar navigation
- Header with user info
- Modal dialogs
- Alert dialogs
- Toast notifications
- Buttons and form inputs
- Data tables
- Charts and analytics

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS + Custom CSS
- **Icons**: React Icons (Font Awesome)
- **Charts**: Recharts
- **State Management**: React Context API + Hooks
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **PDF Generation**: Custom utilities
- **QR Codes**: QR code generation library

### Backend Integration
- RESTful API endpoints for each module
- MongoDB database
- Express.js server
- Separate controllers and models for each module

## Features Overview

### Cross-Module Features
1. **Unified Authentication**: Single sign-on for all modules
2. **Responsive Design**: Works on desktop, tablet, and mobile
3. **Real-time Updates**: Live data synchronization
4. **Report Generation**: PDF reports across modules
5. **Data Export**: Export functionality for all modules
6. **Search & Filter**: Advanced filtering in all list views
7. **Analytics Dashboard**: KPI tracking on landing page

### Module Statistics on Landing Page
- **Inventory**: Total products count
- **Delivery**: Active deliveries count
- **Finance**: Monthly revenue
- **HR**: Total employees count
- **Orders**: Pending orders count
- **Shop**: Customer satisfaction percentage

## Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- MongoDB

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd Backend
npm install
npm start
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/dairy-licious
PORT=5000
JWT_SECRET=your_secret_key
```

## Future Enhancements

1. **Role-Based Access Control**: Different permissions for different user roles
2. **Real-time Notifications**: WebSocket integration for live updates
3. **Advanced Analytics**: More detailed charts and insights
4. **Mobile Apps**: Native mobile applications for each module
5. **Integration APIs**: Third-party integrations (payment gateways, shipping, etc.)
6. **Audit Logs**: Complete activity tracking
7. **Backup & Restore**: Automated backup functionality
8. **Multi-language Support**: Internationalization

## Module Integration Points

### Data Sharing Between Modules
1. **HR ↔ Finance**: Employee data for payroll
2. **Inventory ↔ Shop**: Product availability sync
3. **Orders ↔ Delivery**: Order fulfillment tracking
4. **Delivery ↔ Finance**: Payment processing
5. **Inventory ↔ Delivery**: Milk collection to inventory

## Testing

Each module should be tested:
- Unit tests for components
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance testing for large datasets

## Contributing

When adding new features:
1. Follow the existing module structure
2. Add route to appropriate App wrapper component
3. Update this documentation
4. Ensure responsive design
5. Add proper error handling
6. Include loading states

## License

Proprietary - Dairy Licious Management System © 2025
