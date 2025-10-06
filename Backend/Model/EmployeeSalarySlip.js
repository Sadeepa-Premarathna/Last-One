import mongoose from 'mongoose';

const employeeSalarySlipSchema = new mongoose.Schema(
  {
    salarySlipId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    employeeId: {
      type: String,
      required: true,
      trim: true
    },
    month: {
      type: String,
      required: true,
      trim: true
    },
    basicSalary: {
      type: Number,
      required: true,
      min: 0
    },
    otAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    totalAllowances: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    totalDeductions: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    epfEmployeeContribution: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    epfEmployerContribution: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    etfEmployerContribution: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    grossSalary: {
      type: Number,
      required: true,
      min: 0
    },
    netSalary: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Paid', 'Unpaid'],
      default: 'Pending'
    },
    createdBy: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      }
    }
  }
);

// Index for efficient queries
employeeSalarySlipSchema.index({ employeeId: 1, month: 1 }, { unique: true });

export default mongoose.model('EmployeeSalarySlip', employeeSalarySlipSchema);
