'use client';

import { useState, useEffect, useTransition } from 'react';
import { getPresensiSesiList, createPresensiSesi, deletePresensiSesi } from '@/app/actions/presensi';
import Link from 'next/link';

export default function AdminPresensiPage() {
  const [isPending, startTransition] = useTransition();
  const [sesiList, setSesiList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  const fetchData = async () => {
    const dataSesi = await getPresensiSesiList();
    setSesiList(dataSesi);
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createPresensiSesi(formData);
      
      // Pengamanan agar tidak terjadi error jika res bernilai undefined
      if (!res) {
        setMessage({ success: false, text: 'Terjadi kesalahan sistem, tidak ada respon dari server.' });
        return;
      }

      if (!res.success) {
        setMessage({ success: false, text: res.message });
      } else {
        setMessage({ success: true, text: 'Sesi presensi berhasil dibuat!' });
        setShowModal(false);
        form.reset();
        fetchData();
      }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus sesi presensi ini?')) return;
    const res = await deletePresensiSesi(id);
    
    if (!res) {
      alert('Terjadi kesalahan sistem.');
      return;
    }

    if (res.success) {
      fetchData();
    } else {
      alert(res.message);
    }
  }

  return (
    <div className="space-y-6 max-w-6xl w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">Modul Presensi & QR Code Check-In</h1>
          <p className="text-xs text-slate-500 mt-0.5">Kelola sesi absensi kegiatan dengan token dinamis anti-curang</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
        >
          + Buat Sesi Presensi Baru
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-xs font-semibold ${message.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.text}
        </div>
      )}

      {/* MODAL / POPUP FORM TAMBAH SESI */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Buat Sesi Presensi Baru</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs p-1 cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nama Kegiatan / Agenda (Input Manual)</label>
                <input
                  type="text"
                  name="namaAgendaManual"
                  required
                  placeholder="Contoh: MAPABA Rayon Teknik 2026"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nama Sesi / Pertemuan Materi</label>
                <input
                  type="text"
                  name="namaSesi"
                  required
                  placeholder="Contoh: Sesi 1 - Nilai Dasar Pergerakan (NDP)"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Durasi Aktif (Jam)</label>
                <input
                  type="number"
                  name="durasiJam"
                  defaultValue={2}
                  min={1}
                  required
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan & Buka Monitor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DAFTAR SESI PRESENSI */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-900">
          Daftar Sesi Presensi Aktif ({sesiList.length})
        </div>
        {sesiList.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">Belum ada sesi presensi yang dibuat. Klik tombol di atas untuk membuat sesi.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sesiList.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200 uppercase">
                      {item.agenda?.judul || 'Agenda Kegiatan'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">👥 {item._count?.logs || 0} Kader Hadir</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{item.namaSesi}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Token Aktif: <strong className="text-blue-700">{item.tokenDinamis}</strong></p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/presensi/${item.id}`}
                    className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg transition-all shadow-xs"
                  >
                    Buka Live Monitor QR ↗
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}