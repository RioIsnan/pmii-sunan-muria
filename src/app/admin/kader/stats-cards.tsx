export default function StatsCards({
  stats,
}: {
  stats: { total: number; verified: number; pending: number; rejected: number };
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* Total */}
      <div className="bg-white border border-slate-200/80 p-3.5 sm:p-5 rounded-xl shadow-xs">
        <span className="text-[11px] sm:text-xs font-medium text-slate-500 block truncate">Total Pendaftar</span>
        <div className="flex items-baseline justify-between mt-1 sm:mt-2">
          <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{stats.total}</span>
          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">All</span>
        </div>
      </div>

      {/* Diterima */}
      <div className="bg-white border border-slate-200/80 p-3.5 sm:p-5 rounded-xl shadow-xs">
        <span className="text-[11px] sm:text-xs font-medium text-slate-500 block truncate">Terverifikasi</span>
        <div className="flex items-baseline justify-between mt-1 sm:mt-2">
          <span className="text-xl sm:text-2xl font-bold text-emerald-700 tracking-tight">{stats.verified}</span>
          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Verified</span>
        </div>
      </div>

      {/* Menunggu */}
      <div className="bg-white border border-slate-200/80 p-3.5 sm:p-5 rounded-xl shadow-xs">
        <span className="text-[11px] sm:text-xs font-medium text-slate-500 block truncate">Pending</span>
        <div className="flex items-baseline justify-between mt-1 sm:mt-2">
          <span className="text-xl sm:text-2xl font-bold text-amber-600 tracking-tight">{stats.pending}</span>
          <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Review</span>
        </div>
      </div>

      {/* Ditolak */}
      <div className="bg-white border border-slate-200/80 p-3.5 sm:p-5 rounded-xl shadow-xs">
        <span className="text-[11px] sm:text-xs font-medium text-slate-500 block truncate">Ditolak</span>
        <div className="flex items-baseline justify-between mt-1 sm:mt-2">
          <span className="text-xl sm:text-2xl font-bold text-slate-600 tracking-tight">{stats.rejected}</span>
          <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Rejected</span>
        </div>
      </div>
    </div>
  );
}