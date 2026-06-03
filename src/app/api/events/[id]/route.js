import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EventInquiry from '@/models/EventInquiry';

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { status } = await req.json();
    await connectDB();
    
    const inquiry = await EventInquiry.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json(inquiry);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inquiry status' }, { status: 500 });
  }
}
