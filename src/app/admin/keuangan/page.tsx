'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { getKegiatanKeuanganList, deleteKegiatanKeuangan } from '@/app/actions/organisasi';

export default function AdminKeuanganPage() {
  const [kegiatanList, setKegiatanList] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchKegiatan = async () => {
    const data = await getKegiatanKeuanganList();
    setKegiatanList(data);
  };

  useEffect(() => {
    fetchKegiatan();
  }, []);

  async function handleDeleteKegiatan(id: string) {
    if (!confirm('Hapus laporan kegiatan dan seluruh rincian transaksinya?')) return;
    startTransition(async () => {
      await deleteKegiatanKeuangan(id);
      fetchKegiatan();
    });
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">Kas & Keuangan Organisasi</h1>
          <p className="text-xs text-slate-500 mt-0.5">Daftar laporan kas dan rincian transaksi berbasis kegiatan</p>
        </div>
        <Link
          href="/admin/keuangan/tambah"
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-all text-center flex items-center justify-center gap-1.5"
        >
          + Buat Laporan Keuangan Baru
        </Link>
      </div>

      {/* Daftar Laporan Kegiatan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kegiatanList.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200/80 rounded-xl p-12 text-center text-slate-400 text-xs">
            Belum ada laporan kegiatan keuangan. Klik tombol di atas untuk membuat laporan baru.
          </div>
        ) : (
          kegiatanList.map((k) => (
            <div key={k.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{k.namaKegiatan}</h3>
                  <button
                    onClick={() => handleDeleteKegiatan(k.id)}
                    disabled={isPending}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                  >
                    Hapus
                  </button>
                </div>
                {k.deskripsi && <p className="text-xs text-slate-500 mt-1">{k.deskripsi}</p>}
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {k.transaksi.map((t: any) => (
                    <div key={t.id} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                      <div>
                        <span className="font-semibold text-slate-800">{t.kategori}</span>
                        <span className="block text-[10px] text-slate-400">{t.keterangan || '-'}</span>
                      </div>
                      <span className={`font-mono font-bold ${t.tipe === 'PEMASUKAN' ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {t.tipe === 'PEMASUKAN' ? '+' : '-'} Rp {t.jumlah.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                  <span>Saldo Sisa:</span>
                  <span className="text-blue-700">Rp {k.saldoSisa.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}