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

    // İstatistikleri paralel olarak getir
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      recentOrders,
      lowStockProducts,
      recentUsers
    ] = await Promise.all([
      // Toplam kullanıcı sayısı
      prisma.user.count(),
      
      // Toplam sipariş sayısı
      prisma.order.count(),
      
      // Toplam ürün sayısı
      prisma.product.count(),
      
      // Toplam gelir
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      }),
      
      // Son 5 sipariş
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true }
          }
        }
      }),
      
      // Düşük stok ürünleri (stok < 10)
      prisma.product.findMany({
        where: { stock: { lt: 10 } },
        take: 5,
        orderBy: { stock: 'asc' }
      }),
      
      // Son 5 kullanıcı
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, createdAt: true }
      })
    ]);

    // Aylık gelir verilerini hesapla (son 12 ay)
    const monthlyRevenue = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
      
      const monthRevenue = await prisma.order.aggregate({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _sum: { totalAmount: true }
      });
      
      monthlyRevenue.push(monthRevenue._sum.totalAmount || 0);
    }

    const dashboardData = {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentOrders: recentOrders.map((order: any) => ({
        id: order.id,
        customerName: order.user.name,
        amount: order.totalAmount,
        status: order.status,
        date: order.createdAt
      })),
      lowStockProducts: lowStockProducts.map((product: { id: string; name: string; stock: number; }) => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        minStock: 10
      })),
      recentUsers: recentUsers.map((user: { id: string; name: string; email: string; createdAt: Date; }) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        date: user.createdAt
      })),
      monthlyRevenue
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard verileri hatası:', error);
    return NextResponse.json(
      { message: 'Dashboard verileri yüklenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 

