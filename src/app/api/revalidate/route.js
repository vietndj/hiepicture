import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { verifyToken, getAuthFromCookies } from '@/lib/auth';

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  const token = getAuthFromCookies();
  
  const isAuthorizedBySecret = authHeader === `Bearer ${process.env.REVALIDATE_SECRET}`;
  const isAuthorizedByToken = token && verifyToken(token);
  
  if (!isAuthorizedBySecret && !isAuthorizedByToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { paths, tags } = await request.json();
    
    if (paths && Array.isArray(paths)) {
      paths.forEach(path => revalidatePath(path));
    }
    
    if (tags && Array.isArray(tags)) {
      tags.forEach(tag => revalidateTag(tag));
    }
    
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 });
  }
}
