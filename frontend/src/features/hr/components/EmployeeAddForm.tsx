import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { X, User, AlertCircle } from 'lucide-react';
import { Employee } from '../types';
import { API_ENDPOINTS } from '../config/api';

interface EmployeeAddFormProps {
  onClose: () => void;
  onCreate: (employee: Employee) => void;
}

// Current year for age validation
const MIN_AGE = 18;

// Validation Schema with all requirements
const validationSchema = Yup.object({
  employee_id: Yup.string()
    .matches(/^EMP\d{4}$/, 'Employee ID must start with "EMP" followed by exactly 4 digits (e.g., EMP0001)')
    .required('Employee ID is required'),
    
  name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Name must contain only letters and spaces')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .required('Employee Name is required'),
    
  nic: Yup.string()
    .matches(/^\d{10}$/, 'NIC must be exactly 10 digits (e.g., 2000123456)')
    .required('NIC is required'),
    
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
    
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
    
  role: Yup.string()
    .min(2, 'Role must be at least 2 characters')
    .required('Role is required'),
    
  department: Yup.string()
    .oneOf(['HR', 'Finance', 'Manufacturing', 'Sales', 'Distribution'], 'Please select a valid department')
    .required('Department is required'),
    
  status: Yup.string()
    .oneOf(['Active', 'Resigned', 'On Probation', 'On Leave'], 'Please select a valid status')
    .required('Status is required'),
    
  date_of_birth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('min-age', 'Employee must be at least 18 years old', function(value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= MIN_AGE;
      }
      return age >= MIN_AGE;
    })
    .required('Date of birth is required'),
    
  join_date: Yup.date()
    .max(new Date(), 'Join date cannot be in the future')
    .test('join-after-birth', 'Join date must be at least 18 years after date of birth', function(value) {
      const { date_of_birth } = this.parent;
      if (!value || !date_of_birth) return false;
      
      const birthDate = new Date(date_of_birth);
      const joinDate = new Date(value);
      const yearDiff = joinDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = joinDate.getMonth() - birthDate.getMonth();
      const dayDiff = joinDate.getDate() - birthDate.getDate();
      
      if (yearDiff > MIN_AGE) return true;
      if (yearDiff === MIN_AGE && monthDiff > 0) return true;
      if (yearDiff === MIN_AGE && monthDiff === 0 && dayDiff >= 0) return true;
      
      return false;
    })
    .required('Join date is required'),
    
  basic_salary: Yup.number()
    .positive('Salary must be a positive number')
    .min(1000, 'Salary must be at least 1000')
    .max(10000000, 'Salary cannot exceed 10,000,000')
    .required('Basic salary is required'),
    
  address: Yup.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address cannot exceed 200 characters'),
    
  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender')
    .required('Gender is required')
});

// Initial form values
const initialValues = {
  employee_id: '',
  name: '',
  nic: '',
  email: '',
  phone: '',
  role: '',
  department: '',
  status: 'Active',
  date_of_birth: '',
  join_date: '',
  basic_salary: '',
  address: '',
  gender: ''
};

const EmployeeAddForm: React.FC<EmployeeAddFormProps> = ({ onClose, onCreate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validation functions for real-time checks
  const validateEmployeeId = async (value: string) => {
    if (!value || !value.match(/^EMP\d{4}$/)) return undefined;
    try {
      const response = await axios.get(`${API_ENDPOINTS.employees}/check-employee-id/${value}`);
      if (response.data.exists) {
        return 'Employee ID already exists';
      }
    } catch (error) {
      console.error('Error checking employee ID:', error);
      return undefined; // Don't block on network errors
    }
    return undefined;
  };

  const validateNIC = async (value: string) => {
    // Check if value matches exactly 10 digits before making API call
    if (!value || !value.match(/^\d{10}$/)) return undefined;
    try {
      const response = await axios.get(`${API_ENDPOINTS.employees}/check-nic/${value}`);
      if (response.data.exists) {
        return 'NIC already exists';
      }
    } catch (error) {
      console.error('Error checking NIC:', error);
      return undefined; // Don't block on network errors
    }
    return undefined;
  };

  const validateEmail = async (value: string) => {
    if (!value || !Yup.string().email().isValidSync(value)) return undefined;
    try {
      const response = await axios.get(`${API_ENDPOINTS.employees}/check-email/${encodeURIComponent(value)}`);
      if (response.data.exists) {
        return 'Email already exists';
      }
    } catch (error) {
      console.error('Error checking email:', error);
      return undefined; // Don't block on network errors
    }
    return undefined;
  };

  const handleSubmit = async (values: typeof initialValues, { setFieldError }: any) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log('📤 Submitting employee data:', values);

      // Map frontend field names to backend field names
      const { nic, ...otherValues } = values;
      const backendPayload = {
        ...otherValues,
        NIC: nic, // Map lowercase nic to uppercase NIC
      };

      console.log('📤 Backend payload:', backendPayload);

      // Use axios for better error handling
      const response = await axios.post(API_ENDPOINTS.employees, backendPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      console.log('✅ Server response:', response.data);

      // Check if the response indicates success
      if (response.data.success && response.data.employee) {
        const employee = response.data.employee;
        
        // Success - create employee object for frontend
        const newEmployee: Employee = {
          id: employee._id || employee.id,
          employeeId: employee.employee_id,
          name: employee.name,
          nic: employee.NIC,
          email: employee.email,
          phone: employee.phone,
          role: employee.role,
          department: employee.department,
          status: employee.status as Employee['status'],
          joinDate: new Date(employee.join_date).toISOString().split('T')[0],
          dateOfBirth: new Date(employee.date_of_birth).toISOString().split('T')[0], 
          salary: employee.basic_salary,
          address: employee.address || '',
          gender: employee.gender || 'Not specified',
          bankAccount: '',
          epfEligible: true,
          etfEligible: true,
          attendanceRate: 95
        };

        console.log('🎉 Employee created successfully:', newEmployee);
        
        // Notify parent component with the new employee
        onCreate(newEmployee);
        
        // Close the form
        onClose();
      } else {
        setSubmitError('Unexpected response from server. Please try again.');
      }

    } catch (error: any) {
      console.error('❌ Error creating employee:', error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const { data } = error.response;
          console.log('Server error response:', data);

          if (data.errors && typeof data.errors === 'object') {
            // Handle field-specific validation errors
            Object.keys(data.errors).forEach(field => {
              // Map backend field names back to frontend field names
              const frontendField = field === 'NIC' ? 'nic' : field;
              setFieldError(frontendField, data.errors[field]);
            });
          } else {
            setSubmitError(data.message || 'Failed to create employee. Please check your input.');
          }
        } else if (error.request) {
          // Network error
          setSubmitError('Network error. Please check your connection and try again.');
        } else {
          // Other error
          setSubmitError('An unexpected error occurred. Please try again.');
        }
      } else {
        // Non-axios error
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add New Employee</h2>
              <p className="text-sm text-gray-500">Fill in the employee details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid, errors, touched }) => (
              <Form className="space-y-6">
                {/* Error Banner */}
                {submitError && (
                  <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-700">{submitError}</span>
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Employee ID */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Employee ID <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="employee_id"
                      validate={validateEmployeeId}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.employee_id && touched.employee_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="EMP0001"
                    />
                    <ErrorMessage name="employee_id" component="div" className="text-sm text-red-600" />
                  </div>

                  {/* Employee Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Employee Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="name"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    <ErrorMessage name="name" component="div" className="text-sm text-red-600" />
                  </div>

                  {/* NIC */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      NIC <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="nic"
                      validate={validateNIC}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.nic && touched.nic ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="2000123456"
                    />
                    <ErrorMessage name="nic" component="div" className="text-sm text-red-600" />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="email"
                      type="email"
                      validate={validateEmail}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john.doe@company.com"
                    />
                    <ErrorMessage name="email" component="div" className="text-sm text-red-600" />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="phone"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0771234567"
                    />
                    <ErrorMessage name="phone" component="div" className="text-sm text-red-600" />
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="role"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.role && touched.role ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Software Engineer"
                    />
                    <ErrorMessage name="role" component="div" className="text-sm text-red-600" />
                  </div>
                </div>

                {/* Department and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Department */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="department"
                      as="select"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.department && touched.department ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Department</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Sales">Sales</option>
                      <option value="Distribution">Distribution</option>
                    </Field>
                    <ErrorMessage name="department" component="div" className="text-sm text-red-600" />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="status"
                      as="select"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.status && touched.status ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Resigned">Resigned</option>
                      <option value="On Probation">On Probation</option>
                      <option value="On Leave">On Leave</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="text-sm text-red-600" />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="date_of_birth"
                      type="date"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.date_of_birth && touched.date_of_birth ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="date_of_birth" component="div" className="text-sm text-red-600" />
                  </div>

                  {/* Join Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Join Date <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="join_date"
                      type="date"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.join_date && touched.join_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage name="join_date" component="div" className="text-sm text-red-600" />
                  </div>
                </div>

                {/* Salary and Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Salary */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Basic Salary <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="basic_salary"
                      type="number"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.basic_salary && touched.basic_salary ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="50000"
                    />
                    <ErrorMessage name="basic_salary" component="div" className="text-sm text-red-600" />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="gender"
                      as="select"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.gender && touched.gender ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Field>
                    <ErrorMessage name="gender" component="div" className="text-sm text-red-600" />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <Field
                    name="address"
                    as="textarea"
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.address && touched.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter complete address"
                  />
                  <ErrorMessage name="address" component="div" className="text-sm text-red-600" />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Create Employee</span>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAddForm;