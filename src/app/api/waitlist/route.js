import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Waitlist from '@/models/Waitlist';

export async function GET() {
  try {
    await connectDB();
    const waitlist = await Waitlist.find().sort({ createdAt: -1 });
    return NextResponse.json(waitlist);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    await connectDB();
    const entry = await Waitlist.create(data);
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }
}
