'use client';

import { useState, useEffect } from 'react';
import { getAnggotaSession } from '@/app/actions/anggota-auth';
import { updateAnggotaProfile } from '@/app/actions/anggota-profile';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilAnggotaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ success: false, text: '' });
  
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    nim: '',
    nomorHp: '',
    prodi: '',
    fakultas: '',
    alamat: '',
    tanggalLahir: '',
  });

  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [ktmFile, setKtmFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadUser() {
      const user = await getAnggotaSession();
      if (!user) {
        router.push('/portal/login');
      } else {
        setFormData({
          namaLengkap: user.namaLengkap || '',
          email: user.email || '',
          nim: user.nim || '',
          nomorHp: user.nomorHp || '',
          prodi: user.prodi || '',
          fakultas: user.fakultas || '',
          alamat: user.alamat || '',
          tanggalLahir: user.tanggalLahir ? new Date(user.tanggalLahir).toISOString().split('T')[0] : '',
        });
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage({ success: false, text: '' });

    const data = new FormData();
    data.append('nim', formData.nim);
    data.append('nomorHp', formData.nomorHp);
    data.append('prodi', formData.prodi);
    data.append('fakultas', formData.fakultas);
    data.append('alamat', formData.alamat);
    data.append('tanggalLahir', formData.tanggalLahir);

    if (ktpFile) data.append('ktp', ktpFile);
    if (ktmFile) data.append('ktm', ktmFile);

    const res = await updateAnggotaProfile(data);
    setSaving(false);
    setMessage({ success: res.success, text: res.message });
    if (res.success) {
      setTimeout(() => router.push('/portal'), 1500);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center text-xs text-slate-500">Memuat data pemberkasan...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-sm font-bold text-slate-900">Formulir Pemberkasan & Administrasi</h1>
          <Link href="/portal" className="text-xs text-blue-600 font-semibold hover:underline">
            ← Kembali ke Dashboard
          </Link>
        </div>

        {message.text && (
          <div className={`p-3 text-xs rounded-xl text-center font-medium ${
            message.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={formData.namaLengkap}
                disabled
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Aktif</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Induk Mahasiswa (NIM) <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                value={formData.nim}
                onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                placeholder="Kosongkan jika belum punya"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={formData.tanggalLahir}
                onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                required
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili / Asal</label>
            <textarea
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              required
              rows={3}
              placeholder="Masukkan alamat lengkap Anda..."
              className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
              <input
                type="text"
                value={formData.nomorHp}
                onChange={(e) => setFormData({ ...formData, nomorHp: e.target.value })}
                required
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fakultas</label>
              <input
                type="text"
                value={formData.fakultas}
                onChange={(e) => setFormData({ ...formData, fakultas: e.target.value })}
                required
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Program Studi</label>
              <input
                type="text"
                value={formData.prodi}
                onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                required
                className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Bagian Upload Berkas KTP & KTM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Upload Scan / Foto KTP</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setKtpFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Upload Scan / Foto KTM <span className="text-slate-400 font-normal"></span>
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setKtmFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 mt-4"
          >
            {saving ? 'Menyimpan Berkas...' : 'Simpan Berkas Administrasi'}
          </button>
        </form>

      </div>
    </main>
  );
}