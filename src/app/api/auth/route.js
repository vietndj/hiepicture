import { NextResponse } from 'next/server';
import { verifyPassword, createToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    if (verifyPassword(password)) {
      const token = await createToken();
      
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24
      });
      
      return response;
    }
    
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
