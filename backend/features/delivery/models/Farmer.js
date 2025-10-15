import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
  farmerId: {
    type: String,
    required: [true, 'Farmer ID is required'],
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  nic: {
    type: String,
    required: [true, 'NIC is required'],
    unique: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  address: {
    street: String,
    city: String,
    district: String,
    postalCode: String
  },
  farmLocation: {
    latitude: Number,
    longitude: Number,
    description: String
  },
  numberOfCows: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    accountHolderName: String,
    branch: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Farmer', farmerSchema);

