'use client';

import { useState, useEffect } from 'react';
import {
  getMagangListForAdmin,
  approveByRayon,
  approveByKomisariat,
  rejectMagang,
} from '@/app/actions/magang-admin';
import { getAdminSession } from '@/app/actions/auth';

export default function AdminMagangPage() {
  const [list, setList] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [data, adminSession] = await Promise.all([
        getMagangListForAdmin(),
        getAdminSession(),
      ]);
      setList(data || []);
      setSession(adminSession);
    } catch (err) {
      console.error('Gagal memuat data magang:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isKomisariat =
    session?.role?.toLowerCase().includes('komisariat') ||
    session?.rayonName?.toLowerCase().includes('komisariat');

  async function handleRayonAcc(id: string) {
    const res = await approveByRayon(id);
    alert(res.message);
    if (res.success) loadData();
  }

  async function handleKomisariatAcc(id: string) {
    const res = await approveByKomisariat(id);
    alert(res.message);
    if (res.success) loadData();
  }

  async function handleReject(id: string) {
    if (!confirm('Yakin ingin menolak pendaftaran ini?')) return;
    const res = await rejectMagang(id);
    alert(res.message);
    if (res.success) loadData();
  }

  return (
    <div className="space-y-6 max-w-6xl w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Program Magang & Seleksi Kader
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola verifikasi berjenjang (Rayon → Komisariat)
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg shadow-xs cursor-pointer"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-900 flex items-center justify-between">
          <span>Daftar Pendaftar Magang ({list.length})</span>
          {loading && <span className="text-blue-600 animate-pulse">Memuat data...</span>}
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Mengambil data pendaftar dari server...
          </div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <p className="font-semibold text-slate-600">Belum ada data pendaftar magang.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {list.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {item.namaLengkap}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px]">
                      {item.asalRayon}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Minat Bidang: <strong className="text-slate-900">{item.divisiTujuan || 'Umum'}</strong> | WhatsApp: <span className="text-blue-600">{item.noWhatsapp}</span>
                  </p>
                  {item.pengalaman && (
                    <p className="text-slate-500 italic text-[11px]">
                      Portofolio: {item.pengalaman}
                    </p>
                  )}

                  <div className="pt-1">
                    {item.status === 'MENDAFTAR' && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200 font-bold text-[10px]">
                        Menunggu Persetujuan Rayon
                      </span>
                    )}
                    {item.status === 'DITINJAU' && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200 font-bold text-[10px]">
                        Disetujui Rayon (Menunggu Verifikasi Komisariat)
                      </span>
                    )}
                    {item.status === 'DITERIMA' && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 font-bold text-[10px]">
                        ✓ Disetujui Final Komisariat (Lolos)
                      </span>
                    )}
                    {item.status === 'DITOLAK' && (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded border border-rose-200 font-bold text-[10px]">
                        Ditolak
                      </span>
                    )}
                  </div>
                </div>

                {/* Tombol Aksi Berjenjang */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Muncul untuk Admin Rayon saat status masih MENDAFTAR */}
                  {item.status === 'MENDAFTAR' && !isKomisariat && (
                    <>
                      <button
                        onClick={() => handleRayonAcc(item.id)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg cursor-pointer transition-colors"
                      >
                        Setujui (Rayon)
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-lg cursor-pointer transition-colors"
                      >
                        Tolak
                      </button>
                    </>
                  )}

                  {/* Muncul untuk Admin Komisariat saat status sudah DITINJAU oleh Rayon */}
                  {item.status === 'DITINJAU' && isKomisariat && (
                    <>
                      <button
                        onClick={() => handleKomisariatAcc(item.id)}
                        className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg cursor-pointer transition-colors"
                      >
                        ACC Final (Komisariat)
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-lg cursor-pointer transition-colors"
                      >
                        Tolak
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}