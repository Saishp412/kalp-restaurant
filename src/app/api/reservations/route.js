import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import Table from '@/models/Table';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    await connectToDatabase();
    const reservations = await Reservation.find({}).sort({ createdAt: -1 });
    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    // Basic validation
    if (!body.name || !body.email || !body.phone || !body.date || !body.time || !body.guests || !body.tableId) {
      return NextResponse.json({ error: 'Missing required fields including tableId' }, { status: 400 });
    }

    const table = await Table.findById(body.tableId);
    if (!table) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    if (table.status === 'occupied') {
      return NextResponse.json({ error: 'Table is currently occupied by admin override' }, { status: 400 });
    }

    // Verify dynamic availability
    const [reqHour, reqMinute] = body.time.split(':').map(Number);
    const reqTimeInMinutes = reqHour * 60 + reqMinute;
    const RESERVATION_DURATION_MINUTES = 90;

    const overlappingReservations = await Reservation.find({
      tableId: body.tableId,
      date: body.date,
      status: { $ne: 'cancelled' }
    });

    const isOverlap = overlappingReservations.some(res => {
      const [resHour, resMinute] = res.time.split(':').map(Number);
      const resTimeInMinutes = resHour * 60 + resMinute;
      return Math.abs(reqTimeInMinutes - resTimeInMinutes) < RESERVATION_DURATION_MINUTES;
    });

    if (isOverlap) {
      return NextResponse.json({ error: 'Table is no longer available at this time' }, { status: 400 });
    }

    // Create reservation
    const reservation = await Reservation.create(body);
    
    // Send email receipt
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const dateObj = new Date(body.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      
      // Convert 24h to 12h format
      const isPM = reqHour >= 12;
      const displayHour = reqHour % 12 || 12;
      const formattedTime = `${displayHour}:${reqMinute.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;

      const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0f; color: #f0ece4; border: 1px solid #d4a853; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #12121a; padding: 40px 20px; text-align: center; border-bottom: 2px solid #d4a853;">
          <h1 style="color: #d4a853; margin: 0; font-size: 32px; font-family: 'Georgia', serif; font-style: italic;">Kalp</h1>
          <p style="color: #a8a4a0; margin-top: 10px; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Where Every Flavour Tells a Story</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #f0ece4; font-size: 24px; margin-top: 0;">Reservation Confirmed</h2>
          <p style="color: #a8a4a0; font-size: 16px; line-height: 1.6;">Dear ${body.name},</p>
          <p style="color: #a8a4a0; font-size: 16px; line-height: 1.6;">Thank you for choosing Kalp. We are delighted to confirm your reservation. Below are your booking details:</p>
          
          <div style="background-color: #1a1a28; border-radius: 8px; padding: 20px; margin: 30px 0; border: 1px solid rgba(212, 168, 83, 0.2);">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #a8a4a0; border-bottom: 1px solid rgba(255,255,255,0.05);"><strong>Date:</strong></td>
                <td style="padding: 10px 0; color: #f0ece4; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.05);">${formattedDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #a8a4a0; border-bottom: 1px solid rgba(255,255,255,0.05);"><strong>Time:</strong></td>
                <td style="padding: 10px 0; color: #f0ece4; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.05);">${formattedTime}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #a8a4a0; border-bottom: 1px solid rgba(255,255,255,0.05);"><strong>Guests:</strong></td>
                <td style="padding: 10px 0; color: #f0ece4; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.05);">${body.guests}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #a8a4a0;"><strong>Table:</strong></td>
                <td style="padding: 10px 0; color: #d4a853; font-weight: bold; text-align: right;">${table.tableNumber}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #a8a4a0; font-size: 14px; line-height: 1.6; text-align: center;">If you have any special requests or need to modify your reservation, please contact us at +91 98333 35005.</p>
        </div>
        <div style="background-color: #12121a; padding: 20px; text-align: center; border-top: 1px solid rgba(212, 168, 83, 0.2);">
          <p style="color: #6b6764; font-size: 12px; margin: 0;">Unit 209, 210, 211, 2nd Floor, Newa Bhakti Knowledge City, Airoli, Navi Mumbai - 400601</p>
        </div>
      </div>
      `;

      await transporter.sendMail({
        from: `"Kalp Restaurant" <${process.env.EMAIL_USER}>`,
        to: body.email,
        subject: 'Reservation Confirmed - Kalp Restaurant',
        html: emailHtml
      });
      console.log('Confirmation email sent successfully');
    } catch (emailErr) {
      console.error('Failed to send confirmation email', emailErr);
      // We don't fail the reservation if email fails
    }

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error('Reservation creation error:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}

