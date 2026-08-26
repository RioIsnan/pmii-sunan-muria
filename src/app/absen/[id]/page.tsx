'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getPresensiSesiDetail, submitPresensiKader } from '@/app/actions/presensi';
import Link from 'next/link';

export default function PublicAbsenPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const tokenFromUrl = searchParams.get('token') || '';

  const [sesi, setSesi] = useState<any>(null);
  const [emailOrNim, setEmailOrNim] = useState('');
  const [tokenInput, setTokenInput] = useState(tokenFromUrl);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    getPresensiSesiDetail(id).then((data) => setSesi(data));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await submitPresensiKader({
      sesiId: id,
      emailOrNim,
      tokenInput,
    });

    setMessage({ success: res.success, text: res.message });
    setLoading(false);
    if (res.success) {
      setEmailOrNim('');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
            Portal Presensi Kader
          </span>
          <h1 className="text-lg font-extrabold text-slate-900 mt-2">{sesi?.namaSesi || 'Memuat Sesi...'}</h1>
          <p className="text-xs text-slate-500">{sesi?.agenda?.judul}</p>
        </div>

        {message && (
          <div className={`p-3 rounded-xl text-xs font-semibold ${message.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Masukkan NIK / Email Terdaftar / No KTA</label>
            <input
              type="text"
              value={emailOrNim}
              onChange={(e) => setEmailOrNim(e.target.value)}
              required
              placeholder="Contoh: 3302xxxxxxxx atau email@domain.com"
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Kode Token Dinamis (Dari Layar Panitia)</label>
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              required
              placeholder="Masukkan 6 digit token..."
              className="w-full px-3.5 py-2.5 text-xs font-mono font-bold tracking-widest border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 uppercase"
            />
            <p className="text-[10px] text-slate-400">Token ini berganti secara berkala di layar panitia demi keamanan kehadiran.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            {loading ? 'Memproses Absen...' : 'Kirim Kehadiran (Check-In)'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 font-semibold">← Kembali ke Beranda Utama</Link>
        </div>
      </div>
    </div>
  );
}