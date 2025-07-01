import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'You need to be logged in.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      );
    }

    // Sadece iki kullanıcı arasındaki mesajları getir
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: id },
          { senderId: id, receiverId: user.id },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching messages.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'You need to be logged in.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      );
    }

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { message: 'Message content is required.' },
        { status: 400 }
      );
    }

    // id parametresi, mesajın gönderileceği kullanıcı id'si olacak
    const receiver = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!receiver) {
      return NextResponse.json(
        { message: 'Receiver not found.' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: user.id,
        receiverId: receiver.id,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { message: 'An error occurred while sending the message.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    });

    if (!message) {
      return NextResponse.json(
        { message: 'Message not found.' },
        { status: 404 }
      );
    }

    if (message.senderId !== user.id) {
      return NextResponse.json(
        { message: 'You are not authorized to delete this message.' },
        { status: 403 }
      );
    }

    await prisma.message.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Message deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting the message.' },
      { status: 500 }
    );
  }
} 