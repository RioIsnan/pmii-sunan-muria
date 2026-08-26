'use client';

import { useState, useTransition } from 'react';
import { createBerita, createAgenda } from '@/app/actions/cms';

export default function AdminBeritaPage() {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'berita' | 'agenda'>('berita');
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  async function handleBerita(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const res = await createBerita(formData);
      setMessage({ success: res.success, text: res.message });
      if (res.success) (document.getElementById('form-berita') as HTMLFormElement)?.reset();
    });
  }

  async function handleAgenda(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const res = await createAgenda(formData);
      setMessage({ success: res.success, text: res.message });
      if (res.success) (document.getElementById('form-agenda') as HTMLFormElement)?.reset();
    });
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Manajemen Konten CMS</h1>
        <p className="text-xs text-slate-500 mt-1">Publikasikan Berita & Agenda Kegiatan PMII Sunan Muria</p>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setActiveTab('berita'); setMessage(null); }}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 cursor-pointer transition-all ${
            activeTab === 'berita'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          + Tambah Berita
        </button>
        <button
          onClick={() => { setActiveTab('agenda'); setMessage(null); }}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 cursor-pointer transition-all ${
            activeTab === 'agenda'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          + Tambah Agenda
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-xs font-semibold border ${
            message.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form Berita */}
      {activeTab === 'berita' && (
        <form id="form-berita" action={handleBerita} className="bg-white p-6 rounded-xl border border-slate-200/80 space-y-4 shadow-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Judul Artikel / Berita</label>
            <input
              type="text"
              name="judul"
              required
              placeholder="Contoh: Pembukaan MAPABA XX VIII PMII Sunan Muria"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Penulis / Redaksi</label>
            <input
              type="text"
              name="penulis"
              required
              placeholder="Contoh: Tim Lembaga Pers Komisariat"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Isi Konten Berita</label>
            <textarea
              name="konten"
              rows={6}
              required
              placeholder="Tuliskan isi berita atau pengumuman secara lengkap..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Menerbitkan...' : 'Terbitkan Berita'}
          </button>
        </form>
      )}

      {/* Form Agenda */}
      {activeTab === 'agenda' && (
        <form id="form-agenda" action={handleAgenda} className="bg-white p-6 rounded-xl border border-slate-200/80 space-y-4 shadow-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Agenda / Kegiatan</label>
            <input
              type="text"
              name="judul"
              required
              placeholder="Contoh: Pelatihan Kader Dasar (PKD)"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Lokasi Pelaksanaan</label>
              <input
                type="text"
                name="lokasi"
                required
                placeholder="Contoh: Gedung MWC NU Kudus"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tanggal Kegiatan</label>
              <input
                type="date"
                name="tanggal"
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Deskripsi Singkat (Opsional)</label>
            <textarea
              name="deskripsi"
              rows={3}
              placeholder="Catatan atau keterangan agenda..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Menyimpan...' : 'Simpan Agenda'}
          </button>
        </form>
      )}
    </div>
  );
}