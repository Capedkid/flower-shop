import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({ message: 'Dosya bulunamadı.' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  const uploadDir = path.join(process.cwd(), 'public', 'urunler');
  const filePath = path.join(uploadDir, fileName);
  // Klasör yoksa oluştur
  await import('fs').then(fs => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  });
  await writeFile(filePath, buffer);
  return NextResponse.json({ url: `/urunler/${fileName}` });
} 

