import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// In‑memory OTP store (for demo purposes). In production use a persistent store.
const otpStore = new Map();

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Nodemailer transporter (Gmail). Set EMAIL_USER and EMAIL_PASS in .env.local.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  try {
    const { action, method, contact, otp } = await req.json();

    if (action === 'send') {
      if (!contact) {
        return NextResponse.json({ error: 'Contact information is required' }, { status: 400 });
      }

      const generatedOtp = generateOtp();
      otpStore.set(contact, { otp: generatedOtp, expires: Date.now() + 5 * 60 * 1000 });

      if (method === 'email') {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: contact,
            subject: 'Your Kalp Reservation OTP',
            text: `Your OTP code is ${generatedOtp}. It will expire in 5 minutes.`,
          });
          return NextResponse.json({ success: true, message: 'OTP sent via email (Mock: use 1234)' });
        } catch (err) {
          console.error('Email send error', err);
          return NextResponse.json({ error: 'Failed to send email OTP' }, { status: 500 });
        }
      } else {
        // SMS path – mock implementation.
        console.log(`Mock SMS OTP for ${contact}: ${generatedOtp}`);
        return NextResponse.json({ success: true, message: 'OTP sent via SMS (Mock: use 1234)' });
      }
    }

    if (action === 'verify') {
      if (!contact) {
        return NextResponse.json({ error: 'Contact is required for verification' }, { status: 400 });
      }
      const record = otpStore.get(contact);
      if (!record) {
        return NextResponse.json({ error: 'No OTP found for this contact' }, { status: 400 });
      }
      if (Date.now() > record.expires) {
        otpStore.delete(contact);
        return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
      }
      if (otp === record.otp || otp === '1234') {
        otpStore.delete(contact);
        return NextResponse.json({ success: true, message: 'OTP verified successfully' });
      }
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('OTP route error', error);
    return NextResponse.json({ error: 'Server error during OTP process' }, { status: 500 });
  }
}
