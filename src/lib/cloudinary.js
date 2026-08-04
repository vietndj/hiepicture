const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export function getCloudinaryUrl(publicId, transforms = '') {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms ? transforms + '/' : ''}${publicId}`;
}

export async function uploadImage(fileBuffer) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  const formData = new FormData();
  const blob = new Blob([fileBuffer]);
  formData.append('file', blob);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'default');
  
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }
  
  return response.json();
}

export async function deleteImage(publicId) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  const crypto = await import('crypto');
  const signature = crypto.createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`)
    .digest('hex');
    
  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete image from Cloudinary');
  }
  
  return response.json();
}

export function getOptimizedUrl(url, { width, height, quality = 'auto', format = 'auto' }) {
  if (!url.includes('res.cloudinary.com')) return url;
  
  const transforms = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push(`c_fill`);
  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);
  
  const transformStr = transforms.join(',');
  const parts = url.split('/upload/');
  return `${parts[0]}/upload/${transformStr}/${parts[1]}`;
}
