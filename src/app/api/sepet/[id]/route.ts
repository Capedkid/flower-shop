import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PUT(
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
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      );
    }

    const { quantity } = await request.json();

    if (!quantity) {
      return NextResponse.json(
        { message: 'Quantity is required.' },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        product: {
          select: { stock: true },
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: 'Cart item not found.' },
        { status: 404 }
      );
    }

    if (cartItem.userId !== user.id) {
      return NextResponse.json(
        { message: 'You are not authorized to update this cart item.' },
        { status: 403 }
      );
    }

    if (cartItem.product.stock < quantity) {
      return NextResponse.json(
        { message: 'Not enough stock available.' },
        { status: 400 }
      );
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(updatedCartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating the cart item.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: 'Cart item not found.' },
        { status: 404 }
      );
    }

    if (cartItem.userId !== user.id) {
      return NextResponse.json(
        { message: 'You are not authorized to delete this cart item.' },
        { status: 403 }
      );
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Cart item deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting the cart item.' },
      { status: 500 }
    );
  }
} 