'use client';

import Link from 'next/link';
import { 
  FaHeart, 
  FaLeaf, 
  FaTruck, 
  FaAward, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaStar,
  FaUsers,
  FaShieldAlt,
  FaSmile,
  FaPalette,
  FaMedal
} from 'react-icons/fa';

export default function HakkimizdaPage() {
  return (
    <div className="bg-light min-vh-100">
      <div className="container my-5">
        {/* Hero Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{borderRadius: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <div className="card-body p-5 text-center text-white">
                <h1 className="display-4 fw-bold mb-4">Hakkımızda</h1>
                <p className="lead mb-4" style={{fontSize: '1.3rem'}}>
                  2010 yılından beri çiçek sevginizi en güzel şekilde ifade ediyoruz
                </p>
                <div className="d-flex justify-content-center gap-3 mt-4">
                  <FaStar className="text-warning" size={20} />
                  <FaStar className="text-warning" size={20} />
                  <FaStar className="text-warning" size={20} />
                  <FaStar className="text-warning" size={20} />
                  <FaStar className="text-warning" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hikayemiz ve Misyonumuz */}
        <div className="row mb-5">
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100 bg-dark" style={{borderRadius: '15px'}}>
              <div className="card-body p-4">
                <div className="mb-3 d-flex justify-content-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', background: '#0d6efd'}}>
                    <FaLeaf size={38} color="#fff" />
                  </div>
                </div>
                <h5 className="fw-bold mb-3 text-white text-center" style={{textShadow: '0 2px 8px #000'}}>Hikayemiz</h5>
                <p className="text-white-50 mb-3" style={{fontWeight: 500}}>
                  2010 yılında küçük bir çiçek dükkanı olarak başladığımız yolculuğumuzda, 
                  bugün Türkiye'nin önde gelen online çiçek satış platformlarından biri haline geldik.
                </p>
                <p className="text-white-50 mb-3" style={{fontWeight: 500}}>
                  Her çiçeğin kendine özgü bir dili olduğuna inanıyoruz. Sevgimizi, 
                  mutluluğumuzu, üzüntümüzü ve tüm duygularımızı çiçeklerle ifade ediyoruz.
                </p>
                <p className="text-white-50 mb-0" style={{fontWeight: 500}}>
                  Müşterilerimizin her özel anında yanlarında olmak, 
                  en taze ve kaliteli çiçekleri sunmak temel misyonumuzdur.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100 bg-dark" style={{borderRadius: '15px'}}>
              <div className="card-body p-4">
                <div className="mb-3 d-flex justify-content-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', background: '#28a745'}}>
                    <FaAward size={38} color="#fff" />
                  </div>
                </div>
                <h5 className="fw-bold mb-3 text-white text-center" style={{textShadow: '0 2px 8px #000'}}>Misyonumuz</h5>
                <ul className="list-unstyled">
                  <li className="mb-2 d-flex align-items-center">
                    <FaHeart className="text-danger me-3" size={16} />
                    <span className="text-white-50" style={{fontWeight: 500}}>En taze ve kaliteli çiçekleri müşterilerimize sunmak</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <FaHeart className="text-danger me-3" size={16} />
                    <span className="text-white-50" style={{fontWeight: 500}}>Özel günlerinizi unutulmaz kılmak</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <FaHeart className="text-danger me-3" size={16} />
                    <span className="text-white-50" style={{fontWeight: 500}}>Hızlı ve güvenli teslimat sağlamak</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <FaHeart className="text-danger me-3" size={16} />
                    <span className="text-white-50" style={{fontWeight: 500}}>Müşteri memnuniyetini en üst seviyede tutmak</span>
                  </li>
                  <li className="mb-0 d-flex align-items-center">
                    <FaHeart className="text-danger me-3" size={16} />
                    <span className="text-white-50" style={{fontWeight: 500}}>Çevre dostu ve sürdürülebilir çözümler sunmak</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{borderRadius: '20px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
              <div className="card-body p-5">
                <h2 className="h3 fw-bold text-center text-white mb-5">Rakamlarla Biz</h2>
                <div className="row text-center text-white">
                  <div className="col-md-3 col-sm-6 mb-4">
                    <div className="mb-2">
                      <FaAward style={{fontSize: '3rem'}} />
                    </div>
                    <h3 className="fw-bold mb-2">13+</h3>
                    <p className="mb-0">Yıllık Deneyim</p>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-4">
                    <div className="mb-2">
                      <FaUsers style={{fontSize: '3rem'}} />
                    </div>
                    <h3 className="fw-bold mb-2">50K+</h3>
                    <p className="mb-0">Mutlu Müşteri</p>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-4">
                    <div className="mb-2">
                      <FaLeaf style={{fontSize: '3rem'}} />
                    </div>
                    <h3 className="fw-bold mb-2">100+</h3>
                    <p className="mb-0">Çiçek Çeşidi</p>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-4">
                    <div className="mb-2">
                      <FaShieldAlt style={{fontSize: '3rem'}} />
                    </div>
                    <h3 className="fw-bold mb-2">24/7</h3>
                    <p className="mb-0">Müşteri Desteği</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hizmetlerimiz */}
        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold mb-3">Hizmetlerimiz</h2>
            <p className="text-muted lead">Kaliteli hizmet ve müşteri memnuniyeti odaklı yaklaşımımızla fark yaratıyoruz</p>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100 text-center bg-dark" style={{borderRadius: '15px'}}>
              <div className="card-body p-4">
                <div className="mb-3 d-flex justify-content-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', background: '#0d6efd'}}>
                    <FaTruck size={38} color="#fff" />
                  </div>
                </div>
                <h5 className="fw-bold mb-3 text-white" style={{textShadow: '0 2px 8px #000'}}>Hızlı Teslimat</h5>
                <p className="mb-0 text-white-50" style={{fontWeight: 500}}>Aynı gün teslimat ile çiçeklerinizi sevdiklerinize ulaştırıyoruz.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100 text-center bg-dark" style={{borderRadius: '15px'}}>
              <div className="card-body p-4">
                <div className="mb-3 d-flex justify-content-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', background: '#28a745'}}>
                    <FaLeaf size={38} color="#fff" />
                  </div>
                </div>
                <h5 className="fw-bold mb-3 text-white" style={{textShadow: '0 2px 8px #000'}}>Taze Çiçekler</h5>
                <p className="mb-0 text-white-50" style={{fontWeight: 500}}>En taze ve kaliteli çiçekleri özenle seçiyor ve hazırlıyoruz.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100 text-center bg-dark" style={{borderRadius: '15px'}}>
              <div className="card-body p-4">
                <div className="mb-3 d-flex justify-content-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', background: '#ffc107'}}>
                    <FaPalette size={38} color="#fff" />
                  </div>
                </div>
                <h5 className="fw-bold mb-3 text-white" style={{textShadow: '0 2px 8px #000'}}>Özel Tasarım</h5>
                <p className="mb-0 text-white-50" style={{fontWeight: 500}}>Kişiselleştirilmiş çiçek aranjmanları ile özel anlar yaratıyoruz.</p>
              </div>
            </div>
          </div>
        </div>

        {/* İletişim */}
        <div className="row mb-5">
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm bg-dark" style={{borderRadius: '15px'}}>
              <div className="card-body p-4">
                <h2 className="h3 fw-bold text-white mb-4" style={{textShadow: '0 2px 8px #000'}}>
                  İletişim Bilgileri
                </h2>
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                      <FaPhone className="text-white" size={16} />
                    </div>
                    <span className="text-white fw-semibold">+90 (212) 555 0123</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                      <FaEnvelope className="text-white" size={16} />
                    </div>
                    <span className="text-white fw-semibold">info@cicekci.com</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                      <FaMapMarkerAlt className="text-white" size={16} />
                    </div>
                    <span className="text-white fw-semibold">Kadıköy, İstanbul</span>
                  </div>
                </div>
                <div>
                  <h5 className="fw-bold mb-3 text-white">Bizi Takip Edin</h5>
                  <div className="d-flex gap-3">
                    <a href="#" className="text-decoration-none">
                      <div className="bg-danger rounded-circle d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                        <FaInstagram size={20} className="text-white" />
                      </div>
                    </a>
                    <a href="#" className="text-decoration-none">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                        <FaFacebook size={20} className="text-white" />
                      </div>
                    </a>
                    <a href="#" className="text-decoration-none">
                      <div className="bg-info rounded-circle d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                        <FaTwitter size={20} className="text-white" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm bg-dark" style={{borderRadius: '15px'}}>
              <div className="card-body p-4">
                <h2 className="h3 fw-bold text-white mb-4" style={{textShadow: '0 2px 8px #000'}}>
                  Çalışma Saatleri
                </h2>
                <div className="row mb-4">
                  <div className="col-6">
                    <p className="mb-3 fw-semibold text-white">Pazartesi - Cuma:</p>
                    <p className="mb-3 fw-semibold text-white">Cumartesi:</p>
                    <p className="mb-3 fw-semibold text-white">Pazar:</p>
                  </div>
                  <div className="col-6">
                    <p className="mb-3 text-white-50">08:00 - 20:00</p>
                    <p className="mb-3 text-white-50">09:00 - 18:00</p>
                    <p className="mb-3 text-white-50">10:00 - 16:00</p>
                  </div>
                </div>
                <div>
                  <Link href="/iletisim" className="btn btn-primary btn-lg">
                    İletişim Sayfasına Git
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{borderRadius: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <div className="card-body p-5 text-center text-white">
                <h2 className="h3 fw-bold mb-3">
                  Çiçeklerin Büyülü Dünyasına Katılın
                </h2>
                <p className="lead mb-4" style={{fontSize: '1.3rem'}}>
                  Sevdiklerinize en güzel çiçekleri gönderin, özel anları unutulmaz kılın.
                </p>
                <Link href="/urunler" className="btn btn-light btn-lg fw-bold px-4 py-3" style={{borderRadius: '12px'}}>
                  Ürünlerimizi İnceleyin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 