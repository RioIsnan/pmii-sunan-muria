'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPresensiSesiDetail, rotatePresensiToken } from '@/app/actions/presensi';
import Link from 'next/link';

export default function AdminPresensiMonitorPage() {
  const params = useParams();
  const id = params.id as string;
  const [sesi, setSesi] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  
  const DURASI_ROTASI = 45; 
  const [countdown, setCountdown] = useState<number>(DURASI_ROTASI);

  const fetchDetail = async () => {
    const data = await getPresensiSesiDetail(id);
    if (data) {
      setSesi(data);
      setToken(data.tokenDinamis);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchDetail();
    const interval = setInterval(async () => {
      setCountdown((prev) => {
        if (prev <= 1) {
          rotatePresensiToken(id).then((res) => {
            if (res.success) {
              setToken(res.tokenDinamis);
              fetchDetail();
            }
          });
          return DURASI_ROTASI;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [id]);

  // URL halaman check-in aman dari hydration error
  const checkinUrl = mounted ? `${window.location.origin}/absen/${id}?token=${token}` : '';

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/presensi" className="text-xs font-semibold text-blue-700 hover:underline">← Kembali ke Daftar Presensi</Link>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 mt-1">Live Monitor QR Code & Check-In</h1>
          <p className="text-xs text-slate-500">Sesi: <strong>{sesi?.namaSesi}</strong> ({sesi?.agenda?.judul})</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full animate-pulse">
            🔴 Sesi Berjalan (Rotasi Token: {countdown}s)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KARTU QR CODE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scan QR untuk Absen</span>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl min-h-[224px] flex items-center justify-center">
            {mounted && checkinUrl ? (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(checkinUrl)}`}
                alt="QR Code Presensi"
                className="w-48 h-48 object-contain mx-auto"
              />
            ) : (
              <div className="text-xs text-slate-400">Memuat QR Code...</div>
            )}
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">Kode Token Saat Ini:</span>
            <div className="text-xl font-mono font-extrabold tracking-widest text-blue-700 bg-blue-50 px-4 py-1.5 rounded-xl border border-blue-200">{token || '...'}</div>
          </div>
          <p className="text-[10px] text-slate-400">Token otomatis berganti setiap {DURASI_ROTASI} detik untuk keamanan presensi.</p>
        </div>

        {/* REKAP KADER HADIR */}
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between font-bold text-xs text-slate-900">
            <span>Daftar Kader Hadir Secara Real-Time</span>
            <span className="text-blue-700 font-mono">Total: {sesi?.logs?.length || 0} Kader</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            {!sesi?.logs || sesi.logs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">Belum ada kader yang melakukan check-in. Silakan scan QR code di samping.</div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 sticky top-0">
                    <th className="p-3">Waktu Hadir</th>
                    <th className="p-3">Nama Kader</th>
                    <th className="p-3">NIM / NIK</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {sesi.logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50/60">
                      <td className="p-3 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {new Date(log.waktuHadir).toLocaleTimeString('id-ID')}
                      </td>
                      <td className="p-3 font-bold text-slate-900">{log.kader?.namaLengkap}</td>
                      <td className="p-3 font-mono text-slate-500">{log.kader?.nik || log.kader?.email}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {log.statusKehadiran}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}