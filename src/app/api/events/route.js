import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EventInquiry from '@/models/EventInquiry';

export async function GET() {
  try {
    await connectDB();
    const inquiries = await EventInquiry.find().sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch event inquiries' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    await connectDB();
    const inquiry = await EventInquiry.create(data);
    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
