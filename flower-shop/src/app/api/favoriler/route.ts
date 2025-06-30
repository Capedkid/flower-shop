import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Oturum gerekli' }, { status: 401 });
  }
  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });
  return NextResponse.json(favorites.map(fav => fav.product));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Oturum gerekli' }, { status: 401 });
  }
  const { productId } = await request.json();
  if (!productId) {
    return NextResponse.json({ message: 'Ürün ID gerekli' }, { status: 400 });
  }
  const favorite = await prisma.favorite.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: {},
    create: { userId: session.user.id, productId },
  });
  return NextResponse.json(favorite);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Oturum gerekli' }, { status: 401 });
  }
  const { productId } = await request.json();
  if (!productId) {
    return NextResponse.json({ message: 'Ürün ID gerekli' }, { status: 400 });
  }
  await prisma.favorite.delete({
    where: { userId_productId: { userId: session.user.id, productId } },
  });
  return NextResponse.json({ success: true });
} 
