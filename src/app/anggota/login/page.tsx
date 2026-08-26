'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { loginAnggota } from '@/app/actions/anggota-auth';

export default function AnggotaLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const res = await loginAnggota(formData);
      setMessage({ success: res.success, text: res.message });
      if (res.success) {
        setTimeout(() => {
          router.push('/anggota/dashboard');
        }, 1000);
      }
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="relative w-12 h-12">
            <Image src="/logo_pmii.png" alt="Logo PMII" fill sizes="48px" className="object-contain" priority />
          </div>
        </div>
        <h2 className="mt-4 text-center text-xl sm:text-2xl font-extrabold text-slate-900">
          Portal Anggota & Magang
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          PMII Komisariat Sunan Muria
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200/80 rounded-2xl sm:px-10 space-y-5">
          
          {message && (
            <div className={`p-3 rounded-xl text-xs font-semibold border ${message.success ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
              {message.text}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Email atau Nomor WhatsApp
              </label>
              <input
                type="text"
                name="identifier"
                required
                placeholder="nama@email.com atau 08123456789"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Masukkan password Anda"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
              />
              <span className="block text-[10px] text-slate-400 mt-1">
                *Gunakan password yang Anda daftarkan atau nomor WhatsApp Anda.
              </span>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isPending ? 'Memproses...' : 'Masuk Portal Anggota'}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs">
            <span className="text-slate-500">Belum terdaftar atau belum diverifikasi? </span>
            <Link href="/pendaftaran" className="text-blue-700 font-bold hover:underline">
              Daftar MAPABA di sini
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
            ← Kembali ke Beranda Utama
          </Link>
        </div>
      </div>
    </div>
  );
}