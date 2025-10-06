# Daily Licious - Dairy Management System

A comprehensive MERN stack application for managing dairy product deliveries and milk collection from farmers in Sri Lanka.

## 🚀 Features

### Delivery Management
- Track product deliveries to customers
- Assign deliveries to drivers
- Monitor delivery status (Pending, In Transit, Delivered, Failed, Cancelled)
- Multiple product types support (Fresh Milk, Curd, Yogurt, Cheese, Butter, Ice Cream)
- Payment tracking (Cash, Card, Online Transfer, Credit)
- Customer signature capture

### Milk Collection Management
- Record milk collections from farmers
- Morning and Evening collection sessions
- Quality assessment (Fat content, SNF, Temperature, Smell, Grade)
- Automatic price calculation
- Payment status tracking
- Collection history by farmer

### Driver Management
- Driver registration with complete details
- NIC and License verification
- Vehicle assignment
- Route management
- Active/Inactive status tracking
- Contact information

### Farmer Management
- Farmer registration
- Farm location tracking
- Number of cows tracking
- Bank details for payments
- Active/Inactive/Suspended status

## 📁 Project Structure

```
Daily Licious/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── driverController.js
│   │   ├── farmerController.js
│   │   ├── deliveryController.js
│   │   └── milkCollectionController.js
│   ├── models/
│   │   ├── Driver.js
│   │   ├── Farmer.js
│   │   ├── Delivery.js
│   │   └── MilkCollection.js
│   ├── routes/
│   │   ├── driverRoutes.js
│   │   ├── farmerRoutes.js
│   │   ├── deliveryRoutes.js
│   │   └── milkCollectionRoutes.js
│   └── server.js
├── frontend/ (React app - to be created)
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`:
```
MONGODB_URI=mongodb+srv://admin:zUwJYfxBUS1dfImJ@cluster0.82iazhd.mongodb.net/DairyLicious?retryWrites=true&w=majority
MONGODB_DB=dairy_shop
PORT=5000
JWT_SECRET=daily_licious_secret_key_2024
NODE_ENV=development
```

3. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run server
```

## 📡 API Endpoints

### Drivers
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:id` - Get single driver
- `POST /api/drivers` - Create new driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver
- `GET /api/drivers/status/active` - Get active drivers

### Farmers
- `GET /api/farmers` - Get all farmers
- `GET /api/farmers/:id` - Get single farmer
- `POST /api/farmers` - Create new farmer
- `PUT /api/farmers/:id` - Update farmer
- `DELETE /api/farmers/:id` - Delete farmer
- `GET /api/farmers/status/active` - Get active farmers

### Deliveries
- `GET /api/deliveries` - Get all deliveries
- `GET /api/deliveries/:id` - Get single delivery
- `POST /api/deliveries` - Create new delivery
- `PUT /api/deliveries/:id` - Update delivery
- `DELETE /api/deliveries/:id` - Delete delivery
- `GET /api/deliveries/status/:status` - Get deliveries by status
- `GET /api/deliveries/driver/:driverId` - Get deliveries by driver
- `GET /api/deliveries/date-range?startDate=&endDate=` - Get deliveries by date range

### Milk Collections
- `GET /api/milk-collections` - Get all collections
- `GET /api/milk-collections/:id` - Get single collection
- `POST /api/milk-collections` - Create new collection
- `PUT /api/milk-collections/:id` - Update collection
- `DELETE /api/milk-collections/:id` - Delete collection
- `GET /api/milk-collections/farmer/:farmerId` - Get collections by farmer
- `GET /api/milk-collections/date-range?startDate=&endDate=` - Get collections by date range

## 📊 Data Models

### Driver Schema
```javascript
{
  driverId: String (unique),
  firstName: String,
  lastName: String,
  nic: String (unique),
  licenseNumber: String (unique),
  contactNumber: String,
  email: String,
  address: { street, city, district, postalCode },
  vehicleNumber: String,
  vehicleType: Enum,
  status: Enum,
  assignedRoute: String
}
```

### Farmer Schema
```javascript
{
  farmerId: String (unique),
  firstName: String,
  lastName: String,
  nic: String (unique),
  contactNumber: String,
  address: { street, city, district, postalCode },
  farmLocation: { latitude, longitude, description },
  numberOfCows: Number,
  status: Enum,
  bankDetails: { bankName, accountNumber, accountHolderName, branch }
}
```

### Delivery Schema
```javascript
{
  deliveryId: String (unique),
  driver: ObjectId (ref: Driver),
  deliveryDate: Date,
  customer: { name, contactNumber, address },
  products: [{ productName, productType, quantity, unit, pricePerUnit, totalPrice }],
  totalAmount: Number,
  deliveryStatus: Enum,
  paymentStatus: Enum,
  paymentMethod: Enum,
  route: String,
  notes: String
}
```

### Milk Collection Schema
```javascript
{
  collectionId: String (unique),
  farmer: ObjectId (ref: Farmer),
  driver: ObjectId (ref: Driver),
  collectionDate: Date,
  collectionTime: Enum (Morning/Evening),
  quantity: Number,
  quality: { fatContent, snf, temperature, smell, grade },
  pricePerLiter: Number,
  totalAmount: Number (auto-calculated),
  paymentStatus: Enum,
  status: Enum
}
```

## 🔒 Security Notes
- Change the JWT_SECRET in production
- Use environment variables for sensitive data
- Implement authentication and authorization for production
- Add input validation middleware
- Use HTTPS in production

## 🚦 Next Steps

1. Create React frontend
2. Implement authentication (JWT)
3. Add role-based access control
4. Create dashboard with analytics
5. Add real-time notifications
6. Implement reporting features
7. Add mobile app support

## 👨‍💻 Development

```bash
# Install all dependencies (backend + frontend)
npm run install-all

# Run backend only
npm run server

# Run frontend only
npm run client

# Run both concurrently
npm run dev
```

## 📝 License
ISC

## 🏢 Company
Daily Licious - Sri Lanka's Premier Dairy Management Solution
