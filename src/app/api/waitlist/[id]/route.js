import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Waitlist from '@/models/Waitlist';

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { status } = await req.json();
    await connectDB();
    
    const entry = await Waitlist.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update waitlist status' }, { status: 500 });
  }
}
