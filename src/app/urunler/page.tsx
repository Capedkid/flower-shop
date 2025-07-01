'use client';

import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CartContext } from '@/components/Providers';
import { Suspense } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: {
    id: string;
    name: string;
  };
}

const KATEGORILER = [
  { id: 'tumurunler', name: 'Tüm Ürünler' },
  { id: 'guller', name: 'Güller' },
  { id: 'saksi', name: 'Saksı Çiçekleri' },
  { id: 'orkideler', name: 'Orkideler' },
  { id: 'buketler', name: 'Buketler' },
];

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const kategoriParam = searchParams.get('kategori');
  const [selectedCategory, setSelectedCategory] = useState(kategoriParam || 'tumurunler');
  const { data: session } = useSession();
  const { refreshCart } = useContext(CartContext);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    if (kategoriParam && kategoriParam !== selectedCategory) {
      setSelectedCategory(kategoriParam);
    }
    if (!kategoriParam && selectedCategory !== 'tumurunler') {
      setSelectedCategory('tumurunler');
    }
  }, [kategoriParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/urunler');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Ürünler yüklenirken bir hata oluştu');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'tumurunler') {
      router.push('/urunler');
    } else {
      router.push(`/urunler?kategori=${catId}`);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!session) {
      router.push('/giris?callbackUrl=' + encodeURIComponent('/urunler'));
      return;
    }
    setAddingId(productId);
    try {
      const response = await fetch('/api/sepet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      refreshCart();
      setSuccessId(productId);
      setTimeout(() => setSuccessId(null), 2000);
    } catch (err) {
      // Hata yönetimi eklenebilir
    } finally {
      setAddingId(null);
    }
  };

  const filteredProducts = selectedCategory === 'tumurunler'
    ? products
    : products.filter((product) => product.category.id === selectedCategory);

  return (
    <div className="container mt-5">
      {/* Geri Tuşu */}
      <div className="mb-4">
        <Link href="/" className="btn btn-outline-secondary">
          <FaArrowLeft className="me-2" />
          Anasayfaya Dön
        </Link>
      </div>

      <h2 className="mb-4">Ürünler</h2>

      {/* Kategori Sekmeleri */}
      <div className="mb-4 d-flex gap-2 flex-wrap">
        {KATEGORILER.map((cat) => (
          <button
            key={cat.id}
            className={`btn fw-bold ${selectedCategory === cat.id ? 'btn-warning' : 'btn-outline-warning'}`}
            style={{ minWidth: 140, borderRadius: 20 }}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="alert alert-info">Bu kategoride ürün bulunamadı.</div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-3">
              <div
                className="card shadow-sm bg-white border-0 h-100 d-flex flex-column justify-content-between"
                style={{ border: '2px solid #FFD700', borderRadius: 20, boxShadow: '0 4px 24px 0 rgba(255,215,0,0.08)' }}
              >
                <div
                  className="d-flex justify-content-center align-items-center position-relative"
                  style={{ height: 220, background: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      maxHeight: 180,
                      maxWidth: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.25s cubic-bezier(.4,2,.6,1)',
                      borderRadius: 12,
                    }}
                    onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
                <div className="card-body text-center p-3 d-flex flex-column justify-content-between">
                  <h5 className="card-title fw-bold mb-2" style={{ color: '#222', fontSize: 22, letterSpacing: 0.2 }}>{product.name}</h5>
                  <div className="mb-1" style={{ color: '#e1006a', fontWeight: 600, fontSize: 15 }}>Hergün Aynı Gün Teslimat</div>
                  <div className="mb-3 fw-bold" style={{ fontSize: 24, color: '#222', letterSpacing: 0.5 }}>
                    {product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </div>
                  <Link
                    href={`/urunler/${product.id}`}
                    className="btn btn-warning w-100 fw-bold py-2"
                    style={{ borderRadius: 14, fontSize: 17, letterSpacing: 0.5, boxShadow: '0 2px 8px 0 rgba(255,215,0,0.10)' }}
                  >
                    ÜRÜNÜ İNCELE
                  </Link>
                  <button
                    className="btn btn-outline-warning w-100 fw-bold py-2 mt-2"
                    style={{ borderRadius: 14, fontSize: 17, letterSpacing: 0.5, boxShadow: '0 2px 8px 0 rgba(255,215,0,0.10)' }}
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addingId === product.id}
                  >
                    {addingId === product.id ? 'Sepete Ekleniyor...' : 'Sepete Ekle'}
                  </button>
                  {successId === product.id && (
                    <div className="alert alert-success py-1 mt-2 mb-0" style={{ fontSize: 14, borderRadius: 10 }}>
                      Ürün sepete eklendi!
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 