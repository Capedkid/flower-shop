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
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Bu işlem için yetkiniz yok.' },
        { status: 403 }
      );
    }

    const { content, originalMessage } = await request.json();

    if (!content || !originalMessage) {
      return NextResponse.json(
        { message: 'Yanıt içeriği ve orijinal mesaj gerekli.' },
        { status: 400 }
      );
    }

    // Orijinal mesajı bul
    const originalMsg = await prisma.message.findUnique({
      where: { id },
      include: {
        sender: { select: { id: true, name: true, email: true } }
      }
    });

    if (!originalMsg) {
      return NextResponse.json(
        { message: 'Orijinal mesaj bulunamadı.' },
        { status: 404 }
      );
    }

    // Yanıt mesajını oluştur
    const replyMessage = await prisma.message.create({
      data: {
        senderId: session.user.id, // Admin
        receiverId: originalMsg.senderId || 'anonymous', // Orijinal gönderen
        content: JSON.stringify({
          type: 'reply',
          originalMessageId: id,
          adminName: session.user.name,
          adminEmail: session.user.email,
          message: content,
          timestamp: new Date().toISOString()
        })
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } }
      }
    });

    return NextResponse.json({
      message: 'Yanıt başarıyla gönderildi.',
      data: replyMessage
    });
  } catch (error) {
    console.error('Mesaj yanıtlama hatası:', error);
    return NextResponse.json(
      { message: 'Yanıt gönderilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 