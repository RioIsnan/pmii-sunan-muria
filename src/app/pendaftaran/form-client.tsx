'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { daftarKader } from '@/app/actions/kader';

const LIST_FAKULTAS = [
  'Fakultas Teknik',
  'Fakultas Ekonomi dan Bisnis',
  'Fakultas Keguruan dan Ilmu Pendidikan',
  'Fakultas Hukum',
  'Fakultas Psikologi',
  'Fakultas Pertanian',
];

export default function FormPendaftaranClient() {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setFeedback(null);
    startTransition(async () => {
      const result = await daftarKader(formData);
      setFeedback(result);
      if (result.success) {
        (document.getElementById('form-pendaftaran') as HTMLFormElement)?.reset();
      }
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block relative w-12 h-12 mb-2">
          <Image
            src="/logo_pmii.png"
            alt="Logo PMII"
            fill
            sizes="48px"
            className="object-contain"
            priority
          />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Pendaftaran Anggota MAPABA
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          PMII Komisariat Universitas Muria Kudus
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-5 sm:px-8 shadow-xs border border-slate-200/80 rounded-2xl">
          
          {feedback && (
            <div
              className={`mb-5 p-3 rounded-lg text-xs font-semibold text-center border ${
                feedback.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              {feedback.message}
            </div>
          )}

          <form id="form-pendaftaran" action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="namaLengkap"
                required
                placeholder="Masukkan nama sesuai KTP/KTM"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nomor WhatsApp / HP
              </label>
              <input
                type="tel"
                name="nomorHp"
                required
                placeholder="081234567890"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Fakultas
              </label>
              <select
                name="fakultas"
                required
                defaultValue=""
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 cursor-pointer transition-all"
              >
                <option value="" disabled>
                  Pilih Fakultas
                </option>
                {LIST_FAKULTAS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Program Studi (Prodi)
              </label>
              <input
                type="text"
                name="prodi"
                required
                placeholder="Contoh: Teknik Informatika / Manajemen"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPending ? 'Memproses...' : 'Kirim Pendaftaran'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <Link href="/" className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-colors">
             Kembali ke Beranda Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}