'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Conversation {
  user: {
    id: number;
    name: string;
    surname: string;
    email: string;
  };
  messageCount: number;
}

interface Message {
  id: number;
  message: string;
  createdAt: string;
  sender: {
    name: string;
    surname: string;
  };
}

export const dynamic = "force-dynamic";

export default function Mesajlar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris');
    } else if (status === 'authenticated') {
      fetchConversations();
    }
  }, [status, router]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser);
    }
  }, [selectedUser]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      if (!response.ok) throw new Error('Sohbetler getirilemedi');
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      setError('Sohbetler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: number) => {
    try {
      const response = await fetch(`/api/messages/${userId}`);
      if (!response.ok) throw new Error('Mesajlar getirilemedi');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError('Mesajlar yüklenirken bir hata oluştu');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedUser,
          message: newMessage.trim(),
        }),
      });

      if (!response.ok) throw new Error('Mesaj gönderilemedi');

      const newMessageData = await response.json();
      setMessages([...messages, newMessageData]);
      setNewMessage('');
      fetchConversations(); // Mesaj sayısını güncellemek için
    } catch (error) {
      setError('Mesaj gönderilirken bir hata oluştu');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Mesajlarım</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card bg-white text-dark shadow">
            <div className="card-body">
              {messages.length === 0 ? (
                <p>Hiç mesajınız yok.</p>
              ) : (
                <ul className="list-group">
                  {messages.map((message) => (
                    <li key={message.id} className="list-group-item bg-light text-dark mb-2">
                      <strong>{message.sender.name} {message.sender.surname}:</strong> {message.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 