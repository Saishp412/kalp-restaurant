import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password, action } = await request.json();

    if (action === 'logout') {
      const response = NextResponse.json({ success: true });
      response.cookies.delete('admin_token');
      return response;
    }

    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const response = NextResponse.json({ success: true });
      // Set a simple cookie for auth. For production, use JWT or stronger session management.
      response.cookies.set({
        name: 'admin_token',
        value: 'authenticated',
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
