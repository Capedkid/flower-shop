# Çiçekçi E-Ticaret Sitesi

Bu proje, Next.js, Prisma ve SQLite kullanılarak geliştirilmiş bir çiçekçi e-ticaret web uygulamasıdır.

## Özellikler

- Kullanıcı kaydı ve girişi
- Kullanıcı profili yönetimi
- Rol tabanlı erişim kontrolü (Admin ve Normal Kullanıcı)
- Ürün listeleme ve yönetimi
- Kategori yönetimi
- Mesajlaşma sistemi
- Sipariş yönetimi

## Teknolojiler

- Next.js
- Prisma ORM
- SQLite
- TypeScript

## Kurulum

1. Projeyi klonlayın:
```bash
git clone [proje-url]
cd flower-shop
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Veritabanını oluşturun:
```bash
npx prisma migrate dev
```

4. Uygulamayı başlatın:
```bash
npm run dev
```

## Admin Giriş Bilgileri

- E-posta: admin@example.com
- Şifre: admin123

## Proje Yapısı

```
src/
  ├── app/                    # Sayfa bileşenleri
  │   ├── admin/             # Admin paneli sayfaları
  │   ├── giris/             # Giriş sayfası
  │   ├── kayit/             # Kayıt sayfası
  │   ├── profil/            # Profil sayfası
  │   └── mesajlar/          # Mesajlaşma sayfası
  ├── components/            # Yeniden kullanılabilir bileşenler
  └── lib/                   # Yardımcı fonksiyonlar ve yapılandırmalar
```

## Veritabanı Şeması

Proje, aşağıdaki temel tabloları içerir:

- User: Kullanıcı bilgileri
- Profile: Kullanıcı profil bilgileri
- Product: Ürün bilgileri
- Category: Kategori bilgileri
- Order: Sipariş bilgileri
- OrderItem: Sipariş detayları
- Message: Mesajlaşma sistemi

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir özellik dalı oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Dalınıza push edin (`git push origin feature/amazing-feature`)
5. Bir Pull Request oluşturun 