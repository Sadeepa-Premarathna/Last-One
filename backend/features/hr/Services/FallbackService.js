import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

class FallbackService {
  constructor() {
    this.dataFile = global.fallbackDataFile || path.join(process.cwd(), 'employees-data.json');
  }

  readData() {
    try {
      if (!fs.existsSync(this.dataFile)) {
        fs.writeFileSync(this.dataFile, JSON.stringify([], null, 2));
        return [];
      }
      const data = fs.readFileSync(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading fallback data:', error);
      return [];
    }
  }

  writeData(data) {
    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing fallback data:', error);
      return false;
    }
  }

  // Employee CRUD operations
  async getAllEmployees() {
    return this.readData();
  }

  async getEmployeeById(id) {
    const employees = this.readData();
    return employees.find(emp => emp._id === id || emp.employee_id === id);
  }

  async createEmployee(employeeData) {
    const employees = this.readData();
    const newEmployee = {
      _id: uuidv4(),
      ...employeeData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    employees.push(newEmployee);
    
    if (this.writeData(employees)) {
      return newEmployee;
    }
    throw new Error('Failed to save employee data');
  }

  async updateEmployee(id, updateData) {
    const employees = this.readData();
    const index = employees.findIndex(emp => emp._id === id || emp.employee_id === id);
    
    if (index === -1) {
      return null;
    }

    employees[index] = {
      ...employees[index],
      ...updateData,
      updated_at: new Date().toISOString()
    };

    if (this.writeData(employees)) {
      return employees[index];
    }
    throw new Error('Failed to update employee data');
  }

  async deleteEmployee(id) {
    const employees = this.readData();
    const index = employees.findIndex(emp => emp._id === id || emp.employee_id === id);
    
    if (index === -1) {
      return null;
    }

    const deletedEmployee = employees[index];
    employees.splice(index, 1);

    if (this.writeData(employees)) {
      return deletedEmployee;
    }
    throw new Error('Failed to delete employee data');
  }

  // Validation check methods
  async checkEmployeeId(employee_id) {
    const employees = this.readData();
    return employees.some(emp => emp.employee_id === employee_id);
  }

  async checkNIC(nic) {
    const employees = this.readData();
    return employees.some(emp => emp.NIC === nic);
  }

  async checkEmail(email) {
    const employees = this.readData();
    return employees.some(emp => emp.email === email);
  }
}

export default new FallbackService();