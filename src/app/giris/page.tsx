'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const dynamic = "force-dynamic";

export default function Giris() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <GirisInner />
    </Suspense>
  );
}

function GirisInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [hata, setHata] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Nereden geldiğini al (callbackUrl parametresi)
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setHata('E-posta veya şifre yanlış!');
        return;
      }

      // Başarılı giriş sonrası geldiği sayfaya yönlendir
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      setHata('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="card bg-dark text-white shadow" style={{minWidth: 350}}>
        <div className="card-body">
          <h2 className="mb-4 text-center">Giriş Yap</h2>
          
          {hata && (
            <div className="alert alert-danger" role="alert">
              {hata}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control bg-secondary text-white border-0"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Şifreniz"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-light w-100 mt-3">
              Giriş Yap
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="mb-0">
              Hesabınız yok mu?{' '}
              <Link href="/kayit" className="text-decoration-none">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 