'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export const dynamic = "force-dynamic";

export default function Kayit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [hata, setHata] = useState('');

  // Nereden geldiğini al (callbackUrl parametresi)
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const validatePassword = (password: string) => {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHata('');

    if (!validatePassword(formData.password)) {
      setHata('Şifre en az 8 karakter, harf ve rakam içermelidir.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setHata('Şifreler eşleşmiyor!');
      return;
    }

    try {
      const response = await fetch('/api/kayit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Kayıt işlemi başarısız oldu.');
      }
      // Başarılı kayıt sonrası giriş sayfasına yönlendir
      router.push('/giris?callbackUrl=' + encodeURIComponent(callbackUrl));
    } catch (error) {
      setHata(error instanceof Error ? error.message : 'Bir hata oluştu.');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="card bg-dark text-white shadow" style={{minWidth: 350}}>
        <div className="card-body">
          <h2 className="mb-4 text-center">Kayıt Ol</h2>
          {hata && (
            <div className="alert alert-danger" role="alert">
              {hata}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Ad Soyad</label>
              <input
                type="text"
                className="form-control bg-secondary text-white border-0"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Adınız Soyadınız"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">E-posta</label>
              <input
                type="email"
                className="form-control bg-secondary text-white border-0"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="E-posta adresiniz"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Şifre</label>
              <input
                type="password"
                className="form-control bg-secondary text-white border-0"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Şifreniz"
                required
              />
              <div className="alert alert-info small mt-2 mb-0 py-2 px-3">
                Şifre kuralları: En az 8 karakter, harf ve rakam içermelidir.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="passwordConfirm" className="form-label">Şifre Tekrar</label>
              <input
                type="password"
                className="form-control bg-secondary text-white border-0"
                id="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                placeholder="Şifrenizi tekrar girin"
                required
              />
            </div>
            <button type="submit" className="btn btn-light w-100 mt-3">Kayıt Ol</button>
          </form>
          <div className="text-center mt-3">
            <p className="mb-0">
              Zaten hesabınız var mı?{' '}
              <Link href="/giris" className="text-decoration-none">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 