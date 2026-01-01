"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import React from 'react';
import Image from 'next/image';
import { CartContext } from './Providers';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cartCount } = React.useContext(CartContext);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-botanical fixed-top">
      <div className="container">
        <Link href="/" className="navbar-brand">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image
              src="/logo.png"
              alt="Çiçekçi Logo"
              width={70}
              height={70}
              style={{ objectFit: 'contain' }}
            />
          </motion.div>
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/urunler" className="nav-link nav-link-botanical">Koleksiyonlar</Link>
            </li>
            <li className="nav-item">
              <Link href="/iletisim" className="nav-link nav-link-botanical">Mağaza</Link>
            </li>
            <li className="nav-item">
              <Link href="/hakkimizda" className="nav-link nav-link-botanical">Hikayemiz</Link>
            </li>
          </ul>
          <div className="d-flex gap-4 align-items-center">
            {session && session.user ? (
              <div className="dropdown">
                <button className="btn p-0 border-0 font-outfit small text-uppercase tracking-widest d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                  <span className="fw-semibold">{session.user.name}</span>
                  <FaUser size={14} />
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm rounded-0">
                  {session.user.role === 'ADMIN' && (
                    <li><Link href="/admin" className="dropdown-item small py-2">YÖNETİM PANELİ</Link></li>
                  )}
                  <li><Link href="/profil" className="dropdown-item small py-2">PROFİLİM</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button onClick={handleSignOut} className="dropdown-item small py-2 text-danger">GÜVENLİ ÇIKIŞ</button></li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-3 align-items-center">
                <Link href="/giris" className="text-decoration-none font-outfit small text-uppercase tracking-widest text-dark">Giriş</Link>
                <Link href="/kayit" className="btn btn-botanical btn-botanical-primary py-2 px-3 small" style={{ fontSize: '0.7rem' }}>Kayıt Ol</Link>
              </div>
            )}
            <Link
              href={session ? "/sepet" : "/giris?callbackUrl=/sepet"}
              className="position-relative text-dark text-decoration-none"
            >
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-dark font-outfit" style={{ fontSize: '0.6rem', padding: '0.35em 0.5em' }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .navbar-nav .nav-link-botanical {
          margin: 0 1rem;
        }
        @media (max-width: 991px) {
          .navbar-botanical {
             background: #fff !important;
             padding: 1rem 0;
          }
          .navbar-nav .nav-link-botanical {
            margin: 0.5rem 0;
          }
        }
      `}</style>
    </nav>
  );
} 