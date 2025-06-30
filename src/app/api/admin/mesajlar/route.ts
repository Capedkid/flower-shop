import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
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

    // Admin'e gelen mesajlar ve admin'in gönderdiği yanıtlar
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { receiverId: session.user.id },
          {
            senderId: session.user.id,
            // content içinde type: 'reply' olanlar
            content: { contains: '"type":"reply"' }
          }
        ]
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true }
        },
        receiver: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Admin mesaj listesi hatası:', error);
    return NextResponse.json(
      { message: 'Mesajlar listelenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 