'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerAnggota } from '@/app/actions/anggota-auth';
import { getRayonList } from '@/app/actions/kader';
import Link from 'next/link';

export default function DaftarPage() {
  const router = useRouter();
  const [rayonList, setRayonList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function fetchRayon() {
      const rayons = await getRayonList();
      setRayonList(rayons || []);
    }
    fetchRayon();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData(e.currentTarget);
    const res = await registerAnggota(formData);

    setLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        router.push('/portal/login'); // Langsung arahkan ke halaman login setelah 2 detik
      }, 2000);
    } else {
      setErrorMsg(res.message);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Pendaftaran MAPABA & Portal Anggota
          </h1>
          <p className="text-xs text-slate-500">
            PMII Komisariat Sunan Muria — Buat akun dan lengkapi data awal Anda
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl text-center font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar (Jika Ada)</label>
            <input
              type="text"
              name="namaLengkap"
              required
              placeholder="Contoh: Ahmad Fauzi"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Aktif (Untuk Login)</label>
              <input
                type="email"
                name="email"
                required
                placeholder="nama@email.com"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Buat Password Portal</label>
              <input
                type="password"
                name="password"
                required
                placeholder="Min. 6 karakter"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
              <input
                type="text"
                name="nomorHp"
                required
                placeholder="08xxxxxxxxxx"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pilih Rayon Tujuan</label>
              <select
                name="rayonId"
                required
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">-- Pilih Rayon Fakultas --</option>
                {rayonList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fakultas</label>
              <input
                type="text"
                name="fakultas"
                required
                placeholder="Contoh: Fakultas Teknik"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Program Studi (Prodi)</label>
              <input
                type="text"
                name="prodi"
                required
                placeholder="Contoh: Teknik Informatika"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'Memproses Pendaftaran...' : 'Daftar & Buat Akun Portal'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Sudah punya akun?{' '}
          <Link href="/portal/login" className="text-blue-600 font-semibold hover:underline">
            Login di sini
          </Link>
        </div>
      </div>
    </main>
  );
}