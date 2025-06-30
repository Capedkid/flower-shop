'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaShoppingCart, 
  FaEye, 
  FaEdit, 
  FaTruck, 
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaArrowLeft,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN') {
        router.push('/');
      } else {
        fetchOrders();
      }
    }
  }, [status, session, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/siparisler');
      if (!response.ok) {
        throw new Error('Siparişler yüklenemedi');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setError('Siparişler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/siparisler/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setSuccess('Sipariş durumu başarıyla güncellendi.');
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus as any });
        }
      } else {
        throw new Error('Durum güncellenirken hata oluştu');
      }
    } catch (error) {
      setError('Sipariş durumu güncellenirken bir hata oluştu.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { class: 'bg-warning', text: 'Beklemede', icon: FaClock },
      'PROCESSING': { class: 'bg-info', text: 'İşleniyor', icon: FaEdit },
      'SHIPPED': { class: 'bg-primary', text: 'Kargoda', icon: FaTruck },
      'DELIVERED': { class: 'bg-success', text: 'Teslim Edildi', icon: FaCheckCircle },
      'CANCELLED': { class: 'bg-danger', text: 'İptal Edildi', icon: FaExclamationTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <span className={`badge ${config.class} d-flex align-items-center gap-1`}>
        <Icon size={12} />
        {config.text}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    const matchesSearch = order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
              <FaShoppingCart className="me-2 text-primary" />
              Sipariş Yönetimi
            </h1>
            <p className="text-muted mb-0">Tüm siparişleri yönetin ve takip edin</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-primary fs-6">
            Toplam: {orders.length} Sipariş
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

      {/* Filtreler */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control bg-secondary text-white border-0 admin-search-input"
                  placeholder="Müşteri adı, e-posta veya sipariş ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">Tüm Durumlar</option>
                <option value="PENDING">Beklemede</option>
                <option value="PROCESSING">İşleniyor</option>
                <option value="SHIPPED">Kargoda</option>
                <option value="DELIVERED">Teslim Edildi</option>
                <option value="CANCELLED">İptal Edildi</option>
              </select>
            </div>
            <div className="col-md-5">
              <div className="d-flex gap-2">
                <span className="badge bg-warning">
                  Beklemede: {orders.filter(o => o.status === 'PENDING').length}
                </span>
                <span className="badge bg-info">
                  İşleniyor: {orders.filter(o => o.status === 'PROCESSING').length}
                </span>
                <span className="badge bg-primary">
                  Kargoda: {orders.filter(o => o.status === 'SHIPPED').length}
                </span>
                <span className="badge bg-success">
                  Teslim: {orders.filter(o => o.status === 'DELIVERED').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Sipariş Listesi */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0 fw-bold text-dark">Sipariş Listesi</h5>
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
                      <th className="border-0">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className={selectedOrder?.id === order.id ? 'table-primary' : ''}>
                        <td className="fw-bold">#{order.id.slice(-8)}</td>
                        <td>
                          <div>
                            <div className="fw-bold">{order.user.name}</div>
                            <small className="text-muted">{order.user.email}</small>
                          </div>
                        </td>
                        <td className="fw-bold text-success">{formatCurrency(order.totalAmount)}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>
                          <div>
                            <div>{formatDate(order.createdAt)}</div>
                            <small className="text-muted">{order.items.length} ürün</small>
                          </div>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => setSelectedOrder(order)}
                              title="Detayları Gör"
                            >
                              <FaEye size={12} />
                            </button>
                            <select
                              className="form-select form-select-sm"
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              style={{ width: 'auto' }}
                            >
                              <option value="PENDING">Beklemede</option>
                              <option value="PROCESSING">İşleniyor</option>
                              <option value="SHIPPED">Kargoda</option>
                              <option value="DELIVERED">Teslim Edildi</option>
                              <option value="CANCELLED">İptal Edildi</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sipariş Detayları */}
        <div className="col-lg-4">
          {selectedOrder ? (
            <div className="card border-0 shadow-sm bg-dark text-white">
              <div className="card-header bg-dark border-0">
                <h5 className="mb-0 fw-bold text-white">
                  Sipariş Detayları
                  <button
                    className="btn btn-sm btn-outline-light float-end"
                    onClick={() => setSelectedOrder(null)}
                  >
                    ×
                  </button>
                </h5>
              </div>
              <div className="card-body">
                {/* Müşteri Bilgileri */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3 text-white">
                    <FaUser className="me-2 text-primary" />
                    Müşteri Bilgileri
                  </h6>
                  <div className="bg-secondary bg-opacity-25 p-3 rounded">
                    <div className="mb-2">
                      <strong>Ad Soyad:</strong> <span className="text-white">{selectedOrder.user.name}</span>
                    </div>
                    <div className="mb-2">
                      <strong>E-posta:</strong> <span className="text-white">{selectedOrder.user.email}</span>
                    </div>
                    <div className="mb-2">
                      <strong>Sipariş Tarihi:</strong> <span className="text-white">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div>
                      <strong>Son Güncelleme:</strong> <span className="text-white">{formatDate(selectedOrder.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Ürün Listesi */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3 text-white">
                    <FaShoppingCart className="me-2 text-primary" />
                    Ürünler
                  </h6>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="d-flex align-items-center gap-3 bg-secondary bg-opacity-25 p-2 rounded">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{ width: 50, height: 50, objectFit: 'cover' }}
                          className="rounded"
                        />
                        <div className="flex-grow-1">
                          <div className="fw-bold text-white">{item.product.name}</div>
                          <div className="text-white-50">
                            {item.quantity} adet × {formatCurrency(item.product.price)}
                          </div>
                        </div>
                        <div className="fw-bold text-success">
                          {formatCurrency(item.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toplam */}
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-white">Toplam</h5>
                    <h4 className="mb-0 text-success fw-bold">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </h4>
                  </div>
                </div>

                {/* Durum Güncelleme */}
                <div className="mt-4">
                  <h6 className="fw-bold mb-3">Durum Güncelle</h6>
                  <select
                    className="form-select mb-3"
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                  >
                    <option value="PENDING">Beklemede</option>
                    <option value="PROCESSING">İşleniyor</option>
                    <option value="SHIPPED">Kargoda</option>
                    <option value="DELIVERED">Teslim Edildi</option>
                    <option value="CANCELLED">İptal Edildi</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <FaEye size={48} className="text-muted mb-3" />
                <h6 className="text-muted">Sipariş detaylarını görmek için bir sipariş seçin</h6>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 