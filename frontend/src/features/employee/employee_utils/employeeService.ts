/**
 * Employee Service - Centralized employee lookup functionality
 * Provides robust, reusable employee selection for all components
 */

export interface Employee {
  employee_id: string;
  name: string;
  NIC: string;
  email: string;
  phone: string;
  role: string;
  date_of_birth: string;
  basic_salary: number;
  status: string;
  department: string;
  join_date: string;
  address: string;
  gender: string;
}

export interface EmployeeServiceResponse {
  success: boolean;
  data?: Employee;
  error?: string;
}

/**
 * Centralized API configuration with automatic port detection
 */
class EmployeeService {
  private static instance: EmployeeService;
  private availablePorts = [8004, 8003, 8005, 8002, 8000, 5000];
  private workingPort: number | null = null;
  private portTestCache = new Map<number, boolean>();

  static getInstance(): EmployeeService {
    if (!EmployeeService.instance) {
      EmployeeService.instance = new EmployeeService();
    }
    return EmployeeService.instance;
  }

  /**
   * Test if a specific port is working
   */
  private async testPort(port: number): Promise<boolean> {
    try {
      // Check cache first (valid for 30 seconds)
      const cacheKey = port;
      if (this.portTestCache.has(cacheKey)) {
        return this.portTestCache.get(cacheKey) || false;
      }

      const response = await fetch(`http://localhost:${port}/api/test/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000), // 3 second timeout
      });
      
      const isWorking = response.ok;
      
      // Cache result for 30 seconds
      this.portTestCache.set(cacheKey, isWorking);
      setTimeout(() => this.portTestCache.delete(cacheKey), 30000);
      
      return isWorking;
    } catch (error) {
      console.log(`❌ Port ${port} test failed:`, error);
      return false;
    }
  }

  /**
   * Find the first working port from the list
   */
  private async findWorkingPort(): Promise<number | null> {
    // If we already have a working port, test it first
    if (this.workingPort) {
      const stillWorking = await this.testPort(this.workingPort);
      if (stillWorking) {
        console.log(`✅ Using cached working port: ${this.workingPort}`);
        return this.workingPort;
      } else {
        console.log(`⚠️ Cached port ${this.workingPort} no longer working`);
        this.workingPort = null;
      }
    }

    // Test all ports to find a working one
    for (const port of this.availablePorts) {
      console.log(`🔍 Testing port: ${port}`);
      const isWorking = await this.testPort(port);
      
      if (isWorking) {
        console.log(`✅ Found working port: ${port}`);
        this.workingPort = port;
        return port;
      }
    }

    console.error('❌ No working backend ports found!');
    return null;
  }

  /**
   * Make API request with automatic port detection and retry
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const workingPort = await this.findWorkingPort();
    
    if (!workingPort) {
      throw new Error('No backend server available');
    }

    const url = `http://localhost:${workingPort}${endpoint}`;
    console.log(`🌐 Making request to: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      // If this port fails, invalidate it and try next time
      if (response.status >= 500) {
        console.log(`⚠️ Port ${workingPort} returned error, invalidating cache`);
        this.workingPort = null;
        this.portTestCache.delete(workingPort);
      }
    }

    return response;
  }

  /**
   * Fetch employee by ID with validation
   */
  async getEmployeeById(employeeId: string): Promise<EmployeeServiceResponse> {
    try {
      // Validate employee ID format
      if (!employeeId) {
        return { success: false, error: 'Employee ID is required' };
      }

      if (!/^EMP\d{4}$/.test(employeeId)) {
        return { 
          success: false, 
          error: 'Invalid Employee ID format. Must be EMP followed by 4 digits (e.g., EMP0001)' 
        };
      }

      console.log(`👤 Looking up employee: ${employeeId}`);

      // Add retry logic for connection issues
      let lastError = '';
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await this.makeRequest(`/api/employees/${employeeId}`);
          
          if (response.ok) {
            const result = await response.json();
            
            if (result.success && result.data) {
              console.log(`✅ Employee found: ${result.data.name} (attempt ${attempt})`);
              return { success: true, data: result.data };
            } else {
              console.log(`❌ Employee not found: ${employeeId}`);
              return { success: false, error: 'Employee not found' };
            }
          } else if (response.status === 404) {
            return { success: false, error: 'Employee not found' };
          } else if (response.status === 503) {
            // Database connection issues - retry after delay
            lastError = 'Database connection temporarily unavailable';
            console.log(`⚠️ Database unavailable, attempt ${attempt}/3`);
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Progressive delay
              continue;
            }
          } else {
            const errorData = await response.json().catch(() => ({ message: 'Server error' }));
            lastError = errorData.message || 'Server error';
            
            // If it's a timeout, try again
            if (errorData.message?.includes('timeout') && attempt < 3) {
              console.log(`⚠️ Timeout error, retrying attempt ${attempt}/3`);
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
          }
          
          return { success: false, error: lastError };
        } catch (requestError) {
          lastError = requestError instanceof Error ? requestError.message : 'Network error';
          console.log(`❌ Request failed attempt ${attempt}/3:`, lastError);
          
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
        }
      }

      return { 
        success: false, 
        error: lastError || 'Failed to connect to server after multiple attempts. Please check your connection and try again.' 
      };
    } catch (error) {
      console.error('❌ Employee lookup error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unexpected error occurred' 
      };
    }
  }

  /**
   * Get all employees
   */
  async getAllEmployees(): Promise<EmployeeServiceResponse> {
    try {
      console.log('📋 Fetching all employees');
      
      const response = await this.makeRequest('/api/employees');
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Found ${result.data?.length || 0} employees`);
        return { success: true, data: result.data };
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        return { success: false, error: errorData.message || 'Failed to fetch employees' };
      }
    } catch (error) {
      console.error('❌ Error fetching employees:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  /**
   * Reset the working port cache (useful when switching networks or restarting)
   */
  resetPortCache(): void {
    console.log('🔄 Resetting port cache');
    this.workingPort = null;
    this.portTestCache.clear();
  }
}

// Export singleton instance
export const employeeService = EmployeeService.getInstance();

// Export utility functions for backward compatibility
export const fetchEmployeeById = (employeeId: string) => employeeService.getEmployeeById(employeeId);
export const fetchAllEmployees = () => employeeService.getAllEmployees();
export const resetEmployeeServiceCache = () => employeeService.resetPortCache();