'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface RayonItem {
  id: string;
  name: string;
}

export default function FilterBar({ rayonList }: { rayonList: RayonItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set('search', term);
    else params.delete('search');
    startTransition(() => router.push(`/admin/kader?${params.toString()}`));
  };

  const handleFilterRayon = (rayonId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (rayonId) params.set('rayonId', rayonId);
    else params.delete('rayonId');
    startTransition(() => router.push(`/admin/kader?${params.toString()}`));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
      {/* Input Search */}
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          placeholder="Cari nama, email, atau no HP..."
          defaultValue={searchParams.get('search')?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-blue-600 transition-all"
        />
        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Select Filter */}
      <div className="w-full sm:w-64 flex items-center gap-2">
        <select
          defaultValue={searchParams.get('rayonId')?.toString() || ''}
          onChange={(e) => handleFilterRayon(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:bg-white focus:outline-none focus:border-blue-600 cursor-pointer transition-all"
        >
          <option value="">Semua Rayon / Komisariat</option>
          {rayonList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}