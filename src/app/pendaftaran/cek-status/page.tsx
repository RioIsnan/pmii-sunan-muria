'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { checkStatusKader } from '@/app/actions/kader';

export default function CekStatusPage() {
  const [isPending, startTransition] = useTransition();
  const [identifier, setIdentifier] = useState('');
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResult(null);

    startTransition(async () => {
      const res = await checkStatusKader(identifier);
      if (res.success) {
        setResult(res.data);
      } else {
        setErrorMsg(res.message || 'Data tidak ditemukan.');
      }
    });
  };

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
          Cek Status Pendaftaran
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          MAPABA PMII Komisariat Universitas Muria Kudus
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-5 sm:px-8 shadow-xs border border-slate-200/80 rounded-2xl space-y-5">
          
          <form onSubmit={handleCheck} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nomor WhatsApp ATAU Email
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Contoh: 081234567890 / email@domain.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPending ? 'Mencari Data...' : 'Cek Status Sekarang'}
            </button>
          </form>

          {/* Pesan Error / Not Found */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
              {errorMsg}
            </div>
          )}

          {/* Kartu Hasil Pencarian Status */}
          {result && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <span className="text-xs font-bold text-slate-900 truncate">{result.namaLengkap}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    result.status === 'VERIFIED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : result.status === 'REJECTED'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {result.status === 'VERIFIED'
                    ? 'DITERIMA'
                    : result.status === 'REJECTED'
                    ? 'DITOLAK'
                    : 'PENDING'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Prodi / Fakultas:</span>
                  <span className="font-semibold text-slate-900 text-right">{result.prodi} ({result.fakultas})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rayon Naungan:</span>
                  <span className="font-bold text-blue-700">{result.rayon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tanggal Daftar:</span>
                  <span className="font-mono text-[11px] text-slate-700">
                    {new Date(result.tanggalDaftar).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Keterangan Status + Link E-KTA jika DITERIMA */}
              <div className="pt-2 border-t border-slate-200/80 text-[11px] leading-relaxed">
                {result.status === 'VERIFIED' && (
                  <div className="space-y-2">
                    <p className="text-emerald-700 font-medium">
                      Selamat! Pendaftaran Anda telah diverifikasi oleh pengurus.
                    </p>
                    <Link
                      href={`/kader/kta/${result.id}`}
                      className="inline-block w-full text-center py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-all shadow-xs"
                    >
                      Lihat E-KTA Digital Anda →
                    </Link>
                  </div>
                )}
                {result.status === 'PENDING' && (
                  <p className="text-amber-700 font-medium">
                    Pendaftaran Anda sedang dalam tahap peninjauan berkas oleh pengurus. Mohon tunggu informasi selanjutnya.
                  </p>
                )}
                {result.status === 'REJECTED' && (
                  <p className="text-rose-700 font-medium">
                    Mohon maaf, pendaftaran Anda belum disetujui. Hubungi panitia MAPABA untuk klarifikasi lebih lanjut.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 text-center flex items-center justify-between text-xs">
            <Link href="/pendaftaran" className="text-slate-500 hover:text-blue-700 font-medium">
              Belum Daftar?
            </Link>
            <Link href="/" className="text-slate-500 hover:text-blue-700 font-medium">
              ← Beranda
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}