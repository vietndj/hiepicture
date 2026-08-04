import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'secret';

export function verifyPassword(password) {
  return password === ADMIN_PASSWORD;
}

export function createToken() {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ 
    exp: Date.now() + 24 * 60 * 60 * 1000, 
    role: 'admin' 
  })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
    
  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token) {
  try {
    if (!token) return false;
    
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return false;
    
    const expectedSignature = crypto
      .createHmac('sha256', ADMIN_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');
      
    if (signature !== expectedSignature) return false;
    
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decodedPayload.exp < Date.now()) return false;
    if (decodedPayload.role !== 'admin') return false;
    
    return true;
  } catch (error) {
    return false;
  }
}

export function getAuthFromCookies(cookieHeader) {
  if (!cookieHeader) return false;
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  const token = cookies['admin_token'];
  return verifyToken(token);
}
