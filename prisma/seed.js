const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Kategoriler
  const gullerkategori = await prisma.category.upsert({
    where: { id: 'guller' },
    update: {},
    create: { id: 'guller', name: 'Güller', description: 'Taze ve güzel güller.' },
  });
  const saksikategori = await prisma.category.upsert({
    where: { id: 'saksi' },
    update: {},
    create: { id: 'saksi', name: 'Saksı Çiçekleri', description: 'Ev ve ofisler için saksı çiçekleri.' },
  });
  const orkidelerkategori = await prisma.category.upsert({
    where: { id: 'orkideler' },
    update: {},
    create: { id: 'orkideler', name: 'Orkideler', description: 'Zarif ve şık orkideler.' },
  });
  const buketlerkategori = await prisma.category.upsert({
    where: { id: 'buketler' },
    update: {},
    create: { id: 'buketler', name: 'Buketler', description: 'Özel günler için çiçek buketleri.' },
  });
  const ciceklerKategori = await prisma.category.upsert({
    where: { id: 'cicekler' },
    update: {},
    create: { id: 'cicekler', name: 'Çiçekler', description: 'Mevsimlik ve karışık çiçekler.' },
  });

  // Önce mevcut ürünleri temizle
  await prisma.product.deleteMany({});

  // Temel ürünler
  await prisma.product.createMany({
    data: [
      {
        name: 'Kırmızı Gül Buketi',
        description: '12 adet taze kırmızı gül buketi.',
        price: 750,
        image: '/guller.png',
        stock: 20,
        categoryId: gullerkategori.id,
      },
      {
        name: 'Yukka Saksı Çiçeği',
        description: 'Dekoratif ve dayanıklı saksı çiçeği.',
        price: 1750,
        image: '/saksi.png',
        stock: 10,
        categoryId: saksikategori.id,
      },
      {
        name: 'Beyaz Orkide',
        description: 'Zarif ve şık beyaz orkide.',
        price: 1200,
        image: '/orkide.png',
        stock: 8,
        categoryId: orkidelerkategori.id,
      },
      {
        name: 'Renkli Çiçek Buketi',
        description: 'Farklı çiçeklerden oluşan renkli buket.',
        price: 1100,
        image: '/buket.png',
        stock: 15,
        categoryId: buketlerkategori.id,
      },
      {
        name: 'Mevsim Çiçekleri Aranjmanı',
        description: 'Renkli mevsim çiçeklerinden aranjman.',
        price: 950,
        image: '/urun1.png',
        stock: 12,
        categoryId: ciceklerKategori.id,
      },
    ]
  });

  // Admin ve kullanıcı hesapları
  const passwordUser = await hash('kullanici123', 10);
  const passwordAdmin = await hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'kullanici@site.com' },
    update: {},
    create: {
      name: 'Örnek Kullanıcı',
      email: 'kullanici@site.com',
      password: passwordUser,
      role: 'USER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@site.com' },
    update: {},
    create: {
      name: 'Admin Kullanıcı',
      email: 'admin@site.com',
      password: passwordAdmin,
      role: 'ADMIN',
    },
  });

  console.log('Seed işlemi tamamlandı!');
  console.log('Eklenen ürün sayısı: 5');
  console.log('Eklenen kategori sayısı: 5');
  console.log('Eklenen kullanıcı sayısı: 2');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 