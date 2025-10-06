# Daily Licious - Testing Guide

## API Testing Endpoints

### Base URL
```
http://localhost:5000/api
```

### 1. Driver Management

#### Create Driver (POST /api/drivers)
```json
{
  "driverId": "DRV001",
  "firstName": "Kamal",
  "lastName": "Perera",
  "nic": "198512345678",
  "licenseNumber": "B1234567",
  "contactNumber": "0771234567",
  "email": "kamal@example.com",
  "address": {
    "street": "123 Main Street",
    "city": "Colombo",
    "district": "Colombo",
    "postalCode": "00100"
  },
  "vehicleNumber": "CAR-1234",
  "vehicleType": "Van",
  "status": "Active",
  "assignedRoute": "Colombo - Kandy"
}
```

#### Get All Drivers (GET /api/drivers)
#### Get Active Drivers (GET /api/drivers/status/active)
#### Update Driver (PUT /api/drivers/:id)
#### Delete Driver (DELETE /api/drivers/:id)

---

### 2. Farmer Management

#### Create Farmer (POST /api/farmers)
```json
{
  "farmerId": "FRM001",
  "firstName": "Nimal",
  "lastName": "Silva",
  "nic": "197812345678",
  "contactNumber": "0779876543",
  "address": {
    "street": "456 Farm Road",
    "city": "Kurunegala",
    "district": "Kurunegala",
    "postalCode": "60000"
  },
  "numberOfCows": 15,
  "status": "Active",
  "bankDetails": {
    "bankName": "Bank of Ceylon",
    "accountNumber": "1234567890",
    "accountHolderName": "Nimal Silva",
    "branch": "Kurunegala"
  }
}
```

#### Get All Farmers (GET /api/farmers)
#### Get Active Farmers (GET /api/farmers/status/active)
#### Update Farmer (PUT /api/farmers/:id)
#### Delete Farmer (DELETE /api/farmers/:id)

---

### 3. Milk Collection Management

#### Create Collection (POST /api/milk-collections)
```json
{
  "collectionId": "MC001",
  "farmer": "FARMER_OBJECT_ID",
  "driver": "DRIVER_OBJECT_ID",
  "collectionDate": "2024-10-04",
  "collectionTime": "Morning",
  "quantity": 50.5,
  "unit": "Liters",
  "quality": {
    "fatContent": 4.5,
    "snf": 8.5,
    "temperature": 4,
    "smell": "Normal",
    "grade": "A"
  },
  "pricePerLiter": 100,
  "paymentStatus": "Pending",
  "status": "Collected"
}
```

#### Get All Collections (GET /api/milk-collections)
#### Get Collections by Farmer (GET /api/milk-collections/farmer/:farmerId)
#### Get Collections by Date Range (GET /api/milk-collections/date-range?startDate=2024-10-01&endDate=2024-10-31)
#### Update Collection (PUT /api/milk-collections/:id)
#### Delete Collection (DELETE /api/milk-collections/:id)

---

### 4. Delivery Management

#### Create Delivery (POST /api/deliveries)
```json
{
  "deliveryId": "DEL001",
  "driver": "DRIVER_OBJECT_ID",
  "deliveryDate": "2024-10-04",
  "customer": {
    "name": "Supermarket ABC",
    "contactNumber": "0112345678",
    "address": {
      "street": "789 Market Street",
      "city": "Colombo",
      "district": "Colombo",
      "postalCode": "00300"
    }
  },
  "products": [
    {
      "productName": "Fresh Milk 1L",
      "productType": "Fresh Milk",
      "quantity": 100,
      "unit": "Liters",
      "pricePerUnit": 150,
      "totalPrice": 15000
    },
    {
      "productName": "Yogurt 200ml",
      "productType": "Yogurt",
      "quantity": 50,
      "unit": "Pieces",
      "pricePerUnit": 80,
      "totalPrice": 4000
    }
  ],
  "totalAmount": 19000,
  "deliveryStatus": "Pending",
  "paymentStatus": "Pending",
  "paymentMethod": "Cash",
  "route": "Colombo Route 1"
}
```

#### Get All Deliveries (GET /api/deliveries)
#### Get Deliveries by Status (GET /api/deliveries/status/Pending)
#### Get Deliveries by Driver (GET /api/deliveries/driver/:driverId)
#### Get Deliveries by Date Range (GET /api/deliveries/date-range?startDate=2024-10-01&endDate=2024-10-31)
#### Update Delivery (PUT /api/deliveries/:id)
#### Delete Delivery (DELETE /api/deliveries/:id)

---

## Testing with Postman or Thunder Client

1. Start the backend server: `npm run server`
2. Use Postman or Thunder Client VS Code extension
3. Test endpoints in order:
   - First create drivers and farmers
   - Then create milk collections (using farmer and driver IDs)
   - Finally create deliveries (using driver IDs)

## Testing with Frontend

1. Start backend: `npm run server` (port 5000)
2. Start frontend: `cd frontend && npm start` (port 3000)
3. Navigate to http://localhost:3000

### Testing Flow:
1. Add drivers
2. Add farmers
3. Record milk collections from farmers
4. Create deliveries to customers
5. View and manage all records

## Database Verification

Connect to MongoDB Atlas using the provided connection string:
```
mongodb+srv://admin:zUwJYfxBUS1dfImJ@cluster0.82iazhd.mongodb.net/DairyLicious
```

Check collections:
- drivers
- farmers
- milkcollections
- deliveries
