'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaEnvelope, 
  FaEnvelopeOpen, 
  FaReply, 
  FaTrash, 
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPaperPlane,
  FaEye,
  FaTimes
} from 'react-icons/fa';

interface MessageContent {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface Message {
  id: string;
  senderId: string | null;
  receiverId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
  } | null;
  receiver: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN') {
        router.push('/');
      } else {
        fetchMessages();
      }
    }
  }, [status, session, router]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/mesajlar');
      if (!response.ok) {
        throw new Error('Mesajlar yüklenemedi');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError('Mesajlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) {
      setError('Yanıt metni gerekli.');
      return;
    }

    setReplying(true);
    try {
      const response = await fetch(`/api/admin/mesajlar/${messageId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: replyText,
          originalMessage: selectedMessage
        }),
      });

      if (response.ok) {
        setSuccess('Yanıt başarıyla gönderildi.');
        setReplyText('');
        setSelectedMessage(null);
        fetchMessages();
      } else {
        throw new Error('Yanıt gönderilirken hata oluştu');
      }
    } catch (error) {
      setError('Yanıt gönderilirken bir hata oluştu.');
    } finally {
      setReplying(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/mesajlar/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Mesaj başarıyla silindi.');
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
        fetchMessages();
      } else {
        throw new Error('Mesaj silinirken hata oluştu');
      }
    } catch (error) {
      setError('Mesaj silinirken bir hata oluştu.');
    }
  };

  const parseMessageContent = (content: string): MessageContent => {
    try {
      return JSON.parse(content);
    } catch {
      return {
        name: 'Bilinmeyen',
        email: 'bilinmeyen@email.com',
        phone: '',
        subject: 'Genel',
        message: content
      };
    }
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

  // Mesajları ve yanıtları ayır
  const replyMessages = messages.filter(m => {
    try {
      const c = JSON.parse(m.content);
      return c.type === 'reply' && c.originalMessageId;
    } catch {
      return false;
    }
  });
  const originalMessages = messages.filter(m => {
    try {
      const c = JSON.parse(m.content);
      return !c.type || c.type !== 'reply';
    } catch {
      return true;
    }
  });

  // Her mesaj için yanıtı var mı?
  const isReplied = (msgId: string) => replyMessages.some(rm => {
    try {
      const c = JSON.parse(rm.content);
      return c.originalMessageId === msgId;
    } catch {
      return false;
    }
  });

  // Filtreli mesajlar
  const filteredMessages = originalMessages.filter(message => {
    const content = parseMessageContent(message.content);
    const matchesSearch = content.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.subject.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;
    if (filterStatus === 'UNREAD') {
      matchesFilter = !isReplied(message.id);
    } else if (filterStatus === 'REPLIED') {
      matchesFilter = isReplied(message.id);
    }
    return matchesSearch && matchesFilter;
  });

  // Badge sayıları
  const unreadCount = originalMessages.filter(m => !isReplied(m.id)).length;
  const repliedCount = originalMessages.filter(m => isReplied(m.id)).length;

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
              <FaEnvelope className="me-2 text-primary" />
              Mesaj Yönetimi
            </h1>
            <p className="text-muted mb-0">Müşteri mesajlarını yönetin ve yanıtlayın</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-warning fs-6">
            Okunmamış: {unreadCount}
          </span>
          <span className="badge bg-success fs-6">
            Yanıtlanmış: {repliedCount}
          </span>
          <span className="badge bg-primary fs-6">
            Toplam: {originalMessages.length}
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
      <div className="card border-0 shadow-sm mb-4" style={{background: '#181818', borderRadius: '20px'}}>
        <div className="card-body py-3">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-0">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control bg-secondary text-white border-0 admin-search-input"
                  placeholder="Müşteri adı, e-posta veya konu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select bg-white text-dark border-0"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">Tüm Mesajlar</option>
                <option value="UNREAD">Okunmamış</option>
                <option value="REPLIED">Yanıtlanmış</option>
              </select>
            </div>
            <div className="col-md-5">
              <div className="d-flex gap-2">
                <span className="badge bg-warning">Okunmamış: {unreadCount}</span>
                <span className="badge bg-success">Yanıtlanmış: {repliedCount}</span>
                <span className="badge bg-info">Toplam: {originalMessages.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Mesaj Listesi */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm bg-white text-dark">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0 fw-bold text-dark">Mesaj Listesi</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {filteredMessages.map((message) => {
                  const content = parseMessageContent(message.content);
                  return (
                    <div 
                      key={message.id}
                      className={`list-group-item list-group-item-action ${selectedMessage?.id === message.id ? 'active' : ''}`}
                      onClick={() => setSelectedMessage(message)}
                      style={{ cursor: 'pointer', background: '#fff', color: '#222' }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <h6 className="mb-0 fw-bold text-dark">{content.name}</h6>
                            <span className="badge bg-secondary">{content.subject}</span>
                          </div>
                          <div className="text-muted small mb-1">{content.email}</div>
                          <div className="text-muted text-truncate" style={{ maxWidth: '400px' }}>
                            {content.message}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="text-muted small">{formatDate(message.createdAt)}</div>
                          <div className="btn-group btn-group-sm mt-1">
                            <button
                              className="btn btn-outline-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMessage(message);
                              }}
                              title="Detayları Gör"
                            >
                              <FaEye size={12} />
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMessage(message.id);
                              }}
                              title="Mesajı Sil"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mesaj Detayları */}
        <div className="col-lg-4">
          {selectedMessage ? (
            <div className="card border-0 shadow-sm bg-dark text-white">
              <div className="card-header bg-dark border-0">
                <h5 className="mb-0 fw-bold text-white">
                  Mesaj Detayları
                  <button
                    className="btn btn-sm btn-outline-light float-end"
                    onClick={() => setSelectedMessage(null)}
                  >
                    ×
                  </button>
                </h5>
              </div>
              <div className="card-body">
                {(() => {
                  const content = parseMessageContent(selectedMessage.content);
                  return (
                    <>
                      {/* Müşteri Bilgileri */}
                      <div className="mb-4">
                        <h6 className="fw-bold mb-3 text-white">
                          <FaUser className="me-2 text-primary" />
                          Müşteri Bilgileri
                        </h6>
                        <div className="bg-secondary bg-opacity-25 p-3 rounded">
                          <div className="mb-2">
                            <strong>Ad Soyad:</strong> <span className="text-white">{content.name}</span>
                          </div>
                          <div className="mb-2">
                            <strong>E-posta:</strong> <span className="text-white">{content.email}</span>
                          </div>
                          {content.phone && (
                            <div className="mb-2">
                              <strong>Telefon:</strong> <span className="text-white">{content.phone}</span>
                            </div>
                          )}
                          <div className="mb-2">
                            <strong>Konu:</strong> 
                            <span className="badge bg-secondary ms-2">{content.subject}</span>
                          </div>
                          <div>
                            <strong>Tarih:</strong> <span className="text-white">{formatDate(selectedMessage.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Mesaj İçeriği */}
                      <div className="mb-4">
                        <h6 className="fw-bold mb-3 text-white">
                          <FaEnvelope className="me-2 text-primary" />
                          Mesaj İçeriği
                        </h6>
                        <div className="bg-secondary bg-opacity-25 p-3 rounded">
                          <p className="mb-0 text-white">{content.message}</p>
                        </div>
                      </div>

                      {/* Yanıt Formu */}
                      <div className="mb-4">
                        <h6 className="fw-bold mb-3">
                          <FaReply className="me-2 text-primary" />
                          Yanıt Yaz
                        </h6>
                        <textarea
                          className="form-control mb-3 admin-reply-textarea"
                          rows={4}
                          placeholder="Yanıtınızı buraya yazın..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          style={{ background: '#222', color: '#fff', border: '1px solid #444' }}
                        ></textarea>
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-primary admin-reply-send-btn"
                            style={{ background: '#1976d2', border: 'none', color: '#fff', boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.15)' }}
                            onClick={() => handleReply(selectedMessage.id)}
                            disabled={replying || !replyText.trim()}
                          >
                            {replying ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Gönderiliyor...
                              </>
                            ) : (
                              <>
                                <FaPaperPlane className="me-2" />
                                Yanıt Gönder
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ background: '#444', color: '#fff', border: 'none' }}
                            onClick={() => setReplyText('')}
                          >
                            <FaTimes className="me-2" />
                            Temizle
                          </button>
                        </div>
                      </div>

                      {/* Hızlı İşlemler */}
                      <div>
                        <h6 className="fw-bold mb-3">Hızlı İşlemler</h6>
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-outline-success"
                            onClick={() => {
                              setReplyText(`Merhaba ${content.name},\n\nMesajınız için teşekkür ederiz. En kısa sürede size dönüş yapacağız.\n\nSaygılarımızla,\nÇiçekçi Ekibi`);
                            }}
                          >
                            <FaCheckCircle className="me-2" />
                            Teşekkür Mesajı
                          </button>
                          <button
                            className="btn btn-outline-info"
                            onClick={() => {
                              setReplyText(`Merhaba ${content.name},\n\nMesajınız alınmıştır. Detaylı bilgi için sizinle iletişime geçeceğiz.\n\nSaygılarımızla,\nÇiçekçi Ekibi`);
                            }}
                          >
                            <FaEnvelope className="me-2" />
                            Bilgi Mesajı
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <FaEnvelope size={48} className="text-muted mb-3" />
                <h6 className="text-muted">Mesaj detaylarını görmek için bir mesaj seçin</h6>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 