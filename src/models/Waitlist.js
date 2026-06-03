import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  guests: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['waiting', 'notified', 'seated', 'cancelled'], default: 'waiting' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Waitlist || mongoose.model('Waitlist', waitlistSchema);
