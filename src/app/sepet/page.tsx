'use client';

import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaShoppingCart, 
  FaTrash, 
  FaMinus, 
  FaPlus, 
  FaCreditCard, 
  FaTruck, 
  FaCheckCircle,
  FaLeaf,
  FaHeart,
  FaTimes,
  FaExclamationTriangle
} from 'react-icons/fa';
import { CartContext } from '@/components/Providers';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const { refreshCart } = useContext(CartContext);

  useEffect(() => {
    if (!session) {
      router.push('/giris?callbackUrl=/sepet');
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await fetch('/api/sepet');
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        const data = await response.json();
        setCartItems(data);
      } catch (err) {
        setError('Sepet bilgileri yüklenirken bir hata oluştu');
        console.error('Error fetching cart items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [session, router]);

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setUpdatingItem(id);
    try {
      const response = await fetch(`/api/sepet/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const updatedItem = await response.json();
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? updatedItem : item
        )
      );
      refreshCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Miktar güncellenirken bir hata oluştu');
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (id: string) => {
    if (!window.confirm('Bu ürünü sepetten kaldırmak istediğinizden emin misiniz?')) {
      return;
    }

    setRemovingItem(id);
    try {
      const response = await fetch(`/api/sepet/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== id)
      );
      refreshCart();
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Ürün kaldırılırken bir hata oluştu');
    } finally {
      setRemovingItem(null);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const createOrder = async () => {
    if (cartItems.length === 0) {
      setError('Sepetiniz boş');
      return;
    }

    setCreatingOrder(true);
    try {
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const response = await fetch('/api/siparisler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: orderItems }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sipariş oluşturulurken bir hata oluştu');
      }

      const order = await response.json();
      
      // Başarılı sipariş sonrası sepeti temizle
      setCartItems([]);
      
      // Başarı mesajı göster ve ana sayfaya yönlendir
      alert('Siparişiniz başarıyla oluşturuldu! Sipariş numaranız: ' + order.id);
      router.push('/');
      
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err instanceof Error ? err.message : 'Sipariş oluşturulurken bir hata oluştu');
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-3 text-light">Sepet bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <FaExclamationTriangle className="me-2" />
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-vh-100 bg-light">
        {/* Header */}
        <div className="container-fluid py-3 bg-white shadow-sm">
          <div className="d-flex align-items-center gap-3">
            <Link href="/" className="btn btn-outline-secondary">
              <FaArrowLeft className="me-2" />
              Anasayfaya Dön
            </Link>
            <div>
              <h1 className="h3 mb-0 text-dark fw-bold">
                <FaShoppingCart className="me-2 text-primary" />
                Sepetim
              </h1>
              <p className="text-light mb-0">Alışveriş sepetiniz</p>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="card border-0 shadow-sm" style={{borderRadius: '20px'}}>
                <div className="card-body py-5">
                  <div className="mb-4">
                    <FaShoppingCart size={80} className="text-light mb-3" />
                    <h2 className="fw-bold text-white mb-3">Sepetiniz Boş</h2>
                    <p className="text-light mb-4">Henüz sepetinize ürün eklemediniz.</p>
                  </div>
                  <Link href="/urunler" className="btn btn-primary btn-lg fw-bold">
                    <FaLeaf className="me-2" />
                    Ürünleri Keşfet
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="container-fluid py-3 bg-white shadow-sm">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <Link href="/" className="btn btn-outline-secondary">
              <FaArrowLeft className="me-2" />
              Alışverişe Devam
            </Link>
            <div>
              <h1 className="h3 mb-0 text-dark fw-bold">
                <FaShoppingCart className="me-2 text-primary" />
                Sepetim
              </h1>
              <p className="text-light mb-0">{cartItems.length} ürün</p>
            </div>
          </div>
          <div className="d-flex gap-2">
            <span className="badge bg-primary fs-6">
              Toplam: {formatCurrency(calculateTotal())}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm" style={{borderRadius: '20px'}}>
              <div className="card-header bg-white border-0">
                <h4 className="mb-0 fw-bold text-dark">
                  <FaShoppingCart className="me-2 text-primary" />
                  Sepet Ürünleri ({cartItems.length})
                </h4>
              </div>
              <div className="card-body p-0">
                {cartItems.map((item) => (
                  <div key={item.id} className="border-bottom border-light p-4">
                    <div className="row align-items-center">
                      {/* Product Image */}
                      <div className="col-md-3 col-sm-4">
                        <div className="position-relative">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="img-fluid rounded"
                            style={{ 
                              objectFit: 'cover', 
                              height: '120px',
                              width: '100%',
                              transition: 'transform 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            <button
                              className="btn btn-light btn-sm rounded-circle shadow-sm"
                              onClick={() => removeItem(item.id)}
                              disabled={removingItem === item.id}
                              style={{width: '32px', height: '32px'}}
                            >
                              {removingItem === item.id ? (
                                <div className="spinner-border spinner-border-sm" role="status"></div>
                              ) : (
                                <FaTrash size={12} className="text-danger" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="col-md-6 col-sm-5">
                        <h5 className="fw-bold text-white mb-2">{item.product.name}</h5>
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <span className="badge bg-primary bg-opacity-10 text-primary">
                            <FaLeaf className="me-1" />
                            Çiçek
                          </span>
                          <span className="text-success fw-bold">
                            <FaTruck className="me-1" />
                            Aynı Gün Teslimat
                          </span>
                        </div>
                        <div className="fw-bold text-primary fs-5">
                          {formatCurrency(item.product.price)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-md-3 col-sm-3">
                        <div className="d-flex flex-column align-items-end">
                          <div className="input-group mb-2" style={{width: '120px'}}>
                            <button 
                              className="btn btn-outline-secondary btn-sm" 
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={updatingItem === item.id || item.quantity <= 1}
                            >
                              <FaMinus size={10} />
                            </button>
                            <input
                              type="number"
                              className="form-control text-center border-start-0 border-end-0"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              min="1"
                              disabled={updatingItem === item.id}
                              style={{borderLeft: 'none', borderRight: 'none'}}
                            />
                            <button 
                              className="btn btn-outline-secondary btn-sm" 
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={updatingItem === item.id}
                            >
                              <FaPlus size={10} />
                            </button>
                          </div>
                          <div className="text-light small">
                            {updatingItem === item.id ? (
                              <div className="spinner-border spinner-border-sm" role="status"></div>
                            ) : (
                              `Toplam: ${formatCurrency(item.product.price * item.quantity)}`
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{borderRadius: '20px', top: '20px'}}>
              <div className="card-header bg-white border-0">
                <h5 className="mb-0 fw-bold text-dark">
                  <FaCreditCard className="me-2 text-primary" />
                  Sipariş Özeti
                </h5>
              </div>
              <div className="card-body">
                {/* Summary Items */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white">Ürün Toplamı</span>
                    <span className="fw-bold text-white">{formatCurrency(calculateTotal())}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white">Teslimat</span>
                    <span className="text-success fw-bold">Ücretsiz</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white">KDV</span>
                    <span className="fw-bold text-white">{formatCurrency(calculateTotal() * 0.18)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold fs-5 text-white">Toplam</span>
                    <span className="fw-bold fs-5 text-primary">
                      {formatCurrency(calculateTotal() * 1.18)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button 
                  className="btn btn-primary btn-lg w-100 fw-bold mb-3" 
                  style={{borderRadius: '12px', height: '55px'}} 
                  onClick={createOrder}
                  disabled={creatingOrder}
                >
                  {creatingOrder ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                      Sipariş Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="me-2" />
                      Siparişi Tamamla
                    </>
                  )}
                </button>

                {/* Features */}
                <div className="border-top pt-3">
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="d-flex align-items-center text-success">
                        <FaTruck className="me-1" />
                        <small className="fw-bold">Ücretsiz Teslimat</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center text-info">
                        <FaCheckCircle className="me-1" />
                        <small className="fw-bold">Güvenli Ödeme</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center text-warning">
                        <FaLeaf className="me-1" />
                        <small className="fw-bold">Taze Çiçekler</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center text-primary">
                        <FaHeart className="me-1" />
                        <small className="fw-bold">Kalite Garantisi</small>
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