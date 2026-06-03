import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Table from '@/models/Table';

export async function GET() {
  try {
    await dbConnect();
    const tables = await Table.find({}).sort({ tableNumber: 1 });
    return NextResponse.json(tables);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();
    const { tableId, status } = await req.json();
    
    if (!tableId || !status) {
      return NextResponse.json({ error: 'Missing tableId or status' }, { status: 400 });
    }
    
    if (!['free', 'reserved', 'occupied'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedTable = await Table.findByIdAndUpdate(
      tableId,
      { status },
      { new: true }
    );
    
    if (!updatedTable) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTable);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update table' }, { status: 500 });
  }
}
