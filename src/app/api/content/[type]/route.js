import { NextResponse } from 'next/server';
import { getAuthFromCookies } from '@/lib/auth';
import { updateFileContent, getFileContent } from '@/lib/github';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

const VALID_TYPES = ['artworks', 'albums', 'categories', 'blog', 'bio'];

function readContentFile(type) {
  const filePath = path.join(process.cwd(), 'content', `${type}.json`);
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

export async function GET(request, { params }) {
  const { type } = await params;

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  try {
    const data = readContentFile(type);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error reading ${type}:`, error);
    return NextResponse.json({ error: `Failed to load ${type}` }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { type } = await params;

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  // Verify admin auth
  const cookieHeader = request.headers.get('cookie');
  const isAuth = getAuthFromCookies(cookieHeader);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const filePath = `content/${type}.json`;
    const content = JSON.stringify(data, null, 2);

    // Write locally
    const localPath = path.join(process.cwd(), filePath);
    fs.writeFileSync(localPath, content, 'utf8');

    // Also commit to GitHub (if configured)
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO) {
      try {
        const existing = await getFileContent(filePath);
        await updateFileContent(filePath, content, existing?.sha, `Update ${type}`);
      } catch (gitError) {
        console.warn('GitHub sync failed (continuing with local write):', gitError.message);
      }
    }

    // Revalidate affected pages
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error updating ${type}:`, error);
    return NextResponse.json({ error: `Failed to update ${type}` }, { status: 500 });
  }
}
