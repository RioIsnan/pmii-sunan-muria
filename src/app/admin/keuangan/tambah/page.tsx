'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createKegiatanDenganTransaksi } from '@/app/actions/organisasi';

export default function TambahKeuanganPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [items, setItems] = useState<Array<{ kategori: string; tipe: 'PEMASUKAN' | 'PENGELUARAN'; jumlah: string; keterangan: string }>>([
    { kategori: '', tipe: 'PEMASUKAN', jumlah: '', keterangan: '' }
  ]);

  const addItemRow = () => {
    setItems([...items, { kategori: '', tipe: 'PEMASUKAN', jumlah: '', keterangan: '' }]);
  };

  const removeItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItemRow = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append('namaKegiatan', namaKegiatan);
      formData.append('deskripsi', deskripsi);
      formData.append('items', JSON.stringify(items));

      const res = await createKegiatanDenganTransaksi(formData);
      setMessage({ success: res.success, text: res.message });
      if (res.success) {
        setTimeout(() => {
          router.push('/admin/keuangan');
        }, 1000);
      }
    });
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">Tambah Laporan Keuangan Kegiatan</h1>
          <p className="text-xs text-slate-500 mt-0.5">Formulir pengisian nama kegiatan beserta rincian pemasukan dan pengeluaran</p>
        </div>
        <Link
          href="/admin/keuangan"
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-all"
        >
          ← Kembali
        </Link>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-xs font-semibold border ${message.success ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kegiatan</label>
            <input
              type="text"
              required
              value={namaKegiatan}
              onChange={(e) => setNamaKegiatan(e.target.value)}
              placeholder="Contoh: MAPABA XXVIII / Pelatihan Kader Dasar"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat (Opsional)</label>
            <input
              type="text"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Catatan tambahan kegiatan..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white"
            />
          </div>
        </div>

        {/* DAFTAR BARIS RINCIAN KONDISIONAL */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Rincian Keperluan / Donatur</span>
            <button
              type="button"
              onClick={addItemRow}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-all cursor-pointer"
            >
              + Tambah Baris
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200 items-center">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    required
                    value={item.kategori}
                    onChange={(e) => updateItemRow(index, 'kategori', e.target.value)}
                    placeholder="Keperluan (Cth: Banner / Senior A)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <select
                    value={item.tipe}
                    onChange={(e) => updateItemRow(index, 'tipe', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                  >
                    <option value="PEMASUKAN">Pemasukan (+)</option>
                    <option value="PENGELUARAN">Pengeluaran (-)</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="number"
                    required
                    value={item.jumlah}
                    onChange={(e) => updateItemRow(index, 'jumlah', e.target.value)}
                    placeholder="Jumlah (Rp)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={item.keterangan}
                    onChange={(e) => updateItemRow(index, 'keterangan', e.target.value)}
                    placeholder="Catatan..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div className="sm:col-span-1 text-center">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItemRow(index)}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold px-2 py-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Link
            href="/admin/keuangan"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-all"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Menyimpan...' : 'Simpan Laporan Kegiatan'}
          </button>
        </div>
      </form>
    </div>
  );
}