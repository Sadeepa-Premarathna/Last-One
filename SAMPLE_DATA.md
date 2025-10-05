# Sample Data for Testing Daily Licious

## Sample Driver Data

### Driver 1
```json
{
  "driverId": "DRV001",
  "firstName": "Kamal",
  "lastName": "Perera",
  "nic": "198512345678",
  "licenseNumber": "B1234567",
  "contactNumber": "0771234567",
  "email": "kamal@dailylicious.lk",
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

### Driver 2
```json
{
  "driverId": "DRV002",
  "firstName": "Sunil",
  "lastName": "Fernando",
  "nic": "199012345678",
  "licenseNumber": "B2345678",
  "contactNumber": "0779876543",
  "email": "sunil@dailylicious.lk",
  "address": {
    "street": "456 Temple Road",
    "city": "Galle",
    "district": "Galle",
    "postalCode": "80000"
  },
  "vehicleNumber": "CAR-5678",
  "vehicleType": "Truck",
  "status": "Active",
  "assignedRoute": "Galle - Matara"
}
```

---

## Sample Farmer Data

### Farmer 1
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

### Farmer 2
```json
{
  "farmerId": "FRM002",
  "firstName": "Chaminda",
  "lastName": "Wickramasinghe",
  "nic": "198212345678",
  "contactNumber": "0712345678",
  "address": {
    "street": "789 Village Road",
    "city": "Anuradhapura",
    "district": "Anuradhapura",
    "postalCode": "50000"
  },
  "numberOfCows": 25,
  "status": "Active",
  "bankDetails": {
    "bankName": "Commercial Bank",
    "accountNumber": "9876543210",
    "accountHolderName": "Chaminda Wickramasinghe",
    "branch": "Anuradhapura"
  }
}
```

### Farmer 3
```json
{
  "farmerId": "FRM003",
  "firstName": "Priyantha",
  "lastName": "Jayawardena",
  "nic": "197512345678",
  "contactNumber": "0763456789",
  "address": {
    "street": "321 Dairy Lane",
    "city": "Kandy",
    "district": "Kandy",
    "postalCode": "20000"
  },
  "numberOfCows": 20,
  "status": "Active",
  "bankDetails": {
    "bankName": "Sampath Bank",
    "accountNumber": "5555666677",
    "accountHolderName": "Priyantha Jayawardena",
    "branch": "Kandy"
  }
}
```

---

## Sample Milk Collection Data

### Collection 1 (Use actual Farmer & Driver IDs from DB)
```json
{
  "collectionId": "MC001",
  "farmer": "PASTE_FARMER_OBJECT_ID_HERE",
  "driver": "PASTE_DRIVER_OBJECT_ID_HERE",
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
  "status": "Collected",
  "notes": "Good quality milk"
}
```

### Collection 2
```json
{
  "collectionId": "MC002",
  "farmer": "PASTE_FARMER_OBJECT_ID_HERE",
  "driver": "PASTE_DRIVER_OBJECT_ID_HERE",
  "collectionDate": "2024-10-04",
  "collectionTime": "Evening",
  "quantity": 65.0,
  "unit": "Liters",
  "quality": {
    "fatContent": 4.8,
    "snf": 8.8,
    "temperature": 3.5,
    "smell": "Normal",
    "grade": "A"
  },
  "pricePerLiter": 105,
  "paymentStatus": "Paid",
  "status": "Delivered",
  "notes": "Premium quality"
}
```

### Collection 3
```json
{
  "collectionId": "MC003",
  "farmer": "PASTE_FARMER_OBJECT_ID_HERE",
  "driver": "PASTE_DRIVER_OBJECT_ID_HERE",
  "collectionDate": "2024-10-03",
  "collectionTime": "Morning",
  "quantity": 80.0,
  "unit": "Liters",
  "quality": {
    "fatContent": 4.2,
    "snf": 8.3,
    "temperature": 4.5,
    "smell": "Normal",
    "grade": "B"
  },
  "pricePerLiter": 95,
  "paymentStatus": "Pending",
  "status": "In Transit",
  "notes": "Slightly lower fat content"
}
```

---

## Sample Delivery Data

### Delivery 1 (Use actual Driver ID from DB)
```json
{
  "deliveryId": "DEL001",
  "driver": "PASTE_DRIVER_OBJECT_ID_HERE",
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
  "route": "Colombo Route 1",
  "notes": "Morning delivery"
}
```

### Delivery 2
```json
{
  "deliveryId": "DEL002",
  "driver": "PASTE_DRIVER_OBJECT_ID_HERE",
  "deliveryDate": "2024-10-04",
  "customer": {
    "name": "Hotel Grand",
    "contactNumber": "0114567890",
    "address": {
      "street": "101 Hotel Road",
      "city": "Kandy",
      "district": "Kandy",
      "postalCode": "20000"
    }
  },
  "products": [
    {
      "productName": "Fresh Milk 2L",
      "productType": "Fresh Milk",
      "quantity": 200,
      "unit": "Liters",
      "pricePerUnit": 145,
      "totalPrice": 29000
    },
    {
      "productName": "Curd 400ml",
      "productType": "Curd",
      "quantity": 100,
      "unit": "Pieces",
      "pricePerUnit": 120,
      "totalPrice": 12000
    },
    {
      "productName": "Butter 500g",
      "productType": "Butter",
      "quantity": 20,
      "unit": "Kilograms",
      "pricePerUnit": 800,
      "totalPrice": 16000
    }
  ],
  "totalAmount": 57000,
  "deliveryStatus": "In Transit",
  "paymentStatus": "Partial",
  "paymentMethod": "Online Transfer",
  "route": "Colombo - Kandy Highway",
  "notes": "Bulk order for hotel"
}
```

### Delivery 3
```json
{
  "deliveryId": "DEL003",
  "driver": "PASTE_DRIVER_OBJECT_ID_HERE",
  "deliveryDate": "2024-10-03",
  "customer": {
    "name": "Bakery Paradise",
    "contactNumber": "0112223344",
    "address": {
      "street": "55 Bakery Lane",
      "city": "Galle",
      "district": "Galle",
      "postalCode": "80000"
    }
  },
  "products": [
    {
      "productName": "Fresh Milk 5L",
      "productType": "Fresh Milk",
      "quantity": 50,
      "unit": "Liters",
      "pricePerUnit": 140,
      "totalPrice": 7000
    },
    {
      "productName": "Yogurt 500ml",
      "productType": "Yogurt",
      "quantity": 30,
      "unit": "Pieces",
      "pricePerUnit": 150,
      "totalPrice": 4500
    },
    {
      "productName": "Cheese 200g",
      "productType": "Cheese",
      "quantity": 15,
      "unit": "Kilograms",
      "pricePerUnit": 1200,
      "totalPrice": 18000
    }
  ],
  "totalAmount": 29500,
  "deliveryStatus": "Delivered",
  "paymentStatus": "Paid",
  "paymentMethod": "Card",
  "route": "Galle - Matara",
  "notes": "Regular customer, delivered successfully"
}
```

---

## Testing Order

1. **Create Drivers** (2-3 drivers)
2. **Create Farmers** (3-4 farmers)
3. **Create Milk Collections** (Use farmer and driver IDs from step 1 & 2)
4. **Create Deliveries** (Use driver IDs from step 1)

## Notes
- Replace `PASTE_FARMER_OBJECT_ID_HERE` with actual MongoDB ObjectID after creating farmers
- Replace `PASTE_DRIVER_OBJECT_ID_HERE` with actual MongoDB ObjectID after creating drivers
- All monetary values are in Sri Lankan Rupees (Rs.)
- Dates are in YYYY-MM-DD format
- Collections can be Morning or Evening
- Quality grades: A (Best), B (Good), C (Average), Rejected

## Sri Lankan Districts Reference
Common districts in Sri Lanka:
- Colombo
- Gampaha
- Kalutara
- Kandy
- Matale
- Nuwara Eliya
- Galle
- Matara
- Hambantota
- Jaffna
- Kilinochchi
- Mannar
- Vavuniya
- Mullaitivu
- Batticaloa
- Ampara
- Trincomalee
- Kurunegala
- Puttalam
- Anuradhapura
- Polonnaruwa
- Badulla
- Moneragala
- Ratnapura
- Kegalle
