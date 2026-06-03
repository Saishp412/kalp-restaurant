import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['North Indian', 'Asian', 'Korean', 'Italian', 'Desserts', 'Beverages', 'Pizza', 'Oriental']
  },
  image: { type: String },
  isVeg: { type: Boolean, default: false },
  isSpecial: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
