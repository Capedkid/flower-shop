'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaBox, 
  FaExclamationTriangle, 
  FaEdit, 
  FaPlus, 
  FaMinus,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaChartBar,
  FaEye,
  FaTrash,
  FaSave,
  FaTimes
} from 'react-icons/fa';

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

export default function AdminStockPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStock, setFilterStock] = useState('ALL');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number>(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN') {
        router.push('/');
      } else {
        fetchProducts();
      }
    }
  }, [status, session, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/urunler');
      if (!response.ok) {
        throw new Error('Ürünler yüklenemedi');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError('Ürünler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId: string, newStockValue: number) => {
    try {
      const response = await fetch(`/api/admin/stok/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStockValue }),
      });

      if (response.ok) {
        setSuccess('Stok başarıyla güncellendi.');
        fetchProducts();
        setEditingProduct(null);
        setNewStock(0);
      } else {
        throw new Error('Stok güncellenirken hata oluştu');
      }
    } catch (error) {
      setError('Stok güncellenirken bir hata oluştu.');
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <span className="badge bg-danger">Stok Yok</span>;
    } else if (stock < 10) {
      return <span className="badge bg-warning">Düşük Stok</span>;
    } else if (stock < 50) {
      return <span className="badge bg-info">Orta Stok</span>;
    } else {
      return <span className="badge bg-success">Yeterli Stok</span>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStock = true;
    if (filterStock === 'LOW') {
      matchesStock = product.stock < 10;
    } else if (filterStock === 'OUT') {
      matchesStock = product.stock === 0;
    } else if (filterStock === 'SUFFICIENT') {
      matchesStock = product.stock >= 10;
    }
    
    return matchesSearch && matchesStock;
  });

  const lowStockCount = products.filter(p => p.stock < 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalProducts = products.length;

  if (status === 'loading' || loading) {
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
              Stok Yönetimi
            </h1>
            <p className="text-muted mb-0">Ürün stoklarını yönetin ve takip edin</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-danger fs-6">
            Düşük Stok: {lowStockCount}
          </span>
          <span className="badge bg-warning fs-6">
            Stok Yok: {outOfStockCount}
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {/* İstatistik Kartları */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Toplam Ürün</h6>
                  <h2 className="mb-0 fw-bold">{totalProducts}</h2>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3">
                  <FaBox size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Düşük Stok</h6>
                  <h2 className="mb-0 fw-bold">{lowStockCount}</h2>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3">
                  <FaExclamationTriangle size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Stok Yok</h6>
                  <h2 className="mb-0 fw-bold">{outOfStockCount}</h2>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3">
                  <FaTimes size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Yeterli Stok</h6>
                  <h2 className="mb-0 fw-bold">{totalProducts - lowStockCount}</h2>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3">
                  <FaChartBar size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control bg-dark text-white admin-stock-search-input"
                  placeholder="Ürün adı veya kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
              >
                <option value="ALL">Tüm Stok Durumları</option>
                <option value="LOW">Düşük Stok (&lt;10)</option>
                <option value="OUT">Stok Yok (0)</option>
                <option value="SUFFICIENT">Yeterli Stok (≥10)</option>
              </select>
            </div>
            <div className="col-md-3">
              <Link href="/admin/urunler" className="btn btn-primary w-100">
                <FaPlus className="me-2" />
                Yeni Ürün Ekle
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0 fw-bold text-dark">Stok Listesi</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="border-0">Ürün</th>
                  <th className="border-0">Kategori</th>
                  <th className="border-0">Fiyat</th>
                  <th className="border-0">Stok</th>
                  <th className="border-0">Durum</th>
                  <th className="border-0">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: 50, height: 50, objectFit: 'cover' }}
                          className="rounded"
                        />
                        <div>
                          <div className="fw-bold">{product.name}</div>
                          <small className="text-muted">{product.description}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{product.category.name}</span>
                    </td>
                    <td className="fw-bold text-success">
                      {formatCurrency(product.price)}
                    </td>
                    <td>
                      {editingProduct === product.id ? (
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            style={{ width: 80 }}
                            value={newStock}
                            onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                            min="0"
                          />
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleStockUpdate(product.id, newStock)}
                          >
                            <FaSave size={12} />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setEditingProduct(null);
                              setNewStock(0);
                            }}
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold">{product.stock}</span>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              setEditingProduct(product.id);
                              setNewStock(product.stock);
                            }}
                          >
                            <FaEdit size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td>{getStockBadge(product.stock)}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-success"
                          onClick={() => handleStockUpdate(product.id, product.stock + 1)}
                          title="Stok Ekle"
                        >
                          <FaPlus size={12} />
                        </button>
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => handleStockUpdate(product.id, Math.max(0, product.stock - 1))}
                          title="Stok Azalt"
                        >
                          <FaMinus size={12} />
                        </button>
                        <Link
                          href={`/admin/urunler/${product.id}`}
                          className="btn btn-outline-info"
                          title="Ürün Detayı"
                        >
                          <FaEye size={12} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Düşük Stok Uyarıları */}
      {lowStockCount > 0 && (
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-header bg-warning text-white border-0">
            <h5 className="mb-0 fw-bold">
              <FaExclamationTriangle className="me-2" />
              Düşük Stok Uyarıları
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {products.filter(p => p.stock < 10).map((product) => (
                <div key={product.id} className="col-md-6 col-lg-4">
                  <div className="card border-warning bg-white text-dark">
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: 60, height: 60, objectFit: 'cover' }}
                          className="rounded"
                        />
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">{product.name}</h6>
                          <span className="badge bg-warning text-dark">Stok: {product.stock}</span>
                        </div>
                      </div>
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => {
                            setEditingProduct(product.id);
                            setNewStock(product.stock);
                          }}
                        >
                          <FaEdit className="me-2" />
                          Stok Güncelle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 