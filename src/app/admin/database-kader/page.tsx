'use client';

import { useState, useEffect } from 'react';
import { getKaderList, getRayonList, updateKaderPosition, addKaderisasiLog } from '@/app/actions/kader';
import { getAdminSession } from '@/app/actions/auth';
import WaButton from '../kader/wa-button';

export default function DatabaseKaderPage() {
  const [kaderList, setKaderList] = useState<any[]>([]);
  const [rayonList, setRayonList] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedRayon, setSelectedRayon] = useState<string>('ALL');

  // State untuk Edit Posisi Custom per Kader
  const [editingPosisiId, setEditingPosisiId] = useState<string | null>(null);
  const [customPosisiText, setCustomPosisiText] = useState<string>('');

  // State untuk Modal Logbook Kaderisasi
  const [selectedKader, setSelectedKader] = useState<any>(null);
  const [jenjang, setJenjang] = useState<'MAPABA' | 'PKD' | 'PKL'>('MAPABA');
  const [tahun, setTahun] = useState<number>(new Date().getFullYear());
  const [tempat, setTempat] = useState<string>('');
  const [sertifikatNo, setSertifikatNo] = useState<string>('');
  const [keterangan, setKeterangan] = useState<string>('');

  const loadData = async (query = '', rayonId = 'ALL') => {
    setLoading(true);
    try {
      const [kData, rData, adminSession] = await Promise.all([
        getKaderList(query, rayonId === 'ALL' ? undefined : rayonId),
        getRayonList(),
        getAdminSession(),
      ]);
      
      const verifiedKader = (kData || []).filter((item: any) => item.status === 'VERIFIED');
      setKaderList(verifiedKader);
      setRayonList(rData || []);
      setSession(adminSession);
    } catch (err) {
      console.error('Gagal memuat database kader:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(search, selectedRayon);
  }, [search, selectedRayon]);

  const isKomisariat = session && (
    (session.role || '').toLowerCase().includes('komisariat') || 
    (session.rayonName || '').toLowerCase().includes('komisariat') ||
    (session.role || '').toLowerCase().includes('super_admin')
  );

  async function handleSaveCustomPosition(kaderId: string) {
    if (!customPosisiText.trim()) return;
    const res = await updateKaderPosition(kaderId, customPosisiText);
    alert(res.message);
    if (res.success) {
      setEditingPosisiId(null);
      setCustomPosisiText('');
      loadData(search, selectedRayon);
    }
  }

  async function handleAddLog(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedKader) return;

    const res = await addKaderisasiLog({
      kaderId: selectedKader.id,
      jenjang,
      tahun: Number(tahun),
      tempat,
      sertifikatNo,
      keterangan,
    });

    alert(res.message);
    if (res.success) {
      setTempat('');
      setSertifikatNo('');
      setKeterangan('');
      setSelectedKader(null); // Pop-up langsung tertutup otomatis
      loadData(search, selectedRayon);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl w-full">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Database Anggota & Logbook Kaderisasi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pusat data master warga rayon, struktur kepengurusan fleksibel (Biro/Bidang), dan rekam jejak kader
          </p>
        </div>
        <button
          onClick={() => loadData(search, selectedRayon)}
          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg shadow-xs cursor-pointer w-fit"
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Filter & Search Bar (Filter Rayon hanya muncul untuk Komisariat) */}
      <div className="bg-white p-4 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <input
          type="text"
          placeholder="Cari nama, NIM, prodi, atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />

        {isKomisariat && (
          <select
            value={selectedRayon}
            onChange={(e) => setSelectedRayon(e.target.value)}
            className="w-full sm:w-60 px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">Semua Rayon (Komisariat)</option>
            {rayonList.map((r: any) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* ======================================================== */}
      {/* 1. TAMPILAN MOBILE: CARD VERTICAL                        */}
      {/* ======================================================== */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <div className="bg-white border border-slate-200/80 rounded-xl p-8 text-center text-slate-400 text-xs">
            Memuat database...
          </div>
        ) : kaderList.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-xl p-8 text-center text-slate-400 text-xs">
            Belum ada anggota resmi yang terverifikasi di database.
          </div>
        ) : (
          kaderList.map((item, index) => (
            <div key={item.id} className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    #{index + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{item.namaLengkap}</span>
                    <span className="text-[11px] font-mono text-blue-600 block">NIM: {item.nim || '-'} | NTA: {item.ktaNumber || '-'}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                  {item.jenjang || 'MAPABA'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Prodi / Fakultas:</span>
                  <span className="font-medium text-slate-900 text-right truncate max-w-[190px]">{item.prodi} ({item.fakultas})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Rayon:</span>
                  <span className="font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                    {item.rayon?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Posisi / Jabatan:</span>
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {item.posisi || 'Anggota Biasa'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">No. WhatsApp:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] text-slate-800">{item.nomorHp}</span>
                    <WaButton nama={item.namaLengkap} nomorHp={item.nomorHp} />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedKader(item)}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  📜 Kelola Logbook ({item.kaderisasiLogs?.length || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. TAMPILAN DESKTOP TABLE                                */}
      {/* ======================================================== */}
      <div className="hidden md:block bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">No</th>
                <th className="px-4 py-3.5">Nama & Identitas (NIM/NTA)</th>
                <th className="px-4 py-3.5">Prodi & Fakultas</th>
                <th className="px-4 py-3.5">Kontak</th>
                <th className="px-4 py-3.5">Asal Rayon</th>
                <th className="px-4 py-3.5">Posisi / Jabatan Struktural</th>
                <th className="px-4 py-3.5">Jenjang</th>
                <th className="px-4 py-3.5 text-center">Logbook</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    Memuat data anggota...
                  </td>
                </tr>
              ) : kaderList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    Belum ada anggota resmi yang terverifikasi di database.
                  </td>
                </tr>
              ) : (
                kaderList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-4 font-mono text-slate-400 text-center">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900">{item.namaLengkap}</div>
                      <div className="font-mono text-[10px] text-slate-500">NIM: <span className="text-slate-700 font-semibold">{item.nim || '-'}</span></div>
                      <div className="font-mono text-[10px] text-blue-600 font-semibold">NTA: {item.ktaNumber || '-'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">{item.prodi}</div>
                      <div className="text-[11px] text-slate-400">{item.fakultas}</div>
                    </td>
                    <td className="px-4 py-4 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-mono">{item.nomorHp}</span>
                        <WaButton nama={item.namaLengkap} nomorHp={item.nomorHp} />
                      </div>
                      <div className="text-slate-400">{item.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {item.rayon?.name}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {editingPosisiId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={customPosisiText}
                            onChange={(e) => setCustomPosisiText(e.target.value)}
                            placeholder="Cth: Kepala Biro Infokom"
                            className="p-1 border border-blue-300 rounded text-xs text-slate-800 w-36 focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveCustomPosition(item.id)}
                            className="px-2 py-1 bg-blue-600 text-white rounded font-semibold text-[10px] cursor-pointer"
                          >
                            Simpan
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                            {item.posisi || 'Anggota Biasa'}
                          </span>
                          <button
                            onClick={() => {
                              setEditingPosisiId(item.id);
                              setCustomPosisiText(item.posisi || '');
                            }}
                            className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        item.jenjang === 'PKL' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        item.jenjang === 'PKD' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.jenjang}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setSelectedKader(item)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        📜 Logbook ({item.kaderisasiLogs?.length || 0})
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL KELOLA LOGBOOK & INFORMASI KADER                   */}
      {/* ======================================================== */}
      {selectedKader && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Logbook & Detail Kader</h2>
                <p className="text-xs text-slate-500">Anggota: <strong className="text-slate-800">{selectedKader.namaLengkap}</strong> (NIM: {selectedKader.nim || '-'})</p>
              </div>
              <button
                onClick={() => setSelectedKader(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-800">Riwayat Pelatihan Formal:</p>
              {!selectedKader.kaderisasiLogs || selectedKader.kaderisasiLogs.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-lg text-center">Belum ada riwayat kaderisasi yang tercatat.</p>
              ) : (
                <div className="space-y-2">
                  {selectedKader.kaderisasiLogs.map((log: any) => (
                    <div key={log.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-700">{log.jenjang}</span>
                          <span className="text-slate-500">({log.tahun})</span>
                        </div>
                        <p className="text-slate-600">Tempat: <strong className="text-slate-800">{log.tempat || '-'}</strong></p>
                        {log.sertifikatNo && <p className="text-slate-500 text-[11px]">No. Sertifikat: {log.sertifikatNo}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleAddLog} className="pt-4 border-t space-y-4 text-xs">
              <p className="font-bold text-slate-900">Tambah Catatan Riwayat Baru:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Jenjang Kaderisasi</label>
                  <select
                    value={jenjang}
                    onChange={(e: any) => setJenjang(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg font-semibold text-slate-700 bg-white"
                  >
                    <option value="MAPABA">MAPABA</option>
                    <option value="PKD">PKD (Pendidikan Kader Dasar)</option>
                    <option value="PKL">PKL (Pendidikan Kader Lanjutan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tahun Pelaksanaan</label>
                  <input
                    type="number"
                    value={tahun}
                    onChange={(e) => setTahun(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tempat / Penyelenggara</label>
                  <input
                    type="text"
                    placeholder="Contoh: Komisariat Sunan Muria"
                    value={tempat}
                    onChange={(e) => setTempat(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nomor Sertifikat (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 012/MAPABA/SM/2026"
                    value={sertifikatNo}
                    onChange={(e) => setSertifikatNo(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedKader(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Simpan Riwayat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}