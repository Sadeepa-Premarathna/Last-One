# Sri Lankan Dairy Product Management System

A comprehensive MERN (MongoDB, Express.js, React, Node.js) stack application for managing dairy products in Sri Lanka with user authentication and administrative features.

## Features

### User Management
- **User Registration**: Email-based account creation for regular users
- **Admin Access**: Single admin login with dedicated email (`admin@dairymanagement.lk`)
- **Role-based Authentication**: Separate access levels for users and administrators
- **Profile Management**: Users can update their personal information

### Product Management
- **Product Catalog**: Browse dairy products with filtering and search
- **Category Management**: Organized by milk, yogurt, cheese, butter, cream, ice-cream, and other
- **Inventory Tracking**: Real-time stock levels and low-stock alerts
- **Expiry Management**: Track manufacturing and expiry dates
- **Batch Management**: Unique batch number tracking for quality control

### Administrative Features
- **User Management**: Admin can view, edit, and manage user accounts
- **Product Management**: Full CRUD operations for products
- **Analytics Dashboard**: Statistics on users, products, and inventory
- **Alert System**: Notifications for low stock and expired products

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **Rate Limiting** for API protection

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **React Hook Form** for form management
- **React Query** for data fetching
- **Tailwind CSS** for modern UI styling
- **React Hot Toast** for notifications
- **Lucide React** for icons

## Project Structure

```
dairy-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Product.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   └── products.js
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── product.ts
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   └── product.ts
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dairy-management-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your environment variables in .env
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/dairy-management
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@dairymanagement.lk
```

### Default Admin Access
- **Email**: `admin@dairymanagement.lk`
- **Role**: Admin (automatically assigned during registration)

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `GET /api/auth/verify` - Verify JWT token

### Product Endpoints
- `GET /api/products` - Get products with filtering
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/alerts/low-stock` - Get low stock products
- `GET /api/products/alerts/expired` - Get expired products
- `GET /api/products/stats/overview` - Get product statistics

### User Management Endpoints (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/overview` - Get user statistics

## Features Overview

### User Features
- Register and login with email
- Browse product catalog
- Search and filter products
- View detailed product information
- Manage personal profile

### Admin Features
- All user features plus:
- Manage all user accounts
- Add, edit, delete products
- View inventory analytics
- Monitor low stock and expired products
- Access to administrative dashboard

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting to prevent abuse
- Security headers with Helmet
- Role-based access control

## Sri Lankan Context
- Currency formatting in LKR (Sri Lankan Rupees)
- Local date/time formatting
- Dairy product categories relevant to Sri Lankan market
- Admin email with .lk domain

## Development

### Running in Development Mode
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

### Testing
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run test
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
For support and questions, please contact the development team or create an issue in the repository.