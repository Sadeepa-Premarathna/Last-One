import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true,
    match: /^EMP\d{4}$/  // Must start with EMP followed by exactly 4 digits
  },
  name: {
    type: String,
    required: true
  },
  NIC: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  date_of_birth: {
    type: Date,
    required: true
  },
  basic_salary: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  department: {
    type: String,
    required: true
  },
  join_date: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  }
}, {
  timestamps: true
});

// Specify the collection name explicitly to avoid conflicts with HR module
const EmployeeManagement = mongoose.model('EmployeeManagement', employeeSchema, 'employee_management');

export default EmployeeManagement;