import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor.' },
        { status: 401 }
      );
    }

    // Admin kontrolü
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Bu işlem için yetkiniz yok.' },
        { status: 403 }
      );
    }

    const { stock } = await request.json();

    if (stock === undefined || stock < 0) {
      return NextResponse.json(
        { message: 'Geçerli bir stok miktarı gerekli.' },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { stock: parseInt(stock) },
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Stok güncelleme hatası:', error);
    return NextResponse.json(
      { message: 'Stok güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 