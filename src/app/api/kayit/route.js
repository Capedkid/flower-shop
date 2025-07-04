import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi zaten kullanılıyor.' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await hash(password, 12);

    // Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    // Hassas bilgileri çıkar
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: 'Kullanıcı başarıyla oluşturuldu.', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json(
      { message: 'Kullanıcı oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 