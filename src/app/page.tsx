'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaTruck, FaLeaf, FaPalette, FaMedal, FaQuoteLeft } from 'react-icons/fa';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import './globals.css';

const categories = [
  {
    ad: 'Taze Buketler',
    slug: 'buketler',
    image: '/buket.png',
    color: 'var(--accent-rose)'
  },
  {
    ad: 'Saksı Çiçekleri',
    slug: 'saksi',
    image: '/saksi.png',
    color: 'var(--accent-green)'
  },
  {
    ad: 'Nadide Orkideler',
    slug: 'orkideler',
    image: '/orkide.png',
    color: 'var(--accent-gold)'
  },
  {
    ad: 'Özel Güller',
    slug: 'guller',
    image: '/guller.png',
    color: '#E27D60'
  },
];

const features = [
  {
    icon: <FaTruck />,
    title: 'Şehir İçi Teslimat',
    desc: 'Samsun genelinde aynı gün taze teslimat.'
  },
  {
    icon: <FaLeaf />,
    title: 'Doğal Yetiştirme',
    desc: 'Sürdürülebilir kaynaklardan en taze çiçekler.'
  },
  {
    icon: <FaPalette />,
    title: 'Artizan Tasarım',
    desc: 'Her buket bir sanat eseri olarak hazırlanır.'
  },
  {
    icon: <FaMedal />,
    title: 'Küratör Kalitesi',
    desc: 'Sadece en yüksek standarttaki çiçekler seçilir.'
  }
];

export default function Home() {
  const { status } = useSession();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
  };

  if (status === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-dark" role="status" style={{ borderRightColor: 'var(--accent-gold)' }}>
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="botanical-bg">
      {/* Editorial Hero Section */}
      <section className="hero-editorial">
        <Image
          src="/hero-bg.png"
          alt="Botanical Background"
          fill
          priority
          style={{ objectFit: 'cover', opacity: 0.8 }}
        />
        <div className="hero-image-overlay" />
        <div className="container hero-content">
          <div className="row">
            <div className="col-lg-8">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2 }}
              >
                <span className="text-uppercase tracking-widest small mb-3 d-block font-outfit" style={{ color: 'var(--accent-gold)', letterSpacing: '0.4em' }}>
                  SAMSUN'DAN DÜNYAYA ZARAFET
                </span>
                <h1 className="display-1 mb-4 font-cormorant">
                  Çiçekler fısıldar,<br />
                  <span style={{ color: 'var(--accent-rose)' }}>biz anlatırız.</span>
                </h1>
                <p className="lead font-outfit mb-5 opacity-75 max-w-sm" style={{ maxWidth: '500px', lineHeight: '1.8' }}>
                  Her mevsimin ruhunu yansıtan taze çiçeklerimiz ve usta ellerden çıkan tasarımlarımızla duygularınıza estetik bir dokunuş katıyoruz.
                </p>
                <div className="d-flex gap-3">
                  <Link href="/urunler" className="btn btn-botanical btn-botanical-primary">
                    Koleksiyonu Keşfet
                  </Link>
                  <Link href="/hakkimizda" className="btn btn-botanical btn-botanical-outline" style={{ color: '#fff', borderColor: '#fff' }}>
                    Hikayemiz
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid - Grid Breaking Layout */}
      <section className="py-10 container my-5 py-5">
        <motion.div
          className="row align-items-end mb-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="col-md-6">
            <motion.h2 className="display-4 font-cormorant mb-0" variants={itemVariants}>
              Botanik Seçkilerimiz
            </motion.h2>
          </div>
          <div className="col-md-6 text-md-end">
            <motion.p className="text-muted font-outfit mb-0" variants={itemVariants}>
              Her zevke hitap eden özenle ayrıştırılmış kategoriler.
            </motion.p>
          </div>
        </motion.div>

        <div className="row g-4">
          {categories.map((cat, idx) => (
            <div key={cat.slug} className={`col-md-${idx % 3 === 0 ? '6' : '3'}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="position-relative overflow-hidden"
                style={{ height: '400px', cursor: 'pointer' }}
              >
                <Link href={`/urunler?kategori=${cat.slug}`}>
                  <div className="position-absolute p-4 w-100 h-100 d-flex flex-column justify-content-end z-2">
                    <h3 className="text-white font-cormorant mb-1">{cat.ad}</h3>
                    <span className="text-white-50 font-outfit small tracking-widest text-uppercase">Şimdi İncele &rarr;</span>
                  </div>
                  <div className="position-absolute w-100 h-100 z-1" style={{ background: `linear-gradient(to top, rgba(0,0,0,0.8), transparent)` }} />
                  <Image
                    src={cat.image}
                    alt={cat.ad}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Features - Minimalist Cards */}
      <section className="py-5 my-5" style={{ background: '#FAF9F6' }}>
        <div className="container">
          <div className="row g-0 border-top border-bottom">
            {features.map((f, idx) => (
              <div key={idx} className="col-md-3 border-end p-5">
                <div className="mb-4" style={{ fontSize: '2rem', color: 'var(--accent-green)' }}>
                  {f.icon}
                </div>
                <h4 className="font-cormorant h3 mb-3">{f.title}</h4>
                <p className="text-muted font-outfit small mb-0">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section - High End Editorial */}
      <section className="py-5 my-5 container">
        <div className="row justify-content-center text-center py-5">
          <div className="col-lg-8">
            <FaQuoteLeft className="mb-4 opacity-25" style={{ fontSize: '3rem', color: 'var(--accent-rose)' }} />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            >
              <h3 className="display-5 font-cormorant mb-4 italic" style={{ fontStyle: 'italic' }}>
                "Samsun'da estetiği ve zarafeti bu denli harmanlayan başka bir yer yok. Çiçeklerin tazeliği her zaman büyüleyici."
              </h3>
              <p className="font-outfit text-uppercase tracking-widest small" style={{ color: 'var(--accent-gold)' }}>
                AYŞE K. &mdash; DAİMİ MÜŞTERİMİZ
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visual Statistics */}
      <section className="py-5 position-relative overflow-hidden" style={{ minHeight: '400px' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
          <Image src="/hero-bg.png" alt="Overlay" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="container position-relative z-1">
          <div className="row text-center">
            <div className="col-md-4">
              <span className="display-2 font-cormorant d-block mb-2">5000+</span>
              <span className="text-uppercase font-outfit tracking-widest small text-muted">Aralıksız Mutluluk</span>
            </div>
            <div className="col-md-4">
              <span className="display-2 font-cormorant d-block mb-2">12</span>
              <span className="text-uppercase font-outfit tracking-widest small text-muted">Ödüllü Tasarımcı</span>
            </div>
            <div className="col-md-4">
              <span className="display-2 font-cormorant d-block mb-2">1h</span>
              <span className="text-uppercase font-outfit tracking-widest small text-muted">Ekspres Teslimat</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-5 mt-5 text-center">
        <div className="container py-5 border-top">
          <h2 className="display-4 font-cormorant mb-4">Size Özel Bir Tasarım İster Misiniz?</h2>
          <p className="font-outfit text-muted mb-5">Hemen bizimle iletişime geçin, hayalinizdeki buketi tasarlayalım.</p>
          <Link href="/iletisim" className="btn btn-botanical btn-botanical-outline">Bize Ulaşın</Link>
        </div>
      </section>
    </div>
  );
}