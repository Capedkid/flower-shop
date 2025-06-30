'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUsers, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN') {
        router.push('/');
      } else {
        fetchUsers();
      }
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/kullanicilar');
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        setError(data.message || 'Kullanıcılar yüklenirken bir hata oluştu.');
      }
    } catch (error) {
      setError('Kullanıcılar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/kullanicilar/${userId}/rol`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setSuccess('Kullanıcı rolü başarıyla güncellendi.');
        fetchUsers();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Rol güncellenirken bir hata oluştu.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/kullanicilar/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Kullanıcı başarıyla silindi.');
        fetchUsers();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Kullanıcı silinirken bir hata oluştu.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu.');
    }
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
          <Link href="/admin" className="btn btn-outline-secondary">
            <FaArrowLeft className="me-2" />
            Geri
          </Link>
          <div>
            <h1 className="h3 mb-0 text-dark fw-bold">
              <FaUsers className="me-2 text-primary" />
              Kullanıcı Yönetimi
            </h1>
            <p className="text-muted mb-0">Sistem kullanıcılarını yönetin</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-primary fs-6">
            Toplam: {users.length} Kullanıcı
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

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0 fw-bold text-dark">Kullanıcı Listesi</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="border-0">ID</th>
                  <th className="border-0">Ad Soyad</th>
                  <th className="border-0">E-posta</th>
                  <th className="border-0">Rol</th>
                  <th className="border-0">Kayıt Tarihi</th>
                  <th className="border-0">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="fw-bold">#{user.id.slice(-6)}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.id === session?.user?.id}
                      >
                        <option value="USER">Kullanıcı</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => handleRoleChange(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                          disabled={user.id === session?.user?.id}
                          title="Rol Değiştir"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.id === session?.user?.id}
                          title="Kullanıcıyı Sil"
                        >
                          <FaTrash size={12} />
                        </button>
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
  );
} 