'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaShoppingCart, 
  FaHeart, 
  FaStar, 
  FaTruck, 
  FaCheckCircle, 
  FaLeaf, 
  FaBox,
  FaMinus,
  FaPlus,
  FaEye,
  FaShare,
  FaPhone,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';
import { CartContext } from '@/components/Providers';

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

export default function ProductPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { refreshCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/urunler/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError('An error occurred while fetching product details');
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [params.id]);

  const addToCart = async () => {
    if (!session) {
      router.push('/giris?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setAddingToCart(true);
    try {
      const response = await fetch('/api/sepet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: params.id,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      setShowSuccess(true);
      refreshCart();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('An error occurred while adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment && quantity < product!.stock) {
      setQuantity(quantity + 1);
    } else if (!increment && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Stok Yok', class: 'text-danger', icon: FaBox };
    if (stock < 10) return { text: 'Son ' + stock + ' Adet', class: 'text-warning', icon: FaClock };
    return { text: 'Stokta Mevcut', class: 'text-success', icon: FaCheckCircle };
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-3 text-muted">Ürün bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Ürün bulunamadı
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const StockIcon = stockStatus.icon;

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="container-fluid py-3 bg-white shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <Link href="/urunler" className="btn btn-outline-secondary">
            <FaArrowLeft className="me-2" />
            Ürünlere Dön
          </Link>
          <div>
            <h1 className="h4 mb-0 text-dark fw-bold">
              <FaLeaf className="me-2 text-primary" />
              Ürün Detayı
            </h1>
            <p className="text-muted mb-0">{product.category.name}</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="position-fixed top-0 start-50 translate-middle-x p-3" style={{zIndex: 1050}}>
          <div className="alert alert-success alert-dismissible fade show shadow" role="alert">
            <FaCheckCircle className="me-2" />
            Ürün sepete eklendi!
            <button type="button" className="btn-close" onClick={() => setShowSuccess(false)}></button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-5">
          {/* Product Image */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm overflow-hidden" style={{borderRadius: '20px'}}>
              <div className="position-relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-100 bg-white"
                  style={{ 
                    objectFit: 'contain', 
                    height: '500px',
                    background: '#fff',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div className="position-absolute top-0 end-0 p-3">
                  <button 
                    className={`btn btn-light rounded-circle shadow-sm ${isWishlisted ? 'text-danger' : 'text-muted'}`}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    style={{width: '45px', height: '45px'}}
                  >
                    <FaHeart />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100" style={{borderRadius: '20px'}}>
              <div className="card-body p-4">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                    <FaLeaf className="me-1" />
                    {product.category.name}
                  </span>
                </div>

                {/* Product Title */}
                <h1 className="h2 fw-bold text-white mb-3">{product.name}</h1>

                {/* Rating */}
                <div className="d-flex align-items-center mb-3">
                  <div className="d-flex text-warning me-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={16} />
                    ))}
                  </div>
                  <span className="text-muted">(4.8 - 127 değerlendirme)</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <h2 className="h1 fw-bold text-primary mb-0">
                    {formatCurrency(product.price)}
                  </h2>
                  <small className="text-muted">KDV Dahil</small>
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  <div className={`d-flex align-items-center ${stockStatus.class}`}>
                    <StockIcon className="me-2" />
                    <span className="fw-bold">{stockStatus.text}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h5 className="fw-bold text-white mb-2">Ürün Açıklaması</h5>
                  <p className="text-light mb-0" style={{lineHeight: '1.6'}}>
                    {product.description}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-white">Adet</label>
                  <div className="d-flex align-items-center gap-3">
                    <div className="input-group" style={{width: '150px'}}>
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={() => handleQuantityChange(false)}
                        disabled={quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <input
                        type="number"
                        className="form-control text-center border-start-0 border-end-0"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                        min="1"
                        max={product.stock}
                        style={{borderLeft: 'none', borderRight: 'none'}}
                      />
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={() => handleQuantityChange(true)}
                        disabled={quantity >= product.stock}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <small className="text-light">
                      Stok: {product.stock} adet
                    </small>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-3 mb-4">
                  <button
                    className={`btn btn-primary btn-lg fw-bold ${addingToCart ? 'disabled' : ''}`}
                    onClick={addToCart}
                    disabled={product.stock === 0 || addingToCart}
                    style={{borderRadius: '12px', height: '55px'}}
                  >
                    {addingToCart ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sepete Ekleniyor...
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className="me-2" />
                        {product.stock === 0 ? 'Stok Yok' : 'Sepete Ekle'}
                      </>
                    )}
                  </button>
                </div>

                {/* Features */}
                <div className="border-top border-secondary pt-4">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="d-flex align-items-center text-success">
                        <FaTruck className="me-2" />
                        <small className="fw-bold text-light">Ücretsiz Teslimat</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center text-info">
                        <FaCheckCircle className="me-2" />
                        <small className="fw-bold text-light">Kalite Garantisi</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center text-warning">
                        <FaClock className="me-2" />
                        <small className="fw-bold text-light">Aynı Gün Teslimat</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center text-primary">
                        <FaPhone className="me-2" />
                        <small className="fw-bold text-light">7/24 Destek</small>
                      </div>
                    </div>
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