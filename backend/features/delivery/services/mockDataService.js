const { 
  mockDrivers, 
  mockFarmers, 
  mockMilkCollections, 
  mockPayments, 
  mockOrders, 
  mockDeliveries 
} = require('../mockData');

// In-memory storage (will reset on server restart)
let drivers = [...mockDrivers];
let farmers = [...mockFarmers];
let milkCollections = [...mockMilkCollections];
let payments = [...mockPayments];
let orders = [...mockOrders];
let deliveries = [...mockDeliveries];

// Helper functions
const generateId = () => `507f1f77bcf86cd799${Date.now().toString().slice(-6)}`;

const findById = (array, id) => array.find(item => item._id === id);
const findByQuery = (array, query = {}) => {
  return array.filter(item => {
    return Object.keys(query).every(key => {
      if (key === '_id') return item._id === query[key];
      if (typeof query[key] === 'string') {
        return item[key]?.toString().toLowerCase().includes(query[key].toLowerCase());
      }
      return item[key] === query[key];
    });
  });
};

// Mock service class
class MockDataService {
  
  // Drivers
  async getDrivers(query = {}) {
    const result = findByQuery(drivers, query);
    return { success: true, data: result, count: result.length };
  }

  async getDriverById(id) {
    const driver = findById(drivers, id);
    if (!driver) throw new Error('Driver not found');
    return { success: true, data: driver };
  }

  async createDriver(driverData) {
    const newDriver = {
      _id: generateId(),
      ...driverData,
      joinDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    drivers.push(newDriver);
    return { success: true, data: newDriver };
  }

  async updateDriver(id, updateData) {
    const index = drivers.findIndex(d => d._id === id);
    if (index === -1) throw new Error('Driver not found');
    
    drivers[index] = {
      ...drivers[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return { success: true, data: drivers[index] };
  }

  async deleteDriver(id) {
    const index = drivers.findIndex(d => d._id === id);
    if (index === -1) throw new Error('Driver not found');
    
    drivers.splice(index, 1);
    return { success: true, message: 'Driver deleted successfully' };
  }

  // Farmers
  async getFarmers(query = {}) {
    const result = findByQuery(farmers, query);
    return { success: true, data: result, count: result.length };
  }

  async getFarmerById(id) {
    const farmer = findById(farmers, id);
    if (!farmer) throw new Error('Farmer not found');
    return { success: true, data: farmer };
  }

  async createFarmer(farmerData) {
    const newFarmer = {
      _id: generateId(),
      ...farmerData,
      registrationDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    farmers.push(newFarmer);
    return { success: true, data: newFarmer };
  }

  async updateFarmer(id, updateData) {
    const index = farmers.findIndex(f => f._id === id);
    if (index === -1) throw new Error('Farmer not found');
    
    farmers[index] = {
      ...farmers[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return { success: true, data: farmers[index] };
  }

  async deleteFarmer(id) {
    const index = farmers.findIndex(f => f._id === id);
    if (index === -1) throw new Error('Farmer not found');
    
    farmers.splice(index, 1);
    return { success: true, message: 'Farmer deleted successfully' };
  }

  // Milk Collections
  async getMilkCollections(query = {}) {
    let result = [...milkCollections];
    
    // Populate farmer and driver data
    result = result.map(collection => ({
      ...collection,
      farmer: findById(farmers, collection.farmer) || collection.farmer,
      driver: findById(drivers, collection.driver) || collection.driver
    }));

    if (Object.keys(query).length > 0) {
      result = findByQuery(result, query);
    }
    
    return { success: true, data: result, count: result.length };
  }

  async getMilkCollectionById(id) {
    const collection = findById(milkCollections, id);
    if (!collection) throw new Error('Milk collection not found');
    
    // Populate farmer and driver
    const populatedCollection = {
      ...collection,
      farmer: findById(farmers, collection.farmer) || collection.farmer,
      driver: findById(drivers, collection.driver) || collection.driver
    };
    
    return { success: true, data: populatedCollection };
  }

  async createMilkCollection(collectionData) {
    const collectionCount = milkCollections.length + 1;
    const newCollection = {
      _id: generateId(),
      collectionId: collectionData.collectionId || `COL-${String(collectionCount).padStart(5, '0')}`,
      ...collectionData,
      totalValue: (collectionData.quantity || 0) * (collectionData.paymentAmount || 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    milkCollections.push(newCollection);
    
    // Return populated version
    const populated = {
      ...newCollection,
      farmer: findById(farmers, newCollection.farmer) || newCollection.farmer,
      driver: findById(drivers, newCollection.driver) || newCollection.driver
    };
    
    return { success: true, data: populated };
  }

  async updateMilkCollection(id, updateData) {
    const index = milkCollections.findIndex(c => c._id === id);
    if (index === -1) throw new Error('Milk collection not found');
    
    milkCollections[index] = {
      ...milkCollections[index],
      ...updateData,
      totalValue: (updateData.quantity || milkCollections[index].quantity || 0) * 
                  (updateData.paymentAmount || milkCollections[index].paymentAmount || 0),
      updatedAt: new Date().toISOString()
    };
    
    // Return populated version
    const populated = {
      ...milkCollections[index],
      farmer: findById(farmers, milkCollections[index].farmer) || milkCollections[index].farmer,
      driver: findById(drivers, milkCollections[index].driver) || milkCollections[index].driver
    };
    
    return { success: true, data: populated };
  }

  async deleteMilkCollection(id) {
    const index = milkCollections.findIndex(c => c._id === id);
    if (index === -1) throw new Error('Milk collection not found');
    
    milkCollections.splice(index, 1);
    return { success: true, message: 'Milk collection deleted successfully' };
  }

  // Payments
  async getPayments(query = {}) {
    let result = [...payments];
    
    if (Object.keys(query).length > 0) {
      result = findByQuery(result, query);
    }
    
    return { success: true, data: result, count: result.length };
  }

  async getPaymentById(id) {
    const payment = findById(payments, id);
    if (!payment) throw new Error('Payment not found');
    return { success: true, data: payment };
  }

  async createPayment(paymentData) {
    const paymentCount = payments.length + 1;
    const collection = findById(milkCollections, paymentData.collectionId);
    
    const newPayment = {
      _id: generateId(),
      paymentId: `PAY-${String(paymentCount).padStart(5, '0')}`,
      amount: paymentData.amount || collection?.totalValue || 0,
      paymentDate: new Date().toISOString(),
      paymentStatus: 'Completed',
      ...paymentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    payments.push(newPayment);
    
    // Update collection payment status
    if (collection) {
      const collectionIndex = milkCollections.findIndex(c => c._id === collection._id);
      if (collectionIndex !== -1) {
        milkCollections[collectionIndex].paymentStatus = 'Paid';
      }
    }
    
    return { 
      success: true, 
      data: { payment: newPayment, collection: collection }
    };
  }

  async getPaymentStats() {
    const totalPaid = payments
      .filter(p => p.paymentStatus === 'Completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const pendingCollections = milkCollections.filter(c => c.paymentStatus === 'Pending');
    const totalPending = pendingCollections
      .reduce((sum, c) => sum + (c.totalValue || 0), 0);
    
    return {
      success: true,
      data: {
        totalPaid,
        totalPending,
        completedPayments: payments.filter(p => p.paymentStatus === 'Completed').length,
        pendingPayments: pendingCollections.length
      }
    };
  }

  // Orders
  async getOrders(query = {}) {
    let result = [...orders];
    
    // Populate driver data
    result = result.map(order => ({
      ...order,
      driver: order.driver ? findById(drivers, order.driver) : null
    }));

    if (Object.keys(query).length > 0) {
      result = findByQuery(result, query);
    }
    
    return { success: true, data: result, count: result.length };
  }

  async getOrderById(id) {
    const order = findById(orders, id);
    if (!order) throw new Error('Order not found');
    
    const populatedOrder = {
      ...order,
      driver: order.driver ? findById(drivers, order.driver) : null
    };
    
    return { success: true, data: populatedOrder };
  }

  // Deliveries
  async getDeliveries(query = {}) {
    let result = [...deliveries];
    
    // Populate driver and milk collections
    result = result.map(delivery => ({
      ...delivery,
      driver: findById(drivers, delivery.driver) || delivery.driver,
      milkCollections: delivery.milkCollections?.map(id => 
        findById(milkCollections, id) || id
      ) || []
    }));

    if (Object.keys(query).length > 0) {
      result = findByQuery(result, query);
    }
    
    return { success: true, data: result, count: result.length };
  }
}

module.exports = new MockDataService();