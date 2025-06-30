'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaMoneyBillWave, 
  FaChartLine, 
  FaChartBar, 
  FaCalendarAlt,
  FaArrowLeft,
  FaDownload,
  FaFilter,
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaShoppingCart,
  FaUsers,
  FaBox
} from 'react-icons/fa';

interface FinancialData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  monthlyRevenue: number[];
  dailyRevenue: number[];
  topProducts: Array<{
    id: string;
    name: string;
    revenue: number;
    quantity: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
  recentTransactions: Array<{
    id: string;
    customerName: string;
    amount: number;
    date: string;
    status: string;
  }>;
}

export default function AdminFinancialPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    monthlyRevenue: [],
    dailyRevenue: [],
    topProducts: [],
    revenueByCategory: [],
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30'); // 7, 30, 90, 365

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN') {
        router.push('/');
      } else {
        fetchFinancialData();
      }
    }
  }, [status, session, router, dateRange]);

  const fetchFinancialData = async () => {
    try {
      const response = await fetch(`/api/admin/finansal?range=${dateRange}`);
      if (!response.ok) {
        throw new Error('Finansal veriler yüklenemedi');
      }
      const data = await response.json();
      setFinancialData(data);
    } catch (error) {
      setError('Finansal veriler yüklenirken bir hata oluştu.');
      // Mock data for demonstration
      setFinancialData({
        totalRevenue: 45678.50,
        totalOrders: 89,
        averageOrderValue: 513.24,
        monthlyRevenue: [12000, 15000, 18000, 22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000, 45678],
        dailyRevenue: [1200, 1350, 1100, 1400, 1600, 1800, 2000, 1900, 2100, 2300, 2400, 2500, 2600, 2700, 2800],
        topProducts: [
          { id: '1', name: 'Kırmızı Gül Buketi', revenue: 8500, quantity: 34 },
          { id: '2', name: 'Orkide Saksı', revenue: 7200, quantity: 18 },
          { id: '3', name: 'Papatya Buketi', revenue: 6800, quantity: 45 },
          { id: '4', name: 'Karışık Çiçek Sepeti', revenue: 6200, quantity: 28 }
        ],
        revenueByCategory: [
          { category: 'Buketler', revenue: 25000, percentage: 55 },
          { category: 'Saksı Çiçekleri', revenue: 15000, percentage: 33 },
          { category: 'Çelenkler', revenue: 5678, percentage: 12 }
        ],
        recentTransactions: [
          { id: '1', customerName: 'Ahmet Yılmaz', amount: 1250, date: '2024-01-15', status: 'COMPLETED' },
          { id: '2', customerName: 'Fatma Demir', amount: 890, date: '2024-01-15', status: 'COMPLETED' },
          { id: '3', customerName: 'Mehmet Kaya', amount: 2100, date: '2024-01-14', status: 'COMPLETED' },
          { id: '4', customerName: 'Ayşe Özkan', amount: 750, date: '2024-01-14', status: 'PENDING' }
        ]
      });
    } finally {
      setLoading(false);
    }
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

  const getGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const exportReport = () => {
    // CSV export functionality
    const csvContent = `data:text/csv;charset=utf-8,${financialData.recentTransactions.map(t => 
      `${t.id},${t.customerName},${t.amount},${t.date},${t.status}`
    ).join('\n')}`;
    
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `finansal-rapor-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
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
          <Link href="/admin" className="btn btn-outline-secondary">
            <FaArrowLeft className="me-2" />
            Geri
          </Link>
          <div>
            <h1 className="h3 mb-0 text-dark fw-bold">
              <FaMoneyBillWave className="me-2 text-primary" />
              Finansal Raporlar
            </h1>
            <p className="text-muted mb-0">Satış ve gelir analizleri</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={exportReport}>
            <FaDownload className="me-2" />
            Rapor İndir
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Tarih Filtresi */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <label className="form-label fw-bold">Rapor Periyodu</label>
              <select
                className="form-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7">Son 7 Gün</option>
                <option value="30">Son 30 Gün</option>
                <option value="90">Son 90 Gün</option>
                <option value="365">Son 1 Yıl</option>
              </select>
            </div>
            <div className="col-md-6">
              <div className="d-flex gap-2 justify-content-end">
                <span className="badge bg-primary fs-6">
                  Toplam Gelir: {formatCurrency(financialData.totalRevenue)}
                </span>
                <span className="badge bg-success fs-6">
                  Toplam Sipariş: {financialData.totalOrders}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İstatistikler */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card bg-primary text-white border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Toplam Gelir</h6>
                  <h2 className="mb-0 fw-bold">{formatCurrency(financialData.totalRevenue)}</h2>
                  <small className="text-white-75">
                    <FaArrowUp className="me-1" />
                    +12.5% geçen aya göre
                  </small>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3">
                  <FaMoneyBillWave size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card bg-success text-white border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Toplam Sipariş</h6>
                  <h2 className="mb-0 fw-bold">{financialData.totalOrders}</h2>
                  <small className="text-white-75">
                    <FaArrowUp className="me-1" />
                    +8.3% geçen aya göre
                  </small>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3">
                  <FaShoppingCart size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card bg-info text-white border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Ortalama Sipariş</h6>
                  <h2 className="mb-0 fw-bold">{formatCurrency(financialData.averageOrderValue)}</h2>
                  <small className="text-white-75">
                    <FaArrowUp className="me-1" />
                    +4.2% geçen aya göre
                  </small>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3">
                  <FaChartBar size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card bg-warning text-white border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-white-50 mb-1">Aktif Müşteri</h6>
                  <h2 className="mb-0 fw-bold">1,247</h2>
                  <small className="text-white-75">
                    <FaArrowUp className="me-1" />
                    +15.7% geçen aya göre
                  </small>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3">
                  <FaUsers size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Gelir Grafiği */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0 fw-bold text-dark">
                <FaChartLine className="me-2 text-primary" />
                Gelir Trendi
              </h5>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px' }}>
                <div className="d-flex align-items-end justify-content-between h-100">
                  {financialData.dailyRevenue.map((revenue, index) => (
                    <div key={index} className="d-flex flex-column align-items-center">
                      <div 
                        className="bg-primary rounded"
                        style={{ 
                          width: '20px', 
                          height: `${(revenue / Math.max(...financialData.dailyRevenue)) * 200}px`,
                          minHeight: '10px'
                        }}
                      ></div>
                      <small className="text-muted mt-1">{index + 1}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kategori Dağılımı */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0 fw-bold text-dark">
                <FaChartBar className="me-2 text-primary" />
                Kategori Dağılımı
              </h5>
            </div>
            <div className="card-body">
              {financialData.revenueByCategory.map((category, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold">{category.category}</span>
                    <span className="text-success fw-bold">{formatCurrency(category.revenue)}</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-primary" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <small className="text-muted">{category.percentage}%</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-4">
        {/* En Çok Satan Ürünler */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0 fw-bold text-dark">
                <FaBox className="me-2 text-primary" />
                En Çok Satan Ürünler
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0">Ürün</th>
                      <th className="border-0">Satış</th>
                      <th className="border-0">Gelir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.topProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="fw-bold">{product.name}</td>
                        <td>
                          <span className="badge bg-info">{product.quantity} adet</span>
                        </td>
                        <td className="fw-bold text-success">
                          {formatCurrency(product.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Son İşlemler */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0 fw-bold text-dark">
                <FaEye className="me-2 text-primary" />
                Son İşlemler
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0">Müşteri</th>
                      <th className="border-0">Tutar</th>
                      <th className="border-0">Tarih</th>
                      <th className="border-0">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="fw-bold">{transaction.customerName}</td>
                        <td className="fw-bold text-success">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td>{formatDate(transaction.date)}</td>
                        <td>
                          <span className={`badge ${transaction.status === 'COMPLETED' ? 'bg-success' : 'bg-warning'}`}>
                            {transaction.status === 'COMPLETED' ? 'Tamamlandı' : 'Beklemede'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 