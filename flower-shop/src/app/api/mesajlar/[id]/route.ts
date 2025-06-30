import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'You need to be logged in.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      );
    }

    const message = await prisma.message.findUnique({
      where: { id: params.id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        { message: 'Message not found.' },
        { status: 404 }
      );
    }

    if (message.senderId !== user.id && message.receiverId !== user.id) {
      return NextResponse.json(
        { message: 'You are not authorized to view this message.' },
        { status: 403 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching the message.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor.' },
        { status: 401 }
      );
    }

    // Sadece mesajın sahibi veya admin silebilir
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return NextResponse.json(
        { message: 'Mesaj bulunamadı.' },
        { status: 404 }
      );
    }

    if (user?.role !== 'ADMIN' && message.receiverId !== user?.id) {
      return NextResponse.json(
        { message: 'Bu mesajı silme yetkiniz yok.' },
        { status: 403 }
      );
    }

    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Mesaj silindi.' });
  } catch (error) {
    console.error('Mesaj silme hatası:', error);
    return NextResponse.json(
      { message: 'Mesaj silinirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 