'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAnggota } from '@/app/actions/anggota-auth';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const res = await loginAnggota(formData);

    setLoading(false);
    if (res.success) {
      router.push('/portal'); // Mengarahkan ke Dashboard Portal Anggota
    } else {
      setErrorMsg(res.message);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Login Portal Anggota
          </h1>
          <p className="text-xs text-slate-500">
            PMII Komisariat Sunan Muria
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Aktif</label>
            <input
              type="email"
              name="email"
              required
              placeholder="nama@email.com"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Password</label>
              <Link href="/portal/forgot-password" className="text-[11px] text-blue-600 hover:underline">
                Lupa Password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Memproses Masuk...' : 'Masuk ke Portal'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Belum punya akun / Belum mendaftar?{' '}
          <Link href="/daftar" className="text-blue-600 font-semibold hover:underline">
            Daftar di sini
          </Link>
        </div>
      </div>
    </main>
  );
}