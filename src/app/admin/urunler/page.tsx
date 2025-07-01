'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaTrash, FaEdit, FaImage, FaArrowLeft, FaBox } from 'react-icons/fa';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: {
    id: string;
    name: string;
  };
}

export const dynamic = "force-dynamic";

export default function AdminProductPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    categoryId: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/urunler');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Ürünler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/kategoriler');
      const data = await res.json();
      // Sadece güncel kategoriler: guller, saksı, orkideler, buketler, cicekler
      const allowed = ['guller', 'saksi', 'orkideler', 'buketler', 'cicekler'];
      setCategories(data.filter((cat: Category) => allowed.includes(cat.id)));
    } catch (err) {
      setError('Kategoriler yüklenemedi.');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/urunler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Ürün eklenemedi.');
      }
      setSuccess('Ürün başarıyla eklendi.');
      setNewProduct({ name: '', description: '', price: '', stock: '', image: '', categoryId: '' });
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/urunler/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        let errorMsg = data.message || 'Ürün silinemedi.';
        if (data.error) errorMsg += '\nDetay: ' + data.error;
        throw new Error(errorMsg);
      }
      setSuccess('Ürün başarıyla silindi.');
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
      alert('Silme hatası: ' + err.message);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedFileName(file.name);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setNewProduct((prev) => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      setError('Görsel yüklenemedi.');
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <Link href="/admin" className="btn btn-outline-secondary">
            <FaArrowLeft className="me-2" />
            Geri
          </Link>
          <div>
            <h1 className="h3 mb-0 text-dark fw-bold">
              <FaBox className="me-2 text-primary" />
              Ürün Yönetimi
            </h1>
            <p className="text-muted mb-0">Ürünleri ekleyin, düzenleyin ve yönetin</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-primary fs-6">
            Toplam: {products.length} Ürün
          </span>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {/* Ürün Ekleme Formu */}
      <div className="card mb-4 bg-white border-0 shadow-sm">
        <div className="card-body">
          <form onSubmit={handleAddProduct} className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Ürün Adı</label>
              <input type="text" className="form-control bg-white text-dark" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Kategori</label>
              <select className="form-select" required value={newProduct.categoryId} onChange={e => setNewProduct({ ...newProduct, categoryId: e.target.value })}>
                <option value="">Seçiniz</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Fiyat</label>
              <input type="text" className="form-control bg-white text-dark" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Stok</label>
              <input type="text" className="form-control bg-white text-dark" required value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Açıklama</label>
              <input type="text" className="form-control bg-white text-dark" required value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Görsel (yol)</label>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <button type="button" className="btn btn-outline-primary" onClick={() => fileInputRef.current?.click()}>
                  Görsel Yükle
                </button>
                {selectedFileName && (
                  <span className="small text-secondary" style={{maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block'}}>{selectedFileName}</span>
                )}
              </div>
              {newProduct.image && (
                <div className="mt-2 small text-success">Yüklendi: {newProduct.image}</div>
              )}
            </div>
            <div className="col-md-1 d-grid">
              <button type="submit" className="btn btn-success">Ekle</button>
            </div>
          </form>
        </div>
      </div>
      {/* Ürün Listesi */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Görsel</th>
              <th>Adı</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th>Açıklama</th>
              <th>Sil</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td><img src={product.image} alt={product.name} style={{width: 60, height: 60, objectFit: 'contain'}} /></td>
                <td>{product.name}</td>
                <td>{product.category?.name}</td>
                <td>{product.price} TL</td>
                <td>{product.stock}</td>
                <td>{product.description}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(product.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 