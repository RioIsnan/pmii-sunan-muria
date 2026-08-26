import { getKaderList, getRayonList, getKaderStats } from '@/app/actions/kader';
import ActionButtons from './action-buttons';
import FilterBar from './filter-bar';
import ExportButton from './export-button';
import StatsCards from './stats-cards';
import WaButton from './wa-button';
import Link from 'next/link';

export default async function AdminKaderPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; rayonId?: string }>;
}) {
  const params = await searchParams;
  const kaderList = await getKaderList(params.search, params.rayonId);
  const rayonList = await getRayonList();
  const stats = await getKaderStats();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Pendaftaran Kader
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verifikasi & Rekapitulasi pendaftaran MAPABA PMII Sunan Muria
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <ExportButton data={kaderList} />
        </div>
      </div>

      {/* Ringkasan Statistik Cards */}
      <StatsCards stats={stats} />

      {/* Filter Bar & Search */}
      <FilterBar rayonList={rayonList} />

      {/* ======================================================== */}
      {/* 1. TAMPILAN MOBILE CARD VIEW (Hanya Tampak di HP/Seluler)  */}
      {/* ======================================================== */}
      <div className="block md:hidden space-y-3">
        {kaderList.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-xl p-8 text-center text-slate-400 text-xs">
            Tidak ada data pendaftar yang ditemukan.
          </div>
        ) : (
          kaderList.map((item, index) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-xs"
            >
              {/* Header Kartu: Nama & Badge Status */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    #{index + 1}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {item.namaLengkap}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${
                    item.status === 'VERIFIED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : item.status === 'REJECTED'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {item.status === 'VERIFIED'
                    ? 'Diterima'
                    : item.status === 'REJECTED'
                    ? 'Ditolak'
                    : 'Pending'}
                </span>
              </div>

              {/* Rincian Prodi, Fakultas, Kontak & Rayon */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Prodi / Fakultas:</span>
                  <span className="font-medium text-slate-900 text-[11px] text-right truncate max-w-[200px]">
                    {item.prodi} ({item.fakultas})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Rayon Auto-Mapped:</span>
                  <span className="font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                    {item.rayon?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">No. WhatsApp:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] text-slate-800">
                      {item.nomorHp}
                    </span>
                    <WaButton nama={item.namaLengkap} nomorHp={item.nomorHp} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Email:</span>
                  <span className="text-slate-500 text-[11px] truncate max-w-[180px]">
                    {item.email}
                  </span>
                </div>
              </div>

              {/* Tombol Aksi & Tombol Detail Verifikasi */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/admin/kader/${item.id}`}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-[11px] rounded-lg border border-purple-200 transition-colors"
                >
                  🔍 Verifikasi & MBTI
                </Link>
                <ActionButtons id={item.id} currentStatus={item.status} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. TAMPILAN DESKTOP TABLE (Hanya Tampak di Laptop/Tablet) */}
      {/* ======================================================== */}
      <div className="hidden md:block bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-3.5 w-12 text-center">No</th>
                <th className="px-5 py-3.5">Nama Lengkap</th>
                <th className="px-5 py-3.5">Prodi & Fakultas</th>
                <th className="px-5 py-3.5">Kontak & Email</th>
                <th className="px-5 py-3.5">Asal Rayon</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-center">Aksi & Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kaderList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-xs">
                    Tidak ada pendaftar yang ditemukan.
                  </td>
                </tr>
              ) : (
                kaderList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-slate-400 text-center">
                      {index + 1}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {item.namaLengkap}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{item.prodi}</div>
                      <div className="text-[11px] text-slate-400">{item.fakultas}</div>
                    </td>
                    <td className="px-5 py-4 text-xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-mono">{item.nomorHp}</span>
                        <WaButton nama={item.namaLengkap} nomorHp={item.nomorHp} />
                      </div>
                      <div className="text-slate-400">{item.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {item.rayon?.name}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          item.status === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {item.status === 'VERIFIED'
                          ? 'Diterima'
                          : item.status === 'REJECTED'
                          ? 'Ditolak'
                          : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/kader/${item.id}`}
                          className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs rounded-lg border border-purple-200 transition-colors inline-flex items-center gap-1"
                        >
                          🔍 Verifikasi
                        </Link>
                        <ActionButtons id={item.id} currentStatus={item.status} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}