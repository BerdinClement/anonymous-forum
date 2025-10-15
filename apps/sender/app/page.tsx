'use client';

import { useState } from 'react';
import { Message } from '@/types/Message';
import messageService from "@/lib/message/MessageService";
import Link from "next/link";
import { config } from "@/config";

export default function Home() {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState<Message | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const msg = await messageService.createMessage(author.trim(), content.trim());
      setSuccess(msg);
      setAuthor('');
      setContent('');
    } catch {
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl border border-gray-200">
        <Link href={config.threadAppUrl} className={"text-blue-600"}>View all message</Link>
        <h1 className="text-2xl font-semibold mb-6 text-center">Send an Anonymous Message</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {success && (
          <p className="mt-4 text-green-600 text-sm text-center">
            Message sent successfully at {new Date(success.createdAt).toLocaleString()}
          </p>
        )}
        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
