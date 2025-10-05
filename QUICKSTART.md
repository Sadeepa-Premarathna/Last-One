# Daily Licious - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js installed (v14 or higher)
- MongoDB Atlas account (already configured)
- npm or yarn package manager

### Installation & Setup

1. **Install Backend Dependencies**
```bash
npm install
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
cd ..
```

### Running the Application

#### Option 1: Run Both Servers Separately

**Terminal 1 - Backend Server:**
```bash
npm start
```
Server will run on: http://localhost:5000

**Terminal 2 - Frontend Application:**
```bash
cd frontend
npm start
```
Application will run on: http://localhost:3000

#### Option 2: Run Both Concurrently
```bash
npm run dev
```

#### Option 3: Windows Batch File
```bash
start.bat
```

## 📋 Features

### 1. Driver Management
- Register drivers with complete details
- Track NIC and license information
- Assign vehicles and routes
- Monitor driver status (Active/Inactive/On Leave)

### 2. Farmer Management
- Register farmers in the system
- Store farm locations and cow count
- Manage bank details for payments
- Track farmer status

### 3. Milk Collection
- Record daily milk collections
- Morning and evening sessions
- Quality assessment (Fat content, SNF, Grade)
- Automatic payment calculation
- Track collection status

### 4. Delivery Management
- Create delivery orders
- Assign drivers to deliveries
- Multiple product support
- Track delivery status
- Payment tracking (Cash/Card/Online/Credit)

## 🔗 API Endpoints

### Root
- `GET /` - API welcome message

### Drivers
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:id` - Get single driver
- `POST /api/drivers` - Create driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver
- `GET /api/drivers/status/active` - Get active drivers

### Farmers
- `GET /api/farmers` - Get all farmers
- `GET /api/farmers/:id` - Get single farmer
- `POST /api/farmers` - Create farmer
- `PUT /api/farmers/:id` - Update farmer
- `DELETE /api/farmers/:id` - Delete farmer
- `GET /api/farmers/status/active` - Get active farmers

### Milk Collections
- `GET /api/milk-collections` - Get all collections
- `GET /api/milk-collections/:id` - Get single collection
- `POST /api/milk-collections` - Create collection
- `PUT /api/milk-collections/:id` - Update collection
- `DELETE /api/milk-collections/:id` - Delete collection
- `GET /api/milk-collections/farmer/:farmerId` - Get by farmer
- `GET /api/milk-collections/date-range` - Filter by date

### Deliveries
- `GET /api/deliveries` - Get all deliveries
- `GET /api/deliveries/:id` - Get single delivery
- `POST /api/deliveries` - Create delivery
- `PUT /api/deliveries/:id` - Update delivery
- `DELETE /api/deliveries/:id` - Delete delivery
- `GET /api/deliveries/status/:status` - Get by status
- `GET /api/deliveries/driver/:driverId` - Get by driver
- `GET /api/deliveries/date-range` - Filter by date

## 📁 Project Structure

```
Daily-Licious/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── driverController.js      # Driver business logic
│   │   ├── farmerController.js      # Farmer business logic
│   │   ├── deliveryController.js    # Delivery business logic
│   │   └── milkCollectionController.js
│   ├── models/
│   │   ├── Driver.js                # Driver schema
│   │   ├── Farmer.js                # Farmer schema
│   │   ├── Delivery.js              # Delivery schema
│   │   └── MilkCollection.js        # Milk collection schema
│   ├── routes/
│   │   ├── driverRoutes.js          # Driver endpoints
│   │   ├── farmerRoutes.js          # Farmer endpoints
│   │   ├── deliveryRoutes.js        # Delivery endpoints
│   │   └── milkCollectionRoutes.js  # Collection endpoints
│   └── server.js                     # Express app entry point
├── frontend/
│   ├── public/                       # Static files
│   ├── src/
│   │   ├── components/
│   │   │   ├── Driver/
│   │   │   │   ├── DriverList.js
│   │   │   │   └── DriverForm.js
│   │   │   ├── Farmer/
│   │   │   │   ├── FarmerList.js
│   │   │   │   └── FarmerForm.js
│   │   │   ├── Delivery/
│   │   │   │   ├── DeliveryList.js
│   │   │   │   └── DeliveryForm.js
│   │   │   ├── MilkCollection/
│   │   │   │   ├── MilkCollectionList.js
│   │   │   │   └── MilkCollectionForm.js
│   │   │   └── Home.js
│   │   ├── config/
│   │   │   └── api.js               # Axios configuration
│   │   ├── App.js                   # Main app component
│   │   ├── App.css                  # Global styles
│   │   └── index.js                 # React entry point
│   └── package.json
├── .env                              # Environment variables
├── .gitignore
├── package.json
├── README.md
├── QUICKSTART.md
├── TESTING.md
└── start.bat                         # Windows startup script
```

## 🧪 Testing

See [TESTING.md](TESTING.md) for detailed API testing guide.

### Quick Test Flow:
1. Start the application
2. Navigate to http://localhost:3000
3. Add a driver (Drivers section)
4. Add a farmer (Farmers section)
5. Record a milk collection (Milk Collections section)
6. Create a delivery (Deliveries section)

## 🌐 Database

**Connection String:**
```
mongodb+srv://admin:zUwJYfxBUS1dfImJ@cluster0.82iazhd.mongodb.net/DairyLicious?retryWrites=true&w=majority
```

**Database Name:** `dairy_shop`

**Collections:**
- drivers
- farmers
- milkcollections
- deliveries

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://admin:zUwJYfxBUS1dfImJ@cluster0.82iazhd.mongodb.net/DairyLicious?retryWrites=true&w=majority
MONGODB_DB=dairy_shop
PORT=5000
JWT_SECRET=daily_licious_secret_key_2024
NODE_ENV=development
```

### Frontend (frontend/.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📱 User Interface

The application features:
- Modern, responsive design
- Gradient color scheme (Purple/Blue theme)
- Easy navigation between sections
- Data tables with search and filter
- Form validation
- Success/Error notifications
- Mobile-friendly layout

## 🔐 Security Notes

⚠️ **For Production:**
- Change JWT_SECRET to a strong random string
- Enable authentication and authorization
- Use HTTPS
- Implement rate limiting
- Add input sanitization
- Enable CORS properly
- Use environment variables for all secrets

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check internet connection
- Verify MongoDB Atlas credentials
- Ensure IP address is whitelisted in MongoDB Atlas

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Use different port when prompted

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For issues or questions:
- Check documentation in README.md
- Review TESTING.md for API testing
- Check console logs for errors

## 🏢 Company Information

**Company Name:** Daily Licious  
**Location:** Sri Lanka  
**Industry:** Dairy Product Manufacturing  
**Services:** 
- Product Delivery
- Milk Collection from Farmers

---

**Version:** 1.0.0  
**Last Updated:** October 4, 2024

🥛 **Daily Licious - Managing Dairy Excellence Since 2024**
