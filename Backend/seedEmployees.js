import mongoose from 'mongoose';
import Employee from './Model/EmployeeModel.js';

// Sample employee data with the correct EMP#### format
const sampleEmployees = [
  {
    employee_id: "EMP0001",
    name: "John Doe",
    NIC: "199912345678",
    email: "john.doe@dairylicious.com",
    phone: "0771234567",
    role: "Sales Manager",
    date_of_birth: "1999-01-15",
    basic_salary: 75000,
    status: "Active",
    department: "SALES",
    join_date: "2023-09-16",
    address: "123 Main Street, Colombo",
    gender: "Male"
  },
  {
    employee_id: "EMP0002",
    name: "Jane Smith",
    NIC: "199512345679",
    email: "jane.smith@dairylicious.com",
    phone: "0771234568",
    role: "Marketing Executive",
    date_of_birth: "1995-03-22",
    basic_salary: 65000,
    status: "Active",
    department: "MARKETING",
    join_date: "2023-10-01",
    address: "456 Park Avenue, Kandy",
    gender: "Female"
  },
  {
    employee_id: "EMP0003",
    name: "Michael Johnson",
    NIC: "199812345680",
    email: "michael.johnson@dairylicious.com",
    phone: "0771234569",
    role: "IT Support",
    date_of_birth: "1998-07-10",
    basic_salary: 70000,
    status: "Active",
    department: "IT",
    join_date: "2023-08-15",
    address: "789 Tech Street, Galle",
    gender: "Male"
  },
  {
    employee_id: "EMP0004",
    name: "Sarah Williams",
    NIC: "199612345681",
    email: "sarah.williams@dairylicious.com",
    phone: "0771234570",
    role: "HR Manager",
    date_of_birth: "1996-05-18",
    basic_salary: 80000,
    status: "Active",
    department: "HR",
    join_date: "2023-07-01",
    address: "321 HR Lane, Negombo",
    gender: "Female"
  },
  {
    employee_id: "EMP0005",
    name: "David Brown",
    NIC: "199412345682",
    email: "david.brown@dairylicious.com",
    phone: "0771234571",
    role: "Finance Manager",
    date_of_birth: "1994-09-12",
    basic_salary: 85000,
    status: "Active",
    department: "FINANCE",
    join_date: "2023-06-15",
    address: "654 Finance Road, Kurunegala",
    gender: "Male"
  }
];

async function seedEmployees() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dairy_shop');
    console.log('Connected to MongoDB');

    // Clear existing employees (optional)
    // await Employee.deleteMany({});
    // console.log('Cleared existing employees');

    // Insert sample employees
    for (const employeeData of sampleEmployees) {
      try {
        const existingEmployee = await Employee.findOne({ employee_id: employeeData.employee_id });
        if (!existingEmployee) {
          const employee = new Employee(employeeData);
          await employee.save();
          console.log(`Added employee: ${employeeData.employee_id} - ${employeeData.name}`);
        } else {
          console.log(`Employee ${employeeData.employee_id} already exists, skipping...`);
        }
      } catch (error) {
        console.error(`Error adding employee ${employeeData.employee_id}:`, error.message);
      }
    }

    console.log('Employee seeding completed!');
    
    // List all employees
    const employees = await Employee.find({});
    console.log('\nCurrent employees in database:');
    employees.forEach(emp => {
      console.log(`- ${emp.employee_id}: ${emp.name} (${emp.role})`);
    });

  } catch (error) {
    console.error('Error seeding employees:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeder
seedEmployees();