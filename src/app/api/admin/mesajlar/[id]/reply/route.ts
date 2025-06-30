import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
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
      select: { id: true, role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Bu işlem için yetkiniz yok.' },
        { status: 403 }
      );
    }

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { message: 'Mesaj içeriği gerekli.' },
        { status: 400 }
      );
    }

    // Konuşmayı bul
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          select: { id: true }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { message: 'Konuşma bulunamadı.' },
        { status: 404 }
      );
    }

    // Admin konuşmaya katılımcı değilse ekle
    if (!conversation.participants.some((p: { id: string }) => p.id === user.id)) {
      await prisma.conversation.update({
        where: { id },
        data: {
          participants: {
            connect: { id: user.id }
          }
        }
      });
    }

    // Mesajı gönder
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: user.id,
        conversationId: id,
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Yanıt gönderme hatası:', error);
    return NextResponse.json(
      { message: 'Yanıt gönderilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 