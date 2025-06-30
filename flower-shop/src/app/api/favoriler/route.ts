import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Oturum gerekli' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: { product: true },
    });
    
    return NextResponse.json(favorites.map((fav: any) => fav.product));
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { message: 'Favoriler alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Oturum gerekli' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ message: 'Ürün ID gerekli' }, { status: 400 });
    }

    const favorite = await prisma.favorite.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      update: {},
      create: { userId: user.id, productId },
    });
    
    return NextResponse.json(favorite);
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { message: 'Favori eklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Oturum gerekli' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ message: 'Ürün ID gerekli' }, { status: 400 });
    }

    await prisma.favorite.delete({
      where: { userId_productId: { userId: user.id, productId } },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { message: 'Favori kaldırılırken hata oluştu' },
      { status: 500 }
    );
  }
} 

