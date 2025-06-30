"use client";
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';

export default function NavbarWrapper() {
  const pathname = usePathname();
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/giris') ||
    pathname.startsWith('/kayit')
  ) return null;
  return <Navbar />;
} 