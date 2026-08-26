'use client';

import { useTransition } from 'react';
import { updateStatusKader } from '@/app/actions/kader';
import { StatusKader } from '@prisma/client';

export default function ActionButtons({ id, currentStatus }: { id: string; currentStatus: StatusKader }) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (status: StatusKader) => {
    startTransition(async () => {
      await updateStatusKader(id, status);
      window.location.reload();
    });
  };

  return (
    <div className="flex items-center gap-1.5">
      {currentStatus !== 'VERIFIED' && (
        <button
          onClick={() => handleUpdate('VERIFIED')}
          disabled={isPending}
          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? '...' : 'Setujui'}
        </button>
      )}
      {currentStatus !== 'REJECTED' && (
        <button
          onClick={() => handleUpdate('REJECTED')}
          disabled={isPending}
          className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? '...' : 'Tolak'}
        </button>
      )}
    </div>
  );
}