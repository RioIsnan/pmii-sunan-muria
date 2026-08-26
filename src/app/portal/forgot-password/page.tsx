'use client';

import { useState } from 'react';
import { requestPasswordReset } from '@/app/actions/forgot-password';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ success: false, text: '' });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage({ success: false, text: '' });

    const formData = new FormData(e.currentTarget);
    const res = await requestPasswordReset(formData);

    setLoading(false);
    setMessage({ success: res.success, text: res.message });
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Lupa Password Portal
          </h1>
          <p className="text-xs text-slate-500">
            Masukkan email terdaftar untuk mendapatkan tautan pemulihan
          </p>
        </div>

        {message.text && (
          <div className={`p-3 text-xs rounded-xl text-center font-medium ${
            message.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Terdaftar</label>
            <input
              type="email"
              name="email"
              required
              placeholder="nama@email.com"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Mengirim Tautan...' : 'Kirim Tautan Pemulihan'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Ingat password Anda?{' '}
          <Link href="/portal/login" className="text-blue-600 font-semibold hover:underline">
            Login di sini
          </Link>
        </div>
      </div>
    </main>
  );
}