import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'You need to be logged in.' },
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
        { message: 'You do not have permission for this operation.' },
        { status: 403 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          select: { id: true, name: true, email: true }
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { message: 'Conversation not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching the conversation.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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