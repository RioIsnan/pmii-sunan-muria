'use client';

import { useState } from 'react';
import { incrementDownloadCount } from '@/app/actions/library';

export default function LibraryCard({ materi }: { materi: any }) {
  const [downloads, setDownloads] = useState(materi.downloads || 0);

  const handleDownload = async () => {
    // Update state secara lokal agar langsung berubah (real-time)
    setDownloads((prev: number) => prev + 1);
    
    // Panggil server action untuk menyimpan ke database di latar belakang
    await incrementDownloadCount(materi.id);
    
    // Buka file di tab baru
    window.open(materi.fileUrl, '_blank');
  };

  return (
    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full uppercase">
            {materi.kategori}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            📥 {downloads} kali diunduh
          </span>
        </div>
        <h3 className="text-base font-bold text-slate-900 leading-snug">
          {materi.judul}
        </h3>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {materi.deskripsi || 'Tidak ada deskripsi tambahan.'}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
        <span className="text-slate-500 text-[11px]">Penulis: {materi.penulis}</span>
        <button
          onClick={handleDownload}
          className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all shadow-xs inline-block text-xs cursor-pointer"
        >
          Unduh / Buka File
        </button>
      </div>
    </div>
  );
}