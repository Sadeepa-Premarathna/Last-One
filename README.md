# FreshDairy - Modern Dairy Product Online Shop

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for a modern dairy product online shop with TypeScript, featuring an eye-catching UI with animations, product cards, and shopping cart functionality.

## 🌟 Features

### Frontend Features
- ✨ Modern, responsive UI with smooth animations using Framer Motion
- 🛒 Interactive shopping cart functionality
- 📱 Mobile-first responsive design
- 🎨 Material-UI components with custom theming
- 🔍 Product search and filtering
- 📋 Product categories (Milk, Cheese, Yogurt, Butter, Cream, Ice Cream)
- ⭐ Product ratings and reviews
- 🏪 Featured products showcase
- 📧 Contact and about pages

### Backend Features
- 🔐 JWT-based authentication and authorization
- 🛡️ Security middleware (Helmet, CORS, Rate Limiting)
- 📊 RESTful API with comprehensive error handling
- 🗃️ MongoDB database with Mongoose ODM
- 🛒 Cart management system
- 👥 User management and profiles
- 📦 Product management with categories
- 🔍 Advanced search and filtering capabilities

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for data fetching
- **Axios** for HTTP requests
- **React Hook Form** for form handling
- **React Hot Toast** for notifications

### Backend
- **Node.js** with TypeScript
- **Express.js** web framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Express Rate Limit** for API protection

## 📁 Project Structure

```
dairy-shop/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Authentication & validation
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Main server file
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript type definitions
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Main App component
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Shop\ new
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your MongoDB URI and other configurations
   
   # Build and start the server
   npm run build
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Start MongoDB**
   - Start your local MongoDB instance, or
   - Use MongoDB Atlas cloud database

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dairy-shop
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search` - Search products
- `GET /api/products/categories` - Get all categories

### Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/item/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)

## 🎨 Design Features

### UI/UX
- Clean, modern design with dairy-themed color scheme
- Smooth page transitions and hover effects
- Loading states and error handling
- Responsive grid layout for products
- Interactive cart with real-time updates

### Animations
- Page load animations using Framer Motion
- Scroll-triggered animations with Intersection Observer
- Hover effects on product cards
- Smooth transitions between pages

## 🛒 Product Categories

- **Milk** - Various types of fresh milk
- **Cheese** - Artisan and regular cheese varieties
- **Yogurt** - Greek and regular yogurt
- **Butter** - Fresh and organic butter
- **Cream** - Heavy cream and whipped cream
- **Ice Cream** - Premium ice cream flavors

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration
- Input validation and sanitization
- Security headers with Helmet

## 🚀 Deployment

### Backend Deployment
1. Build the TypeScript code: `npm run build`
2. Set production environment variables
3. Deploy to platforms like Heroku, DigitalOcean, or AWS

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3

## 🧪 Testing

Run tests for both frontend and backend:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 TODO / Future Enhancements

- [ ] User authentication and registration
- [ ] Order management system
- [ ] Payment integration (Stripe/PayPal)
- [ ] Admin dashboard for product management
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Inventory management
- [ ] Multi-language support
- [ ] PWA features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created with ❤️ for fresh dairy lovers

---

**Note**: This is a demo application. In a production environment, you would need to implement additional security measures, payment processing, and other production-ready features.
