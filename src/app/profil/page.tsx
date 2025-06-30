'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaShoppingCart, FaEnvelopeOpen } from 'react-icons/fa';
import Link from 'next/link';

export default function Profil() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('profil');
  const [edit, setEdit] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/kullanici/profil');
      if (!res.ok) throw new Error('Bilgiler alınamadı');
      const data = await res.json();
      setForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
      });
    } catch (err) {
      setError('Profil bilgileri alınamadı.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const res = await fetch('/api/kullanici/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Güncelleme başarısız');
      setSuccess('Bilgiler başarıyla güncellendi!');
      setEdit(false);
    } catch (err) {
      setError('Bilgiler güncellenemedi.');
    }
  };

  if (session === null) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  // Menü başlıkları
  const menu = [
    { key: 'profil', label: 'Profil Bilgilerim' },
    { key: 'sifre', label: 'Şifre Değiştir' },
  ];
  if (session?.user?.role !== 'ADMIN') {
    menu.push({ key: 'siparis', label: 'Siparişlerim' });
    menu.push({ key: 'favori', label: 'Favori Ürünlerim' });
    menu.push({ key: 'mesaj', label: 'Mesajlarım' });
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-start">
        <div className="col-md-3 mb-4 mb-md-0">
          <div className="list-group sticky-top">
            {menu.map((item) => (
              <button
                key={item.key}
                className={`list-group-item list-group-item-action profile-tab-btn ${selectedTab === item.key ? 'selected-profile-tab' : ''}`}
                style={{ borderRadius: 10, marginBottom: 8, fontSize: 17, border: 'none', background: '#fff', color: '#222' }}
                onClick={() => setSelectedTab(item.key)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="col-md-8">
          <div className="d-flex justify-content-center">
            <div style={{ minWidth: '100%', maxWidth: 600 }}>
              {selectedTab === 'profil' && (
                <div className="card bg-white text-dark shadow mb-4">
                  <div className="card-body">
                    <h2 className="mb-4 text-center">Profilim</h2>
                    {success && <div className="alert alert-success">{success}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleUpdate}>
                      <div className="mb-3">
                        <label className="form-label">Ad Soyad</label>
                        <input
                          type="text"
                          className="form-control bg-white text-dark"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          disabled={!edit}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">E-posta</label>
                        <input
                          type="email"
                          className="form-control bg-white text-dark"
                          name="email"
                          value={form.email}
                          disabled
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Telefon</label>
                        <input
                          type="tel"
                          className="form-control bg-white text-dark"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          pattern="05[0-9]{9}"
                          maxLength={11}
                          placeholder="05XXXXXXXXX"
                          inputMode="tel"
                          disabled={!edit}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Adres</label>
                        <textarea
                          className="form-control bg-white text-dark"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          disabled={!edit}
                        />
                      </div>
                      <button type="button" className="btn btn-outline-primary w-100 mb-2" onClick={() => setEdit(true)}>Bilgileri Güncelle</button>
                      <button type="submit" className="btn btn-primary w-100">Bilgileri Kaydet</button>
                    </form>
                  </div>
                </div>
              )}
              {selectedTab === 'sifre' && (
                <div className="card bg-white text-dark shadow mb-4">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">Şifre Değiştir</h5>
                    <ChangePasswordForm />
                  </div>
                </div>
              )}
              {selectedTab === 'siparis' && session?.user?.role !== 'ADMIN' && <OrdersSection />}
              {selectedTab === 'favori' && session?.user?.role !== 'ADMIN' && <FavorilerSection />}
              {selectedTab === 'mesaj' && session?.user?.role !== 'ADMIN' && <MessagesSection userId={session?.user?.id} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Şifre değiştirme formu bileşeni
function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (password: string) => {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!currentPassword) {
      setError('Mevcut şifre zorunludur.');
      return;
    }
    if (newPassword !== newPassword2) {
      setError('Yeni şifreler eşleşmiyor.');
      return;
    }
    if (!validatePassword(newPassword)) {
      setError('Yeni şifre en az 8 karakter, harf ve rakam içermelidir.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/kullanici/profil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) throw new Error('Şifre güncellenemedi.');
      setSuccess('Şifreniz başarıyla güncellendi!');
      setCurrentPassword('');
      setNewPassword('');
      setNewPassword2('');
    } catch (err) {
      setError('Şifre güncellenemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="alert alert-info small">
        Şifre kuralları: En az 8 karakter, harf ve rakam içermelidir.
      </div>
      <div className="mb-3">
        <label className="form-label">Mevcut Şifre</label>
        <input
          type="password"
          className="form-control bg-white text-dark"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Yeni Şifre</label>
        <input
          type="password"
          className="form-control bg-white text-dark"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Yeni Şifre (Tekrar)</label>
        <input
          type="password"
          className="form-control bg-white text-dark"
          value={newPassword2}
          onChange={e => setNewPassword2(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
      </button>
    </form>
  );
}

// Siparişlerim bölümü
function OrdersSection() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/siparisler');
        if (!res.ok) throw new Error('Siparişler alınamadı');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError('Siparişler alınamadı.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center my-4"><div className="spinner-border text-primary" role="status"></div></div>;
  }
  if (error) {
    return <div className="alert alert-danger my-4">{error}</div>;
  }
  if (!orders.length) {
    return <div className="alert alert-info my-4">Henüz siparişiniz yok.</div>;
  }
  return (
    <div className="card bg-white text-dark shadow mt-4">
      <div className="card-body">
        <h5 className="fw-bold mb-3"><FaShoppingCart className="me-2 text-primary" />Siparişlerim</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Sipariş No</th>
                <th>Tarih</th>
                <th>Tutar</th>
                <th>Durum</th>
                <th>Ürünler</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id.slice(-8)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('tr-TR', {year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'})}</td>
                  <td>{order.totalAmount.toLocaleString('tr-TR', {style:'currency', currency:'TRY'})}</td>
                  <td>{order.status === 'PENDING' ? 'Beklemede' : order.status === 'PROCESSING' ? 'İşleniyor' : order.status === 'SHIPPED' ? 'Kargoda' : order.status === 'DELIVERED' ? 'Teslim Edildi' : 'İptal Edildi'}</td>
                  <td>
                    {order.items.map((item:any) => (
                      <span key={item.id} className="badge bg-secondary me-1">{item.product.name} ({item.quantity}x)</span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Mesajlarım bölümü
function MessagesSection({ userId }: { userId: string }) {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!userId) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/mesajlar?userId=${userId}`);
        if (!res.ok) throw new Error('Mesajlar alınamadı');
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError('Mesajlar alınamadı.');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [userId]);

  if (loading) {
    return <div className="text-center my-4"><div className="spinner-border text-primary" role="status"></div></div>;
  }
  if (error) {
    return <div className="alert alert-danger my-4">{error}</div>;
  }
  if (!messages.length) {
    return <div className="alert alert-info my-4">Henüz mesajınız yok.</div>;
  }
  return (
    <div className="card bg-white text-dark shadow mt-4">
      <div className="card-body">
        <h5 className="fw-bold mb-3"><FaEnvelope className="me-2 text-primary" />Mesajlarım</h5>
        <ul className="list-group">
          {messages.map((msg) => {
            let content;
            try { content = JSON.parse(msg.content); } catch { content = { message: msg.content }; }
            const isReply = content.type === 'reply';
            return (
              <li key={msg.id} className={`list-group-item ${isReply ? 'bg-light' : ''} mb-2`}>
                {isReply ? (
                  <span className="badge bg-success me-2"><FaEnvelopeOpen className="me-1" />Admin Yanıtı</span>
                ) : (
                  <span className="badge bg-secondary me-2">Gönderdiğiniz Mesaj</span>
                )}
                <span>{content.message}</span>
                <span className="float-end text-muted small ms-2">{new Date(msg.createdAt).toLocaleString('tr-TR')}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// Favorilerim bölümü
function FavorilerSection() {
  const [favoriler, setFavoriler] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [removingId, setRemovingId] = React.useState<string | null>(null);

  const fetchFavoriler = async () => {
    try {
      const res = await fetch('/api/favoriler');
      if (!res.ok) throw new Error('Favoriler alınamadı');
      const data = await res.json();
      setFavoriler(data);
    } catch (err) {
      setError('Favoriler alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFavoriler();
  }, []);

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      const res = await fetch('/api/favoriler', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error('Favoriden çıkarılamadı');
      setFavoriler(favoriler.filter(fav => fav.id !== productId));
    } catch (err) {
      setError('Favoriden çıkarılamadı.');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return <div className="text-center my-4"><div className="spinner-border text-primary" role="status"></div></div>;
  }
  if (error) {
    return <div className="alert alert-danger my-4">{error}</div>;
  }
  if (!favoriler.length) {
    return <div className="alert alert-info my-4">Henüz favori ürününüz yok.</div>;
  }
  return (
    <div className="row g-4 mt-2">
      {favoriler.map((urun) => (
        <div key={urun.id} className="col-12 col-sm-6 col-md-4">
          <div className="card shadow-sm bg-white border-0 h-100 d-flex flex-column justify-content-between" style={{ borderRadius: 20 }}>
            <div className="d-flex justify-content-center align-items-center position-relative" style={{ height: 180, background: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}>
              <img src={urun.image} alt={urun.name} style={{ maxHeight: 140, maxWidth: '100%', objectFit: 'contain', borderRadius: 12 }} />
            </div>
            <div className="card-body text-center p-3 d-flex flex-column justify-content-between">
              <h5 className="card-title fw-bold mb-2" style={{ color: '#222', fontSize: 20 }}>{urun.name}</h5>
              <div className="mb-2 fw-bold" style={{ fontSize: 18, color: '#222' }}>{urun.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
              <Link href={`/urunler/${urun.id}`} className="btn btn-primary w-100 fw-bold py-2 mb-2" style={{ borderRadius: 14 }}>
                Ürünü İncele
              </Link>
              <button className="btn btn-outline-danger w-100 fw-bold py-2" style={{ borderRadius: 14 }} onClick={() => handleRemove(urun.id)} disabled={removingId === urun.id}>
                {removingId === urun.id ? 'Çıkarılıyor...' : 'Favoriden Çıkar'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Profil tabı için özel stil
<style jsx global>{`
.selected-profile-tab {
  background: #fff !important;
  color: #222 !important;
  border: 2px solid #007bff !important;
  font-weight: bold;
}
.profile-tab-btn {
  background: #fff !important;
  color: #222 !important;
  font-weight: bold;
  border: none;
}
`}</style> 