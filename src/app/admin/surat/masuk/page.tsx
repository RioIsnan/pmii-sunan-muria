'use client';

import { useState, useTransition, useEffect } from 'react';
import { getSuratList, createSurat, deleteSurat } from '@/app/actions/organisasi';

export default function SuratMasukPage() {
  const [isPending, startTransition] = useTransition();
  const [suratList, setSuratList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  const fetchSurat = async () => {
    const data = await getSuratList('SURAT_MASUK');
    setSuratList(data);
  };

  useEffect(() => {
    fetchSurat();
  }, []);

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      formData.append('tipe', 'SURAT_MASUK');
      const res = await createSurat(formData);
      setMessage({ success: res.success, text: res.message });
      if (res.success) {
        setIsModalOpen(false);
        (document.getElementById('form-surat') as HTMLFormElement)?.reset();
        fetchSurat();
      }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus arsip surat masuk ini?')) return;
    startTransition(async () => {
      await deleteSurat(id);
      fetchSurat();
    });
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">Arsip Surat Masuk</h1>
          <p className="text-xs text-slate-500 mt-0.5">Pengelolaan dan penyimpanan dokumen surat masuk resmi</p>
        </div>
        <button
          onClick={() => { setIsModalOpen(true); setMessage(null); }}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          + Tambah Surat Masuk
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-xs font-semibold border ${message.success ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
          {message.text}
        </div>
      )}

      {/* Container Utama Responsive (Card Layout untuk Mobile, Tabel untuk Desktop) */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
        {suratList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Belum ada arsip surat masuk.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {suratList.map((item, index) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {item.nomorSurat}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{item.judulSurat}</h3>
                  {item.keterangan && <p className="text-xs text-slate-500">{item.keterangan}</p>}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {item.fileUrl ? (
                    <a
                      href={item.fileUrl}
                      download={item.fileName || 'surat-masuk'}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
                    >
                      📎 Download File
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Tanpa File</span>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-sm">Tambah Arsip Surat Masuk</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form id="form-surat" action={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider">Nomor Surat</label>
                <input type="text" name="nomorSurat" required placeholder="Contoh: 012/EXT/V/2026" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider">Judul / Perihal</label>
                <input type="text" name="judulSurat" required placeholder="Contoh: Undangan Rapat Koordinasi Cabang" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider">Tanggal Surat</label>
                <input type="date" name="tanggal" required className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider">Lampiran Dokumen (PDF/Foto)</label>
                <input type="file" name="fileDocument" accept="image/*,.pdf,.doc,.docx" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider">Keterangan (Opsional)</label>
                <input type="text" name="keterangan" placeholder="Asal surat..." className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white" />
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg">Batal</button>
                <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50">{isPending ? 'Menyimpan...' : 'Simpan Surat'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}