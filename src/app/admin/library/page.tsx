'use client';

import { useState, useEffect, useTransition } from 'react';
import { getLibraryMateriList, createLibraryMateri } from '@/app/actions/library';

export default function AdminLibraryPage() {
  const [isPending, startTransition] = useTransition();
  const [materiList, setMateriList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [tipeSumber, setTipeSumber] = useState<'upload' | 'link'>('upload');
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  const fetchMateri = async () => {
    const data = await getLibraryMateriList();
    setMateriList(data);
  };

  useEffect(() => {
    fetchMateri();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('tipeSumber', tipeSumber);

    startTransition(async () => {
      const res = await createLibraryMateri(formData);
      setMessage({ success: res.success, text: res.message });
      if (res.success) {
        form.reset();
        setShowForm(false);
        fetchMateri();
      }
    });
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">Kelola E-Library & Gudang Materi</h1>
          <p className="text-xs text-slate-500 mt-0.5">Unggah modul, buku panduan, atau literasi digital resmi PMII</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
          >
            + Tambah Materi Baru
          </button>
        )}
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-xs font-semibold ${message.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Form Tambah Materi Dokumen</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-1 cursor-pointer"
            >
              ✕ Tutup
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Judul Modul / Buku</label>
              <input
                type="text"
                name="judul"
                required
                placeholder="Contoh: Modul Panduan NDP PMII"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Kategori (Ketik Manual)</label>
              <input
                type="text"
                name="kategori"
                required
                placeholder="Contoh: NDP, Modul Kaderisasi, Jurnal, dll"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Penulis / Sumber</label>
              <input
                type="text"
                name="penulis"
                placeholder="Contoh: Tim Kaderisasi Komisariat"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-2 sm:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <label className="text-xs font-bold text-slate-800 block">Pilih Tipe Sumber File:</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="pilihanTipe"
                    checked={tipeSumber === 'upload'}
                    onChange={() => setTipeSumber('upload')}
                    className="text-blue-600"
                  />
                  Upload File Langsung (PDF, Doc, Excel, Foto)
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="pilihanTipe"
                    checked={tipeSumber === 'link'}
                    onChange={() => setTipeSumber('link')}
                    className="text-blue-600"
                  />
                  Gunakan Link Eksternal (Google Drive / URL)
                </label>
              </div>

              {tipeSumber === 'upload' ? (
                <div className="mt-3 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600">Pilih File Dokumen (PDF, Doc, Excel, Foto)</label>
                  <input
                    type="file"
                    name="fileDokumen"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="mt-3 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600">Masukkan Link URL</label>
                  <input
                    type="url"
                    name="fileUrl"
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 bg-white"
                  />
                </div>
              )}
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Deskripsi Singkat</label>
              <textarea
                name="deskripsi"
                rows={2}
                placeholder="Keterangan isi materi..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 resize-none"
              ></textarea>
            </div>

            <div className="sm:col-span-2 pt-2 flex items-center gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg transition-all shadow-xs cursor-pointer"
              >
                {isPending ? 'Menyimpan...' : 'Simpan & Unggah'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-all cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-900">
          Daftar Materi E-Library Tersimpan ({materiList.length})
        </div>
        {materiList.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Belum ada materi yang diunggah. Klik tombol "+ Tambah Materi Baru" di atas.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {materiList.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200 uppercase">
                      {item.kategori}
                    </span>
                    <span className="text-[10px] text-slate-400">📥 {item.downloads} diunduh</span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900">{item.judul}</h3>
                  <p className="text-[11px] text-slate-500">Penulis: {item.penulis}</p>
                </div>
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] rounded-lg transition-all shrink-0"
                >
                  Buka File
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}