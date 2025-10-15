import React, { useState, useEffect } from 'react';
import { employeeService, Employee } from '../employee_utils/employeeService';

interface EmployeeSelectionProps {
  selectedEmployeeId: string;
  selectedEmployee: Employee | null;
  onEmployeeChange: (employeeId: string, employee: Employee | null) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
}

const EmployeeSelection: React.FC<EmployeeSelectionProps> = ({
  selectedEmployeeId,
  selectedEmployee,
  onEmployeeChange,
  disabled = false,
  required = true,
  label = 'Employee ID',
  placeholder = 'Enter Employee ID (e.g., EMP0001)',
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [inputValue, setInputValue] = useState(selectedEmployeeId);

  // Sync input value with prop changes
  useEffect(() => {
    setInputValue(selectedEmployeeId);
  }, [selectedEmployeeId]);

  // Debounced employee lookup
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue && inputValue.length === 7 && inputValue !== selectedEmployeeId) {
        handleEmployeeLookup(inputValue);
      } else if (inputValue.length < 7) {
        // Clear employee if input is incomplete
        setError('');
        onEmployeeChange(inputValue, null);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [inputValue, selectedEmployeeId]);

  const handleEmployeeLookup = async (employeeId: string) => {
    if (!employeeId || employeeId.length !== 7) return;

    setLoading(true);
    setError('');

    try {
      console.log(`🔍 Employee Selection: Looking up ${employeeId}`);
      const result = await employeeService.getEmployeeById(employeeId);

      if (result.success && result.data) {
        console.log(`✅ Employee Selection: Found ${result.data.name}`);
        onEmployeeChange(employeeId, result.data);
      } else {
        console.log(`❌ Employee Selection: ${result.error}`);
        setError(result.error || 'Employee not found');
        onEmployeeChange(employeeId, null);
      }
    } catch (error) {
      console.error('❌ Employee Selection: Lookup error', error);
      setError('Failed to lookup employee. Please try again.');
      onEmployeeChange(employeeId, null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    const upperCaseValue = value.toUpperCase();
    setInputValue(upperCaseValue);
    setError('');
    
    // If user clears the input, reset everything
    if (!upperCaseValue) {
      onEmployeeChange('', null);
    }
  };

  const getValidationState = () => {
    if (!inputValue) return 'empty';
    if (inputValue.length < 7) return 'incomplete';
    if (loading) return 'loading';
    if (error) return 'error';
    if (selectedEmployee) return 'success';
    return 'unknown';
  };

  const validationState = getValidationState();

  return (
    <div className={`mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 ${className}`}>
      <h4 className="text-md font-semibold text-gray-700 mb-3">Employee Selection</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validationState === 'error' 
                ? 'border-red-300 bg-red-50' 
                : validationState === 'success'
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300'
            }`}
            maxLength={7}
            disabled={disabled}
            autoComplete="off"
          />
          <p className="text-xs text-gray-500 mt-1">Format: EMP followed by 4 digits</p>
          
          {error && (
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
              {error}
            </p>
          )}
        </div>
        
        <div className="flex items-center">
          {validationState === 'loading' && (
            <div className="flex items-center text-blue-600 w-full">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm">🔍 Searching for employee...</span>
            </div>
          )}
          
          {validationState === 'success' && selectedEmployee && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 w-full">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-800">Employee Found</span>
              </div>
              <p className="text-sm text-gray-700"><strong>Name:</strong> {selectedEmployee.name}</p>
              <p className="text-sm text-gray-700"><strong>Role:</strong> {selectedEmployee.role}</p>
              <p className="text-sm text-gray-700"><strong>Email:</strong> {selectedEmployee.email}</p>
            </div>
          )}
          
          {validationState === 'error' && inputValue.length === 7 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 w-full">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-red-800">Employee not found</span>
              </div>
              <p className="text-xs text-red-600">Please check the Employee ID</p>
              <button 
                onClick={() => handleEmployeeLookup(inputValue)}
                className="text-xs text-red-700 underline hover:text-red-900 mt-1"
                disabled={loading}
              >
                Try again
              </button>
            </div>
          )}

          {validationState === 'incomplete' && inputValue.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 w-full">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-yellow-800">
                  Continue typing... ({inputValue.length}/7)
                </span>
              </div>
            </div>
          )}

          {validationState === 'empty' && (
            <div className="text-gray-500 text-sm p-3 w-full text-center">
              Enter an Employee ID to search
              <div className="text-xs text-green-600 mt-1">
                🟢 Backend connected (Port 8004)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSelection;