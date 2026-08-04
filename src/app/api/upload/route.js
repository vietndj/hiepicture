import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { verifyToken, getAuthFromCookies } from '@/lib/auth';

export async function POST(request) {
  const token = getAuthFromCookies();
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;
    
    const result = await uploadImage(dataURI);
    
    return NextResponse.json({ 
      url: result.secure_url, 
      publicId: result.public_id 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
