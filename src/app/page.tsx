'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaPhone, FaMapMarkerAlt, FaEnvelope, FaTruck, FaLeaf, FaPalette, FaMedal } from 'react-icons/fa';
import React from 'react';
import Image from 'next/image';
import './globals.css';

const hizmetler = [
  { 
    ad: 'Buketler', 
    ikon: '💐', 
    aciklama: 'Özel tasarım buketler ve aranjmanlar',
    link: '/urunler'
  },
  { 
    ad: 'Saksı Çiçekleri', 
    ikon: '🪴', 
    aciklama: 'Ev ve ofis için saksı çiçekleri',
    link: '/urunler'
  },
  { 
    ad: 'Çelenkler', 
    ikon: '🎀', 
    aciklama: 'Özel günler için çelenkler',
    link: '/urunler'
  },
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  if (status === 'loading') {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {/* Ana İçerik */}
      <div className="container my-5">
        {/* Üstte mağaza ve 4 kategori kutusu */}
        <div
          className="d-grid mb-5 homepage-grid"
          style={{
            gridTemplateColumns: '1.5fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '8px',
            minHeight: 400,
            background: '#fff',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 2px 16px rgba(0,0,0,0.07)'
          }}
        >
          {/* Sol büyük mağaza fotoğrafı (2 satırı kaplar) */}
          <a
            href="/urunler"
            className="magaza-link"
            style={{ gridRow: '1 / span 2', gridColumn: '1 / 2', display: 'block', height: '100%' }}
          >
            <img
              src="/magaza.png"
              alt="Mağaza"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </a>
          {/* Sağ üst: Güller */}
          <a
            href="/urunler?kategori=guller"
            className="kategori-link"
            style={{ gridRow: '1 / 2', gridColumn: '2 / 3', background: 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img
              src="/guller.png"
              alt="Güller"
              style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', display: 'block' }}
            />
          </a>
          {/* Sağ üst: Saksı Çiçekleri */}
          <a
            href="/urunler?kategori=saksi"
            className="kategori-link"
            style={{ gridRow: '1 / 2', gridColumn: '3 / 4', background: 'linear-gradient(135deg, #36d1c4 0%, #1e90ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img
              src="/saksi.png"
              alt="Saksı Çiçekleri"
              style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', display: 'block' }}
            />
          </a>
          {/* Sağ alt: Orkideler */}
          <a
            href="/urunler?kategori=orkideler"
            className="kategori-link"
            style={{ gridRow: '2 / 3', gridColumn: '2 / 3', background: 'linear-gradient(135deg, #f797a7 0%, #f16b6b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img
              src="/orkide.png"
              alt="Orkideler"
              style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', display: 'block' }}
            />
          </a>
          {/* Sağ alt: Buketler */}
          <a
            href="/urunler?kategori=buketler"
            className="kategori-link"
            style={{ gridRow: '2 / 3', gridColumn: '3 / 4', background: 'linear-gradient(135deg, #f797a7 0%, #f9d423 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img
              src="/buket.png"
              alt="Buketler"
              style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', display: 'block' }}
            />
          </a>
        </div>
        {/* Hero Section - Tanıtım Odaklı */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{borderRadius: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <div className="card-body p-5 text-center text-white">
                <h1 className="display-4 fw-bold mb-4">Çiçeklerle Mutluluk Taşıyoruz</h1>
                <p className="lead mb-4" style={{fontSize: '1.3rem'}}>
                  Samsun'un en güvenilir çiçekçisi olarak, sevdiklerinize özel anlar yaratmak için buradayız. 
                  Taze çiçekler, özel tasarımlar ve aynı gün teslimat ile mutluluğu kapınıza getiriyoruz.
                </p>
                <Link href="/urunler" className="btn btn-light btn-lg fw-bold px-4 py-3" style={{borderRadius: '12px'}}>
                  Ürünlerimizi Keşfedin
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hizmetler Bölümü */}
        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold mb-3">Neden Bizi Seçmelisiniz?</h2>
            <p className="text-muted lead">Kaliteli hizmet ve müşteri memnuniyeti odaklı yaklaşımımızla fark yaratıyoruz</p>
          </div>
          {/* Aynı Gün Teslimat */}
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="card border-0 shadow-sm h-100 text-center bg-dark" style={{borderRadius: '15px'}}>
              <div className="card-body p-4">
                <div className="mb-3 d-flex justify-content-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', background: '#0d6efd'}}>
                    <FaTruck size={38} color="#fff" />
                  </div>
                </div>
                <h5 className="fw-bold mb-3 text-white" style={{textShadow: '0 2px 8px #000'}}>Aynı Gün Teslimat</h5>
                <p className="mb-0 text-white-50" style={{fontWeight: 500}}>Samsun içi aynı gün teslimat garantisi ile çiçekleriniz taze kalır</p>
              </div>
            </div>
          </div>
          {/* Taze Çiçekler */}
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="card border-0 shadow-sm h-100 text-center bg-dark" style={{borderRadius: '15px'}}>
              <div className="card-body p-4">
                <div className="mb-3 d-flex justify-content-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', background: '#28a745'}}>
                    <FaLeaf size={38} color="#fff" />
                  </div>
                </div>
                <h5 className="fw-bold mb-3 text-white" style={{textShadow: '0 2px 8px #000'}}>Taze Çiçekler</h5>
                <p className="mb-0 text-white-50" style={{fontWeight: 500}}>Her gün taze çiçeklerle hazırlanan özel tasarımlar</p>
              </div>
            </div>
          </div>
          {/* Özel Tasarım */}
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="card border-0 shadow-sm h-100 text-center bg-dark" style={{borderRadius: '15px'}}>
              <div className="card-body p-4">
                <div className="mb-3 d-flex justify-content-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', background: '#ffc107'}}>
                    <FaPalette size={38} color="#fff" />
                  </div>
                </div>
                <h5 className="fw-bold mb-3 text-white" style={{textShadow: '0 2px 8px #000'}}>Özel Tasarım</h5>
                <p className="mb-0 text-white-50" style={{fontWeight: 500}}>Uzman çiçekçilerimizle özel anlarınız için tasarım</p>
              </div>
            </div>
          </div>
          {/* Kalite Garantisi */}
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="card border-0 shadow-sm h-100 text-center bg-dark" style={{borderRadius: '15px'}}>
              <div className="card-body p-4">
                <div className="mb-3 d-flex justify-content-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', background: '#17a2b8'}}>
                    <FaMedal size={38} color="#fff" />
                  </div>
                </div>
                <h5 className="fw-bold mb-3 text-white" style={{textShadow: '0 2px 8px #000'}}>Kalite Garantisi</h5>
                <p className="mb-0 text-white-50" style={{fontWeight: 500}}>%100 müşteri memnuniyeti garantisi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Müşteri Yorumları */}
        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold mb-3">Müşterilerimiz Ne Diyor?</h2>
            <p className="text-muted lead">Mutlu müşterilerimizin deneyimleri</p>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100 bg-dark" style={{borderRadius: '15px'}}>
              <div className="card-body p-4">
                <div className="mb-3">
                  <div className="text-warning">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </div>
                </div>
                <p className="mb-3 text-white" style={{fontWeight: 500, fontSize: '1.1rem'}}>
                  "Harika çiçekler ve çok hızlı teslimat. Annemin doğum gününde çok mutlu oldu. Kesinlikle tavsiye ederim!"
                </p>
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                    <span className="text-white fw-bold">A</span>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-white" style={{textShadow: '0 2px 8px #000'}}>Ayşe K.</h6>
                    <small className="text-white-50">Samsun</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100 bg-dark" style={{borderRadius: '15px'}}>
              <div className="card-body p-4">
                <div className="mb-3">
                  <div className="text-warning">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </div>
                </div>
                <p className="mb-3 text-white" style={{fontWeight: 500, fontSize: '1.1rem'}}>
                  "Özel tasarım buketim tam istediğim gibi oldu. Çiçekler çok taze ve güzel. Teşekkürler!"
                </p>
                <div className="d-flex align-items-center">
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                    <span className="text-white fw-bold">M</span>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-white" style={{textShadow: '0 2px 8px #000'}}>Mehmet Y.</h6>
                    <small className="text-white-50">Samsun</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100 bg-dark" style={{borderRadius: '15px'}}>
              <div className="card-body p-4">
                <div className="mb-3">
                  <div className="text-warning">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </div>
                </div>
                <p className="mb-3 text-white" style={{fontWeight: 500, fontSize: '1.1rem'}}>
                  "Aynı gün teslimat gerçekten çok pratik. Çiçekler uzun süre taze kaldı. Çok memnun kaldım."
                </p>
                <div className="d-flex align-items-center">
                  <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                    <span className="text-white fw-bold">F</span>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-white" style={{textShadow: '0 2px 8px #000'}}>Fatma S.</h6>
                    <small className="text-white-50">Samsun</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{borderRadius: '20px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
              <div className="card-body p-5">
                <div className="row text-center text-white">
                  <div className="col-md-3 col-sm-6 mb-4">
                    <div className="mb-2">
                      <i className="fa fa-users" style={{fontSize: '3rem'}}></i>
                    </div>
                    <h3 className="fw-bold mb-2">1000+</h3>
                    <p className="mb-0">Mutlu Müşteri</p>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-4">
                    <div className="mb-2">
                      <i className="fa fa-shipping-fast" style={{fontSize: '3rem'}}></i>
                    </div>
                    <h3 className="fw-bold mb-2">5000+</h3>
                    <p className="mb-0">Başarılı Teslimat</p>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-4">
                    <div className="mb-2">
                      <i className="fa fa-calendar-check" style={{fontSize: '3rem'}}></i>
                    </div>
                    <h3 className="fw-bold mb-2">5+</h3>
                    <p className="mb-0">Yıllık Deneyim</p>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-4">
                    <div className="mb-2">
                      <i className="fa fa-star" style={{fontSize: '3rem'}}></i>
                    </div>
                    <h3 className="fw-bold mb-2">4.9</h3>
                    <p className="mb-0">Müşteri Puanı</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* İletişim Bölümü */}
        <div className="container my-5">
          <div className="row justify-content-center g-4">
            <div className="col-12 col-md-4">
              <div className="card bg-white border-0 shadow-sm text-center p-4 h-100" style={{borderRadius: 20}}>
                <div className="mb-3">
                  <i className="fa fa-phone" style={{fontSize: 36, color: '#1565c0'}}></i>
                </div>
                <h5 className="fw-bold mb-2">Bize Ulaşın</h5>
                <div className="fw-bold" style={{fontSize: 18}}>0543 835 35 01</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card bg-white border-0 shadow-sm text-center p-4 h-100" style={{borderRadius: 20}}>
                <div className="mb-3">
                  <i className="fa fa-map-marker" style={{fontSize: 36, color: '#1565c0'}}></i>
                </div>
                <h5 className="fw-bold mb-2">Adres</h5>
                <div className="text-muted" style={{fontSize: 16}}>
                  Yeni Mah. 3112 Sk. İsmet İnönü Bulvarı No:48<br />
                  Duru Sitesi A Blok Atakum / Samsun
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card bg-white border-0 shadow-sm text-center p-4 h-100" style={{borderRadius: 20}}>
                <div className="mb-3">
                  <i className="fa fa-envelope" style={{fontSize: 36, color: '#1565c0'}}></i>
                </div>
                <h5 className="fw-bold mb-2">E-posta</h5>
                <div className="fw-bold" style={{fontSize: 18}}>info@cicekci.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sayfa sonu - Hizmetler ve iletişim */}
        <div className="container my-5">
          <h2 className="text-center fw-bold mb-3">Hizmetlerimiz</h2>
          <p className="text-center text-muted mb-5" style={{fontSize: 20, maxWidth: 700, margin: '0 auto'}}>
            Çiçek dünyasındaki tüm ihtiyaçlarınız için buradayız. Uzman ekibimizle taze çiçekler, aranjmanlar ve hızlı teslimat ile sevdiklerinize mutluluk ulaştırıyoruz.
          </p>
        </div>
      </div>
    </div>
  );
}

<style jsx global>{`
  @media (max-width: 600px) {
    .homepage-grid {
      display: flex !important;
      flex-direction: column !important;
      gap: 12px !important;
      min-height: unset !important;
    }
    .homepage-grid .magaza-link {
      width: 100% !important;
      height: auto !important;
      grid-row: unset !important;
      grid-column: unset !important;
      order: 0;
    }
    .homepage-grid .magaza-link img {
      width: 100% !important;
      height: auto !important;
      object-fit: contain !important;
      border-radius: 12px !important;
    }
    .homepage-grid .kategori-link {
      width: 100% !important;
      height: auto !important;
      order: unset;
    }
  }
`}</style> 