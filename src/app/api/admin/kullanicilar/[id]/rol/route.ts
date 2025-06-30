import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor.' },
        { status: 401 }
      );
    }

    // Admin kontrolü
    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Bu işlem için yetkiniz yok.' },
        { status: 403 }
      );
    }

    // Kendi rolünü değiştirmeye çalışıyor mu kontrolü
    if (admin.id.toString() === params.id) {
      return NextResponse.json(
        { message: 'Kendi rolünüzü değiştiremezsiniz.' },
        { status: 400 }
      );
    }

    const { role } = await request.json();

    if (!['USER', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { message: 'Geçersiz rol.' },
        { status: 400 }
      );
    }
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Rol güncelleme hatası:', error);
    return NextResponse.json(
      { message: 'Rol güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 