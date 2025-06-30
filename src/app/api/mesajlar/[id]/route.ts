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

    // Kullanıcı sadece kendi konuşmalarını görebilir (admin hariç)
    if (user.role !== 'ADMIN' && !conversation.participants.some((p: { id: string }) => p.id === user.id)) {
      return NextResponse.json(
        { message: 'You are not authorized to view this conversation.' },
        { status: 403 }
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

export async function POST(
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
        { message: 'Conversation not found.' },
        { status: 404 }
      );
    }

    // Kullanıcı sadece kendi konuşmalarına mesaj gönderebilir (admin hariç)
    if (user.role !== 'ADMIN' && !conversation.participants.some((p: { id: string }) => p.id === user.id)) {
      return NextResponse.json(
        { message: 'You are not authorized to send messages to this conversation.' },
        { status: 403 }
      );
    }

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { message: 'Message content is required.' },
        { status: 400 }
      );
    }

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