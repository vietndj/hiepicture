import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString('base64');
    
    // Method 1: Upload to Free ImgBB CDN (High-speed free CDN)
    try {
      const imgbbForm = new FormData();
      imgbbForm.append('image', base64Image);
      
      const apiKey = process.env.IMGBB_API_KEY || '6d000714472d3122571d3166be1536ab';
      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: imgbbForm,
      });

      if (imgbbRes.ok) {
        const imgbbData = await imgbbRes.json();
        if (imgbbData?.data?.url) {
          return NextResponse.json({
            url: imgbbData.data.url,
            displayUrl: imgbbData.data.display_url || imgbbData.data.url,
            provider: 'imgbb'
          });
        }
      }
    } catch (e) {
      console.warn('ImgBB upload failed, trying local storage fallback:', e);
    }

    // Method 2: Fallback to local /public/uploads/ directory
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileExt = file.name ? path.extname(file.name) : '.jpg';
      const cleanFileName = `art_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${fileExt}`;
      const filePath = path.join(uploadsDir, cleanFileName);

      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/uploads/${cleanFileName}`;

      return NextResponse.json({
        url: publicUrl,
        provider: 'local'
      });
    } catch (e) {
      console.warn('Local storage write skipped:', e);
    }

    // Method 3: Fallback to Base64 Data URI
    const dataURI = `data:${file.type || 'image/jpeg'};base64,${base64Image}`;
    return NextResponse.json({
      url: dataURI,
      provider: 'base64'
    });

  } catch (error) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
