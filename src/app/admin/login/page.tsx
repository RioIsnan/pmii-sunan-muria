'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/app/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setErrorMsg(null);
    startTransition(async () => {
      const result = await loginAdmin(formData);
      if (result.success) {
        router.push('/admin/kader');
      } else {
        setErrorMsg(result.message);
      }
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="relative w-12 h-12 mx-auto mb-3">
          <Image
            src="/logo_pmii.png"
            alt="Logo PMII"
            fill
            sizes="48px"
            className="object-contain"
            priority
          />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Portal Login Pengurus
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          PMII Komisariat Universitas Muria Kudus
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {errorMsg && (
            <div className="mb-6 p-3 rounded-lg text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 text-center">
              {errorMsg}
            </div>
          )}

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                placeholder="Masukkan username admin"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white font-semibold text-sm rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPending ? 'Memeriksa...' : 'Masuk Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link href="/" className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-colors">
              ← Kembali ke Beranda Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}