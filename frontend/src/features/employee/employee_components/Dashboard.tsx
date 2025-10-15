import React from 'react';
import { User, Mail, Phone, Calendar, DollarSign, Badge } from 'lucide-react';
import { useEmployee } from '../employee_context/EmployeeContext';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { employee, loading } = useEmployee();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p>Unable to load employee details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
        <div className="text-sm text-gray-500">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {/* Employee Details Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{employee.name}</h2>
            <p className="text-gray-600">{employee.role}</p>
            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              employee.status === 'Active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {employee.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Badge className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="font-medium text-gray-800">{employee.employee_id}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{employee.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">{employee.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-800">
                {format(new Date(employee.date_of_birth), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Basic Salary</p>
              <p className="font-medium text-gray-800">
                Rs. {employee.basic_salary.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">NIC</p>
              <p className="font-medium text-gray-800">{employee.nic}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;