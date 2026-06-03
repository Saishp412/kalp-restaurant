import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import Waitlist from '@/models/Waitlist';

export async function GET() {
  try {
    await connectDB();
    
    // Total Reservations
    const totalReservations = await Reservation.countDocuments();
    
    // Reservations per day (simple aggregation)
    const reservationsByDate = await Reservation.aggregate([
      { $group: { _id: "$date", count: { $sum: 1 }, guests: { $sum: "$guests" } } },
      { $sort: { _id: 1 } },
      { $limit: 7 } // last 7 unique dates or upcoming 7
    ]);
    
    // Total Waitlist entries
    const totalWaitlist = await Waitlist.countDocuments();
    
    // Total Revenue Estimate (Assume ₹900 per guest)
    const allReservations = await Reservation.find({}, 'guests');
    const totalGuests = allReservations.reduce((sum, res) => sum + res.guests, 0);
    const estimatedRevenue = totalGuests * 900;
    
    // Popular Times
    const popularTimes = await Reservation.aggregate([
      { $group: { _id: "$time", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return NextResponse.json({
      totalReservations,
      totalWaitlist,
      totalGuests,
      estimatedRevenue,
      reservationsByDate,
      popularTimes
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
