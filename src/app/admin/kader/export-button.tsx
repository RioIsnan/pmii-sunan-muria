'use client';

export default function ExportButton({ data }: { data: any[] }) {
  const handleExport = () => {
    if (!data.length) return alert('Tidak ada data untuk di-export.');

    const headers = ['Nama Lengkap', 'Email', 'Nomor HP', 'Rayon/Komisariat', 'Status', 'Tanggal Daftar'];
    const rows = data.map((item) => [
      `"${item.namaLengkap}"`,
      `"${item.email}"`,
      `"${item.nomorHp}"`,
      `"${item.rayon?.name || ''}"`,
      `"${item.status}"`,
      `"${new Date(item.createdAt).toLocaleDateString('id-ID')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Data_Kader_PMII_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
    >
      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export Data (.CSV)
    </button>
  );
}