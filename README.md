# 🥛 Dairy Licious Management System

> Complete MERN Stack Application for Dairy Manufacturing Management

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Backend](https://img.shields.io/badge/backend-running-brightgreen)]()
[![Frontend](https://img.shields.io/badge/frontend-running-brightgreen)]()
[![Database](https://img.shields.io/badge/database-connected-blue)]()

---

## 🎯 Overview

**Dairy Licious** is a comprehensive management system designed for dairy manufacturing operations, featuring financial management and human resources modules.

### 🌟 Key Features

- 💰 **Finance Module** - Complete financial management system
- 👥 **HR Module** - Full human resources management
- 📊 **Real-time Dashboard** - Live analytics and insights
- 📱 **Responsive Design** - Works on all devices
- 🔒 **Secure** - Protected API endpoints
- ⚡ **Fast** - Optimized performance

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd DairyLuicious_Merge

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
node Server.js
```
✅ Backend running on http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:5174

### Access Application
👉 **Open Browser:** http://localhost:5174

---

## 📁 Project Structure

```
DairyLuicious_Merge/
├── backend/                    # Node.js + Express Backend
│   ├── Server.js              # Main server file
│   ├── config/                # Database configuration
│   ├── features/
│   │   ├── finance/           # Finance module
│   │   │   ├── finance_Controllers/
│   │   │   ├── finance_Model/
│   │   │   └── finance_Routes/
│   │   └── hr/                # HR module
│   │       ├── Controllers/
│   │       ├── Models/
│   │       ├── Routes/
│   │       └── Services/
│   └── middleware/            # Error handling
│
└── frontend/                   # React + TypeScript Frontend
    ├── src/
    │   ├── App.tsx            # Main application
    │   ├── main.tsx           # Entry point
    │   ├── config/            # API configuration
    │   ├── components/        # Shared components
    │   └── features/
    │       ├── finance/       # Finance module UI
    │       └── hr/            # HR module UI
    └── package.json
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (ES6 Modules)
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Validation:** Joi
- **CORS:** Enabled

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Icons:** Lucide React

---

## 💼 Modules

### 💰 Finance Module

**Features:**
- Dashboard with financial overview
- Payroll calculation & salary slip generation
- Allowance management
- Revenue & expense tracking
- Additional expenses management
- Financial report generation
- PDF export functionality

**API Endpoints:**
```
GET    /api/finance/allowances
POST   /api/finance/allowances
PUT    /api/finance/allowances/:id
DELETE /api/finance/allowances/:id

GET    /api/finance/expenses
POST   /api/finance/expenses
PUT    /api/finance/expenses/:id
DELETE /api/finance/expenses/:id

GET    /api/finance/salary-slips
POST   /api/finance/salary-slips
```

### 👥 HR Module

**Features:**
- HR Dashboard with KPIs
- Employee records management (CRUD)
- Attendance tracking & correction
- Leave application management
- Payroll processing
- Employee analytics & reports
- Bulk upload functionality
- Employee insights & growth charts

**API Endpoints:**
```
GET    /api/hr/employees
POST   /api/hr/employees
PUT    /api/hr/employees/:id
DELETE /api/hr/employees/:id

GET    /api/hr/attendance
POST   /api/hr/attendance
PUT    /api/hr/attendance/:id

GET    /api/hr/leaves
POST   /api/hr/leaves
PUT    /api/hr/leaves/:id

GET    /api/hr/payroll
POST   /api/hr/payroll
```

---

## 🔧 Configuration

### Backend Environment (`.env`)
```env
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/DairyLicious
NODE_ENV=development
```

### Frontend Environment (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_ENV=development
VITE_ENABLE_DEBUG=true
```

---

## 📊 Database Schema

### Employee Model
```javascript
{
  employee_id: String,
  name: String,
  nic: String,
  email: String,
  phone: String,
  role: String,
  department: String,
  basic_salary: Number,
  join_date: Date,
  status: String,
  // ... more fields
}
```

### Allowance Model
```javascript
{
  employeeId: String,
  month: String,
  allowances: [{
    type: String,
    amount: Number
  }],
  totalAmount: Number,
  // ... more fields
}
```

### Salary Slip Model
```javascript
{
  employeeId: String,
  month: String,
  basicSalary: Number,
  allowances: Number,
  deductions: Number,
  netSalary: Number,
  paymentStatus: String,
  // ... more fields
}
```

---

## 🌐 API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication
Currently, the API is open. Future versions will include JWT authentication.

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error message",
  "error": {}
}
```

---

## 🧪 Testing

### Backend Testing
```bash
# Test backend health
curl http://localhost:8000

# Test Finance endpoints
curl http://localhost:8000/api/finance/allowances

# Test HR endpoints
curl http://localhost:8000/api/hr/employees
```

### Frontend Testing
1. Open http://localhost:5174
2. Check connection indicator (bottom-right corner)
3. Navigate through modules
4. Test CRUD operations
5. Generate reports

---

## 📚 Documentation

- **[PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md)** - Complete project guide
- **[BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md)** - Backend architecture
- **[FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md)** - Frontend structure
- **[CONNECTION_GUIDE.md](./CONNECTION_GUIDE.md)** - Connection setup
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference

---

## 🎨 Screenshots

### Home Dashboard
Beautiful landing page with module selection

### Finance Module
- Dashboard with financial metrics
- Payroll management interface
- Revenue/Expense tracking charts
- Report generation tools

### HR Module
- Employee management dashboard
- Attendance tracking calendar
- Leave management system
- Payroll processing interface

---

## 🚀 Deployment

### Backend Deployment
```bash
# Build and run
cd backend
npm start
```

### Frontend Deployment
```bash
# Build for production
cd frontend
npm run build

# Preview production build
npm run preview
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👥 Team

- **Backend Development** - Node.js, Express, MongoDB
- **Frontend Development** - React, TypeScript, Tailwind
- **Database Design** - MongoDB Schema Design
- **UI/UX Design** - Modern, Responsive Interface

---

## 📞 Support

For support, please refer to the documentation files or open an issue.

---

## 🎉 Acknowledgments

- Built with MERN Stack
- Styled with Tailwind CSS
- Icons by Lucide
- Charts by Recharts

---

## 📈 Project Stats

- **Total Lines of Code:** 10,000+
- **Components:** 96+
- **API Endpoints:** 20+
- **Database Collections:** 8+
- **Dependencies:** 75+

---

## 🔮 Future Enhancements

- [ ] User authentication & authorization (JWT)
- [ ] Role-based access control
- [ ] Email notifications
- [ ] Advanced reporting & analytics
- [ ] Mobile application (React Native)
- [ ] PDF/Excel export improvements
- [ ] Automated testing suite
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Cloud deployment (AWS/Azure)

---

**Built with ❤️ for Dairy Manufacturing Management**

*Last Updated: October 8, 2025*
