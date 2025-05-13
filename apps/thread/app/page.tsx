'use client';

import { useEffect, useState } from 'react';
import messageService from "@/lib/message/MessageService";
import { Message } from "@/types/Message";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await messageService.getAllMessages();
        setMessages(data);
        setError(null);
      } catch {
        setError('Failed to load messages');
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Anonymous Messages</h1>
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white shadow rounded-2xl p-4 border border-gray-200"
            >
              <div className="text-gray-800 font-medium">{msg.author}</div>
              <p className="text-gray-600 mt-1">{msg.content}</p>
              <div className="text-xs text-gray-400 mt-2">
                {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
