import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });

    return NextResponse.json(
      { success: true, data: menuItems },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const menuItem = await MenuItem.create(body);

    return NextResponse.json(
      { success: true, data: menuItem },
      { status: 201 }
    );
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, error: messages },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
