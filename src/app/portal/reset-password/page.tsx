'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPassword } from '@/app/actions/forgot-password';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ success: false, text: '' });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage({ success: false, text: '' });

    const formData = new FormData(e.currentTarget);
    formData.append('token', token);

    const res = await resetPassword(formData);
    setLoading(false);
    setMessage({ success: res.success, text: res.message });

    if (res.success) {
      setTimeout(() => router.push('/portal/login'), 2000);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Buat Password Baru
          </h1>
          <p className="text-xs text-slate-500">
            Masukkan kata sandi baru untuk akun portal Anda
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
            <label className="block font-semibold text-slate-700 mb-1">Password Baru</label>
            <input
              type="password"
              name="newPassword"
              required
              placeholder="Min. 6 karakter"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Simpan Password Baru'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <Link href="/portal/login" className="text-blue-600 font-semibold hover:underline">
            Kembali ke Login
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">Memuat...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}