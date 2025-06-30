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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        role: true,
        profile: {
          select: {
            phone: true,
            address: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.profile?.phone || '',
      address: user.profile?.address || '',
    });
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    return NextResponse.json(
      { message: 'Profil bilgileri alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor.' },
        { status: 401 }
      );
    }

    const { name, phone, address } = await request.json();

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
      select: { id: true, name: true, email: true, role: true },
    });

    // Profile upsert
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: { phone, address },
      create: { userId: user.id, phone, address },
    });

    return NextResponse.json({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: phone || '',
      address: address || '',
    });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    return NextResponse.json(
      { message: 'Profil güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 