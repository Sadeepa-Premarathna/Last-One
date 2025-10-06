import mongoose from 'mongoose';
import Employee from './Model/EmployeeModel.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const seedTestEmployee = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if test employee already exists
    const existingEmployee = await Employee.findOne({ employee_id: 'EMP0001' });
    
    if (existingEmployee) {
      console.log('✅ Test employee EMP0001 already exists:');
      console.log('Name:', existingEmployee.name);
      console.log('Role:', existingEmployee.role);
      console.log('Email:', existingEmployee.email);
    } else {
      // Create test employee
      const testEmployee = new Employee({
        employee_id: 'EMP0001',
        name: 'John Doe',
        NIC: '123456789V',
        email: 'john.doe@dairylicious.com',
        phone: '+94771234567',
        role: 'Production Manager',
        date_of_birth: new Date('1990-01-15'),
        basic_salary: 75000,
        status: 'Active',
        department: 'Production',
        join_date: new Date('2023-01-01'),
        address: '123 Main Street, Colombo',
        gender: 'Male'
      });

      await testEmployee.save();
      console.log('✅ Test employee EMP0001 created successfully!');
    }

    // Create additional test employees
    const testEmployees = [
      {
        employee_id: 'EMP0002',
        name: 'Jane Smith',
        NIC: '987654321V',
        email: 'jane.smith@dairylicious.com',
        phone: '+94779876543',
        role: 'HR Manager',
        date_of_birth: new Date('1988-03-20'),
        basic_salary: 85000,
        status: 'Active',
        department: 'Human Resources',
        join_date: new Date('2022-06-15'),
        address: '456 Park Road, Kandy',
        gender: 'Female'
      },
      {
        employee_id: 'EMP0003',
        name: 'Mike Johnson',
        NIC: '456789123V',
        email: 'mike.johnson@dairylicious.com',
        phone: '+94775551234',
        role: 'Quality Controller',
        date_of_birth: new Date('1992-07-10'),
        basic_salary: 65000,
        status: 'Active',
        department: 'Quality Assurance',
        join_date: new Date('2023-03-01'),
        address: '789 Hill Street, Galle',
        gender: 'Male'
      }
    ];

    for (const emp of testEmployees) {
      const existing = await Employee.findOne({ employee_id: emp.employee_id });
      if (!existing) {
        await Employee.create(emp);
        console.log(`✅ Employee ${emp.employee_id} (${emp.name}) created`);
      } else {
        console.log(`✅ Employee ${emp.employee_id} already exists`);
      }
    }

    console.log('\n📊 Total employees in database:', await Employee.countDocuments());
    
  } catch (error) {
    console.error('❌ Error seeding employees:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
  }
};

seedTestEmployee();