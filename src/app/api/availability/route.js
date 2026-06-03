import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Table from '@/models/Table';
import Reservation from '@/models/Reservation';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const time = searchParams.get('time');

    await dbConnect();
    
    // Fetch all tables
    const tables = await Table.find({}).sort({ tableNumber: 1 });
    
    // If no date/time is provided, just return tables as is (useful for initial load or without filters)
    if (!date || !time) {
      return NextResponse.json(tables);
    }

    // Parse the requested time
    const [reqHour, reqMinute] = time.split(':').map(Number);
    const reqTimeInMinutes = reqHour * 60 + reqMinute;

    // Fetch reservations for the specific date
    const reservations = await Reservation.find({ 
      date: date,
      status: { $ne: 'cancelled' } 
    });

    // We consider a table reserved if a reservation overlaps within 90 minutes (1.5 hours) of the requested time
    // For simplicity, we'll just check if there's any reservation exactly at that time, or nearby.
    // Let's implement a +/- 90 minute rule.
    const RESERVATION_DURATION_MINUTES = 90;

    const tablesWithDynamicStatus = tables.map(table => {
      // If table is statically marked as occupied by admin, it remains occupied
      if (table.status === 'occupied') {
        return table;
      }

      // Check if this table has any reservations overlapping with the requested time
      const overlappingReservation = reservations.find(res => {
        if (res.tableId.toString() !== table._id.toString()) return false;
        
        const [resHour, resMinute] = res.time.split(':').map(Number);
        const resTimeInMinutes = resHour * 60 + resMinute;
        
        // Check if the requested time falls within the duration of an existing reservation
        // Or if the existing reservation falls within the duration of the requested time
        const diff = Math.abs(reqTimeInMinutes - resTimeInMinutes);
        return diff < RESERVATION_DURATION_MINUTES;
      });

      if (overlappingReservation) {
        // Create a new object to avoid modifying the Mongoose document directly if it were cached
        return {
          ...table.toObject(),
          status: 'reserved'
        };
      }

      // Otherwise it's free
      return {
        ...table.toObject(),
        status: 'free'
      };
    });

    return NextResponse.json(tablesWithDynamicStatus);
  } catch (error) {
    console.error('Failed to fetch availability:', error);
    return NextResponse.json({ error: 'Failed to fetch table availability' }, { status: 500 });
  }
}
