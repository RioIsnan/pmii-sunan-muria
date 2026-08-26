'use client';

import { useRouter } from 'next/navigation';
import { logoutAdmin } from '@/app/actions/auth';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer flex items-center gap-2"
    >
      <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Keluar Akses Admin
    </button>
  );
}