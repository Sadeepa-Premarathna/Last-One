# 🥛 Dairy Licious - Complete MERN Admin Dashboard

A comprehensive, full-stack MERN (MongoDB, Express, React, Node.js) admin dashboard for Dairy Licious, a Sri Lankan dairy products company. This integrated system includes Inventory Management, Delivery & Collection, Finance, HR, Orders, and Analytics modules.

## ✨ Features

### 🎨 Modern UI
- **Eye-catching gradient backgrounds** with smooth animations
- **Animated sidebar** with collapsible navigation
- **Product cards** with hover effects and status indicators
- **Framer Motion** animations throughout the application
- **Responsive design** for all device sizes

### 📦 Product Management
- **Add/Edit/Delete products** with full validation
- **Product categories**: Milk, Yogurt, Cheese, Butter, Ice Cream, Cream, Other
- **Real-time stock tracking** with status indicators
- **Image support** for product photos
- **Batch number tracking** for quality control

### ⚠️ Smart Notifications
- **Expiry date tracking** with color-coded alerts
- **7-day expiry warning** system
- **Low stock alerts** when inventory falls below minimum levels
- **Automatic status updates** via cron jobs
- **Real-time notifications** using React Toastify

### 📊 Dashboard Analytics
- **Total products** overview
- **Active products** count
- **Low stock items** tracking
- **Expired products** monitoring
- **Total inventory value** calculation (in Sri Lankan Rupees)

## 🏗️ Project Structure

```
Inventory Dashboard/
├── backend/                     # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts     # MongoDB connection
│   │   ├── models/
│   │   │   └── Product.ts      # Product schema with validation
│   │   ├── controllers/
│   │   │   └── productController.ts  # Business logic
│   │   ├── routes/
│   │   │   └── productRoutes.ts      # API routes
│   │   ├── middleware/
│   │   │   └── errorHandler.ts       # Error handling
│   │   └── server.ts           # Entry point with cron jobs
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                    # Environment variables
│   └── nodemon.json
│
└── frontend/                   # Frontend (React + TypeScript + Vite)
    ├── src/
    │   ├── components/
    │   │   ├── Layout.tsx      # Main layout wrapper
    │   │   ├── Layout.css
    │   │   ├── Sidebar.tsx     # Animated sidebar navigation
    │   │   ├── Sidebar.css
    │   │   ├── ProductCard.tsx # Product display card
    │   │   ├── ProductCard.css
    │   │   ├── ProductForm.tsx # Add/Edit form with validation
    │   │   └── ProductForm.css
    │   ├── pages/
    │   │   ├── Dashboard.tsx   # Dashboard with stats
    │   │   ├── Dashboard.css
    │   │   ├── Products.tsx    # Product listing page
    │   │   └── Products.css
    │   ├── services/
    │   │   └── api.ts          # Axios API service
    │   ├── types/
    │   │   └── index.ts        # TypeScript interfaces
    │   ├── utils/
    │   │   └── helpers.ts      # Utility functions
    │   ├── App.tsx             # Main app component
    │   ├── main.tsx            # Entry point
    │   └── index.css           # Global styles
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── index.html
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB Atlas** account (already configured)
- **npm** or **yarn** package manager

### Backend Setup

1. **Navigate to backend directory:**
```powershell
cd "c:\Inventory Dashboard\backend"
```

2. **Install dependencies:**
```powershell
npm install
```

3. **Environment variables are already configured in `.env`:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://admin:zUwJYfxBUS1dfImJ@cluster0.82iazhd.mongodb.net/DairyLicious?retryWrites=true&w=majority
MONGODB_DB=dairy_shop
NODE_ENV=development
```

4. **Start the development server:**
```powershell
npm run dev
```

Server will run on: `http://localhost:5000`

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
```powershell
cd "c:\Inventory Dashboard\frontend"
```

2. **Install dependencies:**
```powershell
npm install
```

3. **Start the development server:**
```powershell
npm run dev
```

Frontend will run on: `http://localhost:3000`

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Statistics
- `GET /api/products/stats` - Get dashboard statistics
- `GET /api/products/expiring` - Get products expiring within 7 days
- `GET /api/products/low-stock` - Get low stock products

## 🎯 Key Features Explained

### Product Validation
- Name: Required, max 100 characters
- Description: Required, max 500 characters
- Price: Required, must be positive (in Rs)
- Quantity: Required, cannot be negative
- Expiry date: Must be after manufacture date
- Batch number: Required and unique

### Auto Status Updates
Products automatically update their status based on:
- **Active**: Normal stock levels, not expired
- **Low Stock**: Quantity ≤ minimum stock level
- **Out of Stock**: Quantity = 0
- **Expired**: Current date > expiry date

### Cron Jobs
- Runs daily at midnight
- Automatically marks expired products
- Ensures database consistency

### Currency Format
- All prices displayed in Sri Lankan Rupees (Rs)
- Format: `Rs 1,234.56`

## 🎨 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database (Atlas)
- **Mongoose** - ODM
- **node-cron** - Scheduled tasks
- **express-validator** - Input validation
- **dotenv** - Environment configuration

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **date-fns** - Date formatting

## 🔒 Database Schema

```typescript
Product {
  name: String (required, max 100)
  category: Enum (Milk, Yogurt, Cheese, Butter, Ice Cream, Cream, Other)
  description: String (required, max 500)
  price: Number (required, min 0)
  quantity: Number (required, min 0)
  unit: Enum (Liters, Kilograms, Pieces, Bottles, Packets)
  manufactureDate: Date (required)
  expiryDate: Date (required, must be after manufactureDate)
  batchNumber: String (required, unique)
  supplier: String (required)
  imageUrl: String (optional)
  minStockLevel: Number (required, min 0, default 10)
  status: Enum (active, low-stock, out-of-stock, expired)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## 🎬 Usage

1. **Access the application** at `http://localhost:3000`
2. **View Dashboard** to see inventory statistics
3. **Click "Products"** in the sidebar to manage inventory
4. **Add new products** using the "+ Add New Product" button
5. **Edit products** by clicking the "Edit" button on any product card
6. **Delete products** by clicking the "Delete" button
7. **Monitor expiry notifications** at the top of the products page

## 🌟 Design Highlights

- **Gradient Background**: Purple to violet gradient for modern aesthetic
- **Glass Morphism**: Frosted glass effect on cards and modals
- **Smooth Animations**: Framer Motion for fluid transitions
- **Color-coded Status**: Visual indicators for product status
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Sri Lankan Focus**: Currency in LKR, company branding

## 🛠️ Build for Production

### Backend
```powershell
cd backend
npm run build
npm start
```

### Frontend
```powershell
cd frontend
npm run build
```

Build output will be in `frontend/dist` directory.

## 📝 Notes

- Database is already configured with MongoDB Atlas
- No mock data - all data comes from real database
- TypeScript ensures type safety throughout
- All validations work on both frontend and backend
- Expiry notifications update in real-time

## 🤝 Contributing

This is a proprietary system for Dairy Licious. For modifications or enhancements, contact the development team.

## 📄 License

Proprietary - Dairy Licious © 2024

---

**Developed with ❤️ for Dairy Licious, Sri Lanka**
>>>>>>> origin/Inventory
