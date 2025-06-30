import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {`n    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor.' },
        { status: 401 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı.' },
        { status: 404 }
      );
    }
    // Kullanıcının mesajlaştığı kişileri getir
    const sohbetler = await prisma.message.groupBy({
      by: ['senderId', 'receiverId'],
      where: {
        OR: [
          { senderId: currentUser.id },
          { receiverId: currentUser.id },
        ],
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          id: 'desc'
        },
      },
    });

    // Her bir sohbet için kullanıcı bilgilerini getir
    const sohbetDetaylari = await Promise.all(
      sohbetler.map(async (sohbet) => {
        const otherUserId = sohbet.senderId === currentUser.id
          ? sohbet.receiverId 
          : sohbet.senderId;

        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });

        return {
          kullanici: otherUser,
          mesajSayisi: sohbet._count._all,
        };
      })
    );

    return NextResponse.json(sohbetDetaylari);
  } catch (error) {
    console.error('Sohbetleri getirme hatası:', error);
    return NextResponse.json(
      { message: 'Sohbetler getirilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 

