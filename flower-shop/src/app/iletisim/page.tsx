'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface MessageForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function Iletisim() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<MessageForm>({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/mesajlar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          senderId: session?.user?.id || null,
          receiverId: 'admin' // Admin'e gönder
        }),
      });

      if (response.ok) {
        setSuccess('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
        setFormData({
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Mesaj gönderilirken bir hata oluştu.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* İletişim Formu */}
        <div className="col-lg-7 mb-4">
          <h5 className="fw-bold mb-3 border-bottom pb-2">İLETİŞİM FORMU</h5>
          
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <FaCheckCircle className="me-2" />
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
            </div>
          )}

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <FaExclamationTriangle className="me-2" />
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label">Adınız Soyadınız</label>
                <input 
                  type="text" 
                  className="form-control bg-white text-dark" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Eposta Adresiniz</label>
                <input 
                  type="email" 
                  className="form-control bg-white text-dark" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label">Telefon Numaranız</label>
                <input 
                  type="text" 
                  className="form-control bg-white text-dark" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Konu</label>
                <select 
                  className="form-select bg-white text-dark" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Konu Seçiniz</option>
                  <option value="Genel">Genel</option>
                  <option value="Sipariş">Sipariş</option>
                  <option value="Destek">Destek</option>
                  <option value="Şikayet">Şikayet</option>
                  <option value="Öneri">Öneri</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Mesajınız</label>
              <textarea 
                className="form-control bg-white text-dark" 
                rows={5} 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Mesajınızı buraya yazın..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary px-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Gönderiliyor...
                </>
              ) : (
                'GÖNDER'
              )}
            </button>
          </form>
        </div>
        
        {/* İletişim Bilgileri */}
        <div className="col-lg-5">
          <h5 className="fw-bold mb-3 border-bottom pb-2">İLETİŞİM BİLGİLERİMİZ</h5>
          <div className="row">
            <div className="col-12 mb-4">
              <div className="fw-semibold mb-2">ANA MERKEZ</div>
              <div className="d-flex align-items-start mb-3">
                <FaEnvelope className="me-2 mt-1 text-primary" />
                <div>
                  <div className="fw-semibold">Eposta Adresimiz</div>
                  <div className="text-muted small">siparis@samsunatakumcicekci.com</div>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <FaMapMarkerAlt className="me-2 mt-1 text-primary" />
                <div>
                  <div className="fw-semibold">Merkez Adresimiz</div>
                  <div className="text-muted small">Yeni Mah. 3112 Sk. İsmet İnönü Bulvarı No:48 Duru Sitesi A Blok Atakum / Samsun</div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="fw-semibold mb-2">SATIŞ MERKEZİ</div>
              <div className="d-flex align-items-start mb-3">
                <FaEnvelope className="me-2 mt-1 text-primary" />
                <div>
                  <div className="fw-semibold">Eposta Adresimiz</div>
                  <div className="text-muted small">info@samsunatakumcicekci.com</div>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <FaPhone className="me-2 mt-1 text-primary" />
                <div>
                  <div className="fw-semibold">Telefon</div>
                  <div className="text-muted small">0543 835 35 01</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Çalışma Saatleri */}
          <div className="mt-4">
            <h6 className="fw-bold mb-3">ÇALIŞMA SAATLERİ</h6>
            <div className="row">
              <div className="col-6">
                <div className="text-muted small">Pazartesi - Cuma</div>
                <div className="fw-semibold">09:00 - 19:00</div>
              </div>
              <div className="col-6">
                <div className="text-muted small">Cumartesi</div>
                <div className="fw-semibold">09:00 - 18:00</div>
              </div>
              <div className="col-6 mt-2">
                <div className="text-muted small">Pazar</div>
                <div className="fw-semibold">10:00 - 17:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 