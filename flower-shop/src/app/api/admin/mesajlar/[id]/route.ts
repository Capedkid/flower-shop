import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function DELETE(
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

    // Mesajı sil
    await prisma.message.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Mesaj başarıyla silindi.' });
  } catch (error) {
    console.error('Mesaj silme hatası:', error);
    return NextResponse.json(
      { message: 'Mesaj silinirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 