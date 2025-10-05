# Daily Licious - System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     DAILY LICIOUS SYSTEM                        │
│                  Dairy Management Platform                       │
└─────────────────────────────────────────────────────────────────┘

                              ▼

┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
│                    Port: 3000                                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Drivers    │  │   Farmers    │  │  Deliveries  │         │
│  │  Management  │  │  Management  │  │  Management  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Milk      │  │  Dashboard   │  │   Reports    │         │
│  │ Collections  │  │    & Home    │  │  & Analytics │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘

                              ▼
                         HTTP/REST API

┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                     │
│                         Port: 5000                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    API ROUTES                           │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │  /api/drivers          | Driver endpoints              │    │
│  │  /api/farmers          | Farmer endpoints              │    │
│  │  /api/deliveries       | Delivery endpoints            │    │
│  │  /api/milk-collections | Collection endpoints          │    │
│  └────────────────────────────────────────────────────────┘    │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                   CONTROLLERS                           │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │  • driverController.js                                  │    │
│  │  • farmerController.js                                  │    │
│  │  • deliveryController.js                                │    │
│  │  • milkCollectionController.js                          │    │
│  │                                                          │    │
│  │  Business Logic & Data Validation                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                   MODELS (Mongoose)                     │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │  • Driver Schema                                        │    │
│  │  • Farmer Schema                                        │    │
│  │  • Delivery Schema                                      │    │
│  │  • MilkCollection Schema                                │    │
│  │                                                          │    │
│  │  Schema Definitions & Relationships                     │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

                              ▼
                      MongoDB Connection

┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB Atlas)                       │
│                        Cloud Hosted                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Database: DairyLicious (dairy_shop)                            │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  drivers     │  │   farmers    │  │  deliveries  │         │
│  │  Collection  │  │  Collection  │  │  Collection  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐                                               │
│  │milkcollections│                                              │
│  │  Collection  │                                               │
│  └──────────────┘                                               │
│                                                                  │
│  Features:                                                       │
│  • Automatic Backups                                            │
│  • High Availability                                            │
│  • Scalable Storage                                             │
│  • Global Distribution                                          │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Create Delivery Flow
```
User (Frontend)
      │
      ├─> Fill Delivery Form
      │
      ├─> POST /api/deliveries
      │
      ▼
Backend Server
      │
      ├─> deliveryController.createDelivery()
      │
      ├─> Validate Data
      │
      ├─> Calculate Total Amount
      │
      ├─> Delivery.create()
      │
      ▼
MongoDB
      │
      ├─> Insert Document
      │
      ├─> Return Created Document
      │
      ▼
Response to Frontend
      │
      ├─> Success Message
      │
      └─> Redirect to Delivery List
```

### 2. Milk Collection Flow
```
Driver Collects Milk
      │
      ├─> Record Collection Details
      │
      ├─> Quality Assessment
      │
      ├─> POST /api/milk-collections
      │
      ▼
Backend
      │
      ├─> Validate Quality Metrics
      │
      ├─> Calculate Total Amount (quantity × price)
      │
      ├─> Link Farmer & Driver
      │
      ├─> Save to Database
      │
      ▼
Database
      │
      ├─> Store Collection Record
      │
      └─> Update Farmer History
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND STACK                              │
├─────────────────────────────────────────────────────────────────┤
│  • React.js             → UI Framework                          │
│  • React Router         → Navigation                             │
│  • Axios                → HTTP Client                            │
│  • React Icons          → Icon Library                           │
│  • CSS3                 → Styling                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND STACK                               │
├─────────────────────────────────────────────────────────────────┤
│  • Node.js              → Runtime Environment                    │
│  • Express.js           → Web Framework                          │
│  • Mongoose             → MongoDB ODM                            │
│  • CORS                 → Cross-Origin Support                   │
│  • dotenv               → Environment Variables                  │
│  • express-validator    → Input Validation                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE STACK                              │
├─────────────────────────────────────────────────────────────────┤
│  • MongoDB Atlas        → Cloud Database                         │
│  • NoSQL                → Document Database                      │
│  • Cluster0             → Database Cluster                       │
└─────────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Frontend Layer                                              │
│     • Input Validation                                          │
│     • XSS Prevention                                            │
│     • HTTPS (Production)                                        │
│                                                                  │
│  2. API Layer                                                   │
│     • CORS Configuration                                        │
│     • Rate Limiting (Future)                                    │
│     • JWT Authentication (Future)                               │
│                                                                  │
│  3. Database Layer                                              │
│     • Encrypted Connection                                      │
│     • Access Control                                            │
│     • IP Whitelisting                                           │
│     • Automatic Backups                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Frontend (React)                                               │
│  └─> Netlify / Vercel / AWS S3 + CloudFront                    │
│                                                                  │
│  Backend (Node.js)                                              │
│  └─> Heroku / AWS EC2 / Digital Ocean                          │
│                                                                  │
│  Database (MongoDB)                                             │
│  └─> MongoDB Atlas (Already Configured)                        │
│                                                                  │
│  Domain & SSL                                                   │
│  └─> Custom Domain + Let's Encrypt SSL                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features & Capabilities

```
┌─────────────────────────────────────────────────────────────────┐
│                      SYSTEM CAPABILITIES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✓ Real-time Data Management                                   │
│  ✓ CRUD Operations for All Entities                            │
│  ✓ Relationship Management (Drivers, Farmers, Collections)     │
│  ✓ Automatic Calculations                                       │
│  ✓ Quality Grading System                                       │
│  ✓ Payment Tracking                                             │
│  ✓ Status Management                                            │
│  ✓ Date Range Filtering                                         │
│  ✓ Responsive Design                                            │
│  ✓ Error Handling                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema Relationships

```
       ┌──────────┐
       │  Driver  │
       └────┬─────┘
            │
            │ Referenced in
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
┌─────────┐    ┌──────────┐
│Delivery │    │  Milk    │
│         │    │Collection│
└─────────┘    └────┬─────┘
                    │
                    │ References
                    │
                    ▼
               ┌────────┐
               │ Farmer │
               └────────┘
```

## API Response Format

```json
{
  "success": true/false,
  "message": "Operation description",
  "data": {
    // Response data
  },
  "count": 10  // For list responses
}
```

---

**Daily Licious** - Complete End-to-End Dairy Management Solution
