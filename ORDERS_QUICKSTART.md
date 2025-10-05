# Quick Start - Orders Module

## Setup Steps

### 1. Add Sample Orders to Database
```powershell
cd c:\Delivery\backend
node seedOrders.js
```

Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared existing orders
✅ Successfully added 5 sample orders

📦 Sample Orders:
- ORD-001: Kasun Perera - Rs.1790
- ORD-002: Nimal Silva - Rs.1550
- ORD-003: Sanduni Fernando - Rs.3500
- ORD-004: Rajitha Jayawardena - Rs.1950
- ORD-005: Chamari Wickramasinghe - Rs.3530
```

### 2. Start Backend (if not already running)
```powershell
cd c:\Delivery\backend
npm start
```

Expected output:
```
Server running on port 5000
✅ MongoDB Connected Successfully
```

### 3. Start Frontend (if not already running)
```powershell
cd c:\Delivery\frontend
npm start
```

Opens automatically at: http://localhost:3000

## Testing the Orders Module

### Step 1: View Orders
1. Open http://localhost:3000
2. Click **"Orders"** in the sidebar (shopping cart icon)
3. You should see 5 order cards displayed

### Step 2: Assign a Driver to an Order
1. Find any order with status **"Pending"**
2. Click **"Assign Driver"** button
3. A modal popup will appear
4. Select a driver from the dropdown
5. Click **"Assign Driver"**
6. The modal closes
7. Order status changes to **"Assigned"**
8. Driver name appears in the card

### Step 3: Start Delivery
1. Find the order you just assigned a driver to
2. Click **"Start Delivery"** button
3. Order status changes to **"In Transit"**

### Step 4: Mark as Delivered
1. Click **"Mark Delivered"** button
2. Order status changes to **"Delivered"**
3. Delivered date is set

## Features to Test

### ✅ View Orders
- All 5 sample orders displayed in cards
- Customer names and order IDs visible
- Total amounts shown
- Delivery addresses displayed
- Order and requested delivery dates shown
- Product count visible

### ✅ Status Badges
- **Pending**: Yellow/Orange badge
- **Assigned**: Blue badge  
- **In Transit**: Purple badge
- **Delivered**: Green badge
- **Cancelled**: Red badge

### ✅ Payment Status
- **Pending**: Orange text
- **Paid**: Green text
- **Refunded**: Red text

### ✅ Driver Assignment
- Modal opens with driver dropdown
- Only shows active drivers
- Displays driver name, vehicle number, type
- Updates order status to "Assigned"
- Can reassign driver (change driver)

### ✅ Status Progression
- Pending → Assign Driver → Assigned
- Assigned → Start Delivery → In Transit
- In Transit → Mark Delivered → Delivered

### ✅ Button Behavior
- "Assign Driver" available for Pending/Assigned orders
- "Start Delivery" appears only for Assigned orders
- "Mark Delivered" appears only for In Transit orders
- Buttons disabled for Delivered/Cancelled orders

### ✅ Responsive Design
- Works on desktop
- Works on tablet
- Works on mobile

## Troubleshooting

### Problem: No orders showing
**Solution**: Run the seed script again
```powershell
cd c:\Delivery\backend
node seedOrders.js
```

### Problem: No drivers in dropdown
**Solution**: Add drivers first through Drivers module
1. Go to Drivers tab
2. Click "Add New Driver"
3. Fill in driver details
4. Set status to "Active"
5. Save

### Problem: Backend not starting
**Error**: `EADDRINUSE: address already in use :::5000`
**Solution**: Backend is already running, no action needed

### Problem: Frontend not connecting to backend
**Solution**: 
1. Check backend is running on port 5000
2. Check frontend .env has correct API URL
3. Restart both servers

## Sample Data Details

### Order 1
- **ID**: ORD-001
- **Customer**: Kasun Perera (Colombo)
- **Amount**: Rs. 1,790
- **Products**: Fresh Milk (5), Yogurt (3)
- **Notes**: "Please deliver before 9 AM"

### Order 2
- **ID**: ORD-002
- **Customer**: Nimal Silva (Kandy)
- **Amount**: Rs. 1,550
- **Products**: Butter (2), Cheese (1)

### Order 3
- **ID**: ORD-003
- **Customer**: Sanduni Fernando (Negombo)
- **Amount**: Rs. 3,500
- **Products**: Fresh Milk (10), Curd (5)
- **Payment**: Already Paid (Card)

### Order 4
- **ID**: ORD-004
- **Customer**: Rajitha Jayawardena (Galle)
- **Amount**: Rs. 1,950
- **Products**: Cheese (3)

### Order 5
- **ID**: ORD-005
- **Customer**: Chamari Wickramasinghe (Kurunegala)
- **Amount**: Rs. 3,530
- **Products**: Fresh Milk (8), Yogurt (6), Butter (1)

## Next Steps

After testing, you can:
1. Add more orders via the seed script (modify seedOrders.js)
2. Integrate with real order system
3. Add filtering/search functionality
4. Implement delivery route optimization
5. Add delivery proof of delivery
6. Create order reports

---

**Ready to test!** 🚀
Start with the backend, run the seed script, then test in the browser.
