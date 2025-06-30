'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaUsers, 
  FaShoppingCart, 
  FaBox, 
  FaMoneyBillWave,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTruck,
  FaUserPlus,
  FaShoppingBag,
  FaEnvelope,
  FaArrowLeft,
  FaHome
} from 'react-icons/fa';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: any[];
  lowStockProducts: any[];
  recentUsers: any[];
  monthlyRevenue: number[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
    recentUsers: [],
    monthlyRevenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN') {
        router.push('/');
      } else {
        fetchDashboardData();
      }
    }
  }, [status, session, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        throw new Error('Dashboard verileri yüklenemedi');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
      // Hata durumunda mock veriler göster
      const mockStats: DashboardStats = {
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        recentOrders: [],
        lowStockProducts: [],
        recentUsers: [],
        monthlyRevenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      };
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { class: 'bg-warning', text: 'Beklemede' },
      'PROCESSING': { class: 'bg-info', text: 'İşleniyor' },
      'SHIPPED': { class: 'bg-primary', text: 'Kargoda' },
      'DELIVERED': { class: 'bg-success', text: 'Teslim Edildi' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { class: 'bg-secondary', text: status };
    
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

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
          <Link href="/" className="btn btn-outline-secondary">
            <FaHome className="me-2" />
            Anasayfa
          </Link>
          <div>
            <h1 className="h3 mb-0 text-dark fw-bold">
              <FaChartLine className="me-2 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted mb-0">Hoş geldiniz, {session?.user?.name}</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link href="/admin/urunler" className="btn btn-primary">
            <FaPlus className="me-2" />
            Yeni Ürün Ekle
          </Link>
          <Link href="/admin/kullanicilar" className="btn btn-outline-primary">
            <FaUsers className="me-2" />
            Kullanıcılar
          </Link>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card bg-primary text-white h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Toplam Kullanıcı</h6>
                  <h2 className="mb-0 fw-bold">{stats.totalUsers.toLocaleString('tr-TR')}</h2>
                  <small className="text-white-75">+12% bu ay</small>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3">
                  <FaUsers size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card bg-success text-white h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Toplam Sipariş</h6>
                  <h2 className="mb-0 fw-bold">{stats.totalOrders.toLocaleString('tr-TR')}</h2>
                  <small className="text-white-75">+8% bu ay</small>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3">
                  <FaShoppingCart size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card bg-warning text-white h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Toplam Ürün</h6>
                  <h2 className="mb-0 fw-bold">{stats.totalProducts.toLocaleString('tr-TR')}</h2>
                  <small className="text-white-75">+5% bu ay</small>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3">
                  <FaBox size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card bg-info text-white h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Toplam Gelir</h6>
                  <h2 className="mb-0 fw-bold">{formatCurrency(stats.totalRevenue)}</h2>
                  <small className="text-white-75">+15% bu ay</small>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3">
                  <FaMoneyBillWave size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik Grid */}
      <div className="row g-4">
        {/* Son Siparişler */}
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-dark">
                <FaShoppingBag className="me-2 text-primary" />
                Son Siparişler
              </h5>
              <Link href="/admin/siparisler" className="btn btn-sm btn-outline-primary">
                Tümünü Gör
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0">Sipariş ID</th>
                      <th className="border-0">Müşteri</th>
                      <th className="border-0">Tutar</th>
                      <th className="border-0">Durum</th>
                      <th className="border-0">Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="fw-bold">#{order.id}</td>
                        <td>{order.customerName}</td>
                        <td className="fw-bold text-success">{formatCurrency(order.amount)}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>{formatDate(order.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Sidebar */}
        <div className="col-xl-4">
          <div className="row g-4">
            {/* Düşük Stok Uyarıları */}
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h6 className="mb-0 fw-bold text-dark">
                    <FaExclamationTriangle className="me-2 text-warning" />
                    Düşük Stok Uyarıları
                  </h6>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {stats.lowStockProducts.map((product) => (
                      <div key={product.id} className="list-group-item border-0 d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1 fw-bold">{product.name}</h6>
                          <small className="text-muted">Stok: {product.stock} / {product.minStock}</small>
                        </div>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-warning">
                            <FaEdit size={12} />
                          </button>
                          <button className="btn btn-sm btn-outline-primary">
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Son Kayıt Olan Kullanıcılar */}
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h6 className="mb-0 fw-bold text-dark">
                    <FaUserPlus className="me-2 text-success" />
                    Son Kayıt Olan Kullanıcılar
                  </h6>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {stats.recentUsers.map((user) => (
                      <div key={user.id} className="list-group-item border-0 d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1 fw-bold">{user.name}</h6>
                          <small className="text-muted">{user.email}</small>
                          <br />
                          <small className="text-muted">
                            <FaClock className="me-1" />
                            {formatDate(user.date)}
                          </small>
                        </div>
                        <button className="btn btn-sm btn-outline-primary">
                          <FaEye size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hızlı Erişim */}
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h6 className="mb-0 fw-bold text-dark">
                    <FaChartLine className="me-2 text-info" />
                    Hızlı Erişim
                  </h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <Link href="/admin/urunler" className="btn btn-outline-primary btn-sm">
                      <FaBox className="me-2" />
                      Ürün Yönetimi
                    </Link>
                    <Link href="/admin/kullanicilar" className="btn btn-outline-success btn-sm">
                      <FaUsers className="me-2" />
                      Kullanıcı Yönetimi
                    </Link>
                    <Link href="/admin/siparisler" className="btn btn-outline-warning btn-sm">
                      <FaShoppingCart className="me-2" />
                      Sipariş Yönetimi
                    </Link>
                    <Link href="/admin/mesajlar" className="btn btn-outline-info btn-sm">
                      <FaEnvelope className="me-2" />
                      Mesaj Yönetimi
                    </Link>
                    <Link href="/admin/stok" className="btn btn-outline-secondary btn-sm">
                      <FaBox className="me-2" />
                      Stok Yönetimi
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 