import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { compare, hash } from 'bcryptjs';

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

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor.' },
        { status: 401 }
      );
    }
    const { currentPassword, newPassword, newPassword2 } = await request.json();
    if (!currentPassword || !newPassword || !newPassword2) {
      return NextResponse.json(
        { message: 'Tüm alanlar zorunludur.' },
        { status: 400 }
      );
    }
    if (newPassword !== newPassword2) {
      return NextResponse.json(
        { message: 'Yeni şifreler eşleşmiyor.' },
        { status: 400 }
      );
    }
    if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { message: 'Şifre en az 8 karakter, harf ve rakam içermelidir.' },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı.' },
        { status: 404 }
      );
    }
    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Mevcut şifre yanlış.' },
        { status: 400 }
      );
    }
    const hashed = await hash(newPassword, 10);
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashed },
    });
    return NextResponse.json({ message: 'Şifre başarıyla güncellendi.' });
  } catch (error) {
    console.error('Şifre güncelleme hatası:', error);
    return NextResponse.json(
      { message: 'Şifre güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 