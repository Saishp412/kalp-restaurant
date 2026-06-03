import mongoose from 'mongoose';

const TableSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['free', 'reserved', 'occupied'], 
    default: 'free' 
  },
  shape: {
    type: String,
    enum: ['circle', 'rectangle', 'square'],
    default: 'rectangle'
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  }
});

export default mongoose.models.Table || mongoose.model('Table', TableSchema);
