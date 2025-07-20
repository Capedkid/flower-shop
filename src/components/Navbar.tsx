import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CartContext } from './Providers';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cartCount } = React.useContext(CartContext);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image 
            src="/logo.png" 
            alt="Çiçekçi Logo" 
            width={90} 
            height={90} 
            style={{ objectFit: 'contain' }}
          />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/urunler" className="nav-link">Ürünler</Link>
            </li>
            <li className="nav-item">
              <Link href="/iletisim" className="nav-link">İletişim</Link>
            </li>
            <li className="nav-item">
              <Link href="/hakkimizda" className="nav-link">Hakkımızda</Link>
            </li>
          </ul>
          <div className="d-flex gap-2 align-items-center">
            {session && session.user ? (
              <>
                <span className="fw-semibold me-2">{session.user.name}</span>
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin" className="btn btn-outline-warning d-flex align-items-center">
                    <FaUser className="me-1" /> Admin
                  </Link>
                )}
                <Link href="/profil" className="btn btn-outline-primary d-flex align-items-center">
                  <FaUser className="me-1" /> Profil
                </Link>
                <button onClick={handleSignOut} className="btn btn-outline-danger d-flex align-items-center">
                  <FaSignOutAlt className="me-1" /> Çıkış
                </button>
              </>
            ) : (
              <>
                <Link href="/giris" className="btn btn-outline-primary">Giriş</Link>
                <Link href="/kayit" className="btn btn-primary">Kayıt Ol</Link>
              </>
            )}
            <Link 
              href={session ? "/sepet" : "/giris?callbackUrl=/sepet"} 
              className="btn btn-outline-dark position-relative"
            >
              <FaShoppingCart className="me-1" /> Sepet
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{cartCount}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 