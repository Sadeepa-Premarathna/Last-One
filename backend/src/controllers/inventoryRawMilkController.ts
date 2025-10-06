import { Request, Response } from 'express';
import RawMilk from '../models/RawMilk';

// Get all raw milk collections
export const getAllRawMilk = async (req: Request, res: Response) => {
  try {
    const rawMilk = await RawMilk.find().sort({ collectionDate: -1 });
    res.json(rawMilk);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching raw milk data', error });
  }
};

// Get raw milk by ID
export const getRawMilkById = async (req: Request, res: Response) => {
  try {
    const rawMilk = await RawMilk.findById(req.params.id);
    if (!rawMilk) {
      return res.status(404).json({ message: 'Raw milk record not found' });
    }
    res.json(rawMilk);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching raw milk data', error });
  }
};

// Create new raw milk collection
export const createRawMilk = async (req: Request, res: Response) => {
  try {
    const rawMilk = new RawMilk(req.body);
    const savedRawMilk = await rawMilk.save();
    res.status(201).json(savedRawMilk);
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating raw milk record', error: error.message });
  }
};

// Update raw milk collection
export const updateRawMilk = async (req: Request, res: Response) => {
  try {
    const rawMilk = await RawMilk.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!rawMilk) {
      return res.status(404).json({ message: 'Raw milk record not found' });
    }
    res.json(rawMilk);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating raw milk record', error: error.message });
  }
};

// Delete raw milk collection
export const deleteRawMilk = async (req: Request, res: Response) => {
  try {
    const rawMilk = await RawMilk.findByIdAndDelete(req.params.id);
    if (!rawMilk) {
      return res.status(404).json({ message: 'Raw milk record not found' });
    }
    res.json({ message: 'Raw milk record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting raw milk record', error });
  }
};

// Get statistics
export const getRawMilkStats = async (req: Request, res: Response) => {
  try {
    const totalRecords = await RawMilk.countDocuments();
    const totalQuantity = await RawMilk.aggregate([
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    const totalAmount = await RawMilk.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const pendingPayments = await RawMilk.countDocuments({ paymentStatus: 'pending' });
    
    res.json({
      totalRecords,
      totalQuantity: totalQuantity[0]?.total || 0,
      totalAmount: totalAmount[0]?.total || 0,
      pendingPayments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
};
