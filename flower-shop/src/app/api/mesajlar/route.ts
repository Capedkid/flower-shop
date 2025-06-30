import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {`n    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'Kullanıcı ID gerekli.' },
        { status: 400 }
      );
    }

    // Kullanıcının mesajlarını getir
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true }
        },
        receiver: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Mesaj listesi hatası:', error);
    return NextResponse.json(
      { message: 'Mesajlar listelenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {`n    const { id } = await params;
    const { name, email, phone, subject, message, senderId, receiverId } = await request.json();

    // Gerekli alanları kontrol et
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'Ad, e-posta, konu ve mesaj alanları zorunludur.' },
        { status: 400 }
      );
    }

    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Geçerli bir e-posta adresi giriniz.' },
        { status: 400 }
      );
    }

    // Admin kullanıcısını bul (varsayılan admin)
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      return NextResponse.json(
        { message: 'Sistem yöneticisi bulunamadı.' },
        { status: 500 }
      );
    }

    // Mesajı veritabanına kaydet
    const newMessage = await prisma.message.create({
      data: {
        senderId: senderId || null, // Giriş yapmamış kullanıcılar için null
        receiverId: adminUser.id,
        content: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message
        })
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true }
        },
        receiver: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(
      { 
        message: 'Mesajınız başarıyla gönderildi.',
        data: newMessage
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    return NextResponse.json(
      { message: 'Mesaj gönderilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 

