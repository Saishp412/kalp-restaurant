import mongoose from 'mongoose';

const eventInquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  guests: { type: Number, required: true },
  date: { type: String, required: true },
  eventType: { type: String, required: true },
  specialRequests: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.EventInquiry || mongoose.model('EventInquiry', eventInquirySchema);
