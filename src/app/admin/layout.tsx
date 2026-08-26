'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LogoutButton from './kader/logout-button';
import { getAdminSession } from '@/app/actions/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<{
    nama: string;
    role: string;
    rayonName: string;
  } | null>(null);

  useEffect(() => {
    getAdminSession().then((data) => {
      if (data) setSession(data);
    });
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      
      {/* HEADER MOBILE */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5 truncate">
          <div className="relative w-6 h-6 shrink-0">
            <Image src="/logo_pmii.png" alt="Logo" fill sizes="24px" className="object-contain" priority />
          </div>
          <div className="truncate">
            <span className="font-bold text-xs tracking-tight text-slate-900 block leading-none truncate">
              {session?.rayonName || 'PMII SUNAN MURIA'}
            </span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Admin Portal</span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-3 sticky top-14 z-20 shadow-md">
          {session && (
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">AKUN ACTIVE:</span>
              <p className="font-bold text-slate-900">{session.nama}</p>
              <p className="text-blue-700 font-medium">{session.rayonName}</p>
            </div>
          )}

          <nav className="space-y-1 text-xs font-semibold">
            <Link
              href="/admin/kader"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin/kader' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Verifikasi Pendaftaran
            </Link>

            <Link
              href="/admin/database-kader"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin/database-kader' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Database & Logbook Kader
            </Link>

            <Link
              href="/admin/surat/masuk"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin/surat/masuk' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Surat Masuk
            </Link>

            <Link
              href="/admin/surat/keluar"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin/surat/keluar' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Surat Keluar
            </Link>

            <Link
              href="/admin/keuangan"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin/keuangan' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Kas Organisasi (Bendahara)
            </Link>

            <Link
              href="/admin/magang"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin/magang' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Program Magang
            </Link>

            <Link
              href="/admin/library"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin/library' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              E-Library Materi
            </Link>

            <Link
              href="/admin/presensi"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith('/admin/presensi') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Presensi & QR Code
            </Link>

            <Link
              href="/admin/berita"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                pathname === '/admin/berita' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Berita & Agenda
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-100">
            <LogoutButton />
          </div>
        </div>
      )}

      {/* SIDEBAR DESKTOP */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between shrink-0">
        <div>
          <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
            <div className="relative w-7 h-7 shrink-0">
              <Image src="/logo_pmii.png" alt="Logo" fill sizes="28px" className="object-contain" priority />
            </div>
            <div className="truncate">
              <span className="font-bold text-xs tracking-tight text-slate-900 block leading-none truncate">
                {session?.rayonName || 'PMII SUNAN MURIA'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium block mt-1">Admin Control Center</span>
            </div>
          </div>

          <nav className="p-4 space-y-1 text-sm font-medium">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Main Menu
            </div>
            
            <Link
              href="/admin/kader"
              className={`flex items-center px-3 py-2.5 rounded-lg font-semibold transition-colors ${
                pathname === '/admin/kader' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Verifikasi Pendaftaran
            </Link>

            <Link
              href="/admin/database-kader"
              className={`flex items-center px-3 py-2.5 rounded-lg font-semibold transition-colors ${
                pathname === '/admin/database-kader' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Database & Logbook Kader
            </Link>

            <Link
              href="/admin/surat/masuk"
              className={`flex items-center px-3 py-2.5 rounded-lg font-semibold transition-colors ${
                pathname === '/admin/surat/masuk' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Surat Masuk
            </Link>

            <Link
              href="/admin/surat/keluar"
              className={`flex items-center px-3 py-2.5 rounded-lg font-semibold transition-colors ${
                pathname === '/admin/surat/keluar' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Surat Keluar
            </Link>

            <Link
              href="/admin/keuangan"
              className={`flex items-center px-3 py-2.5 rounded-lg font-semibold transition-colors ${
                pathname === '/admin/keuangan' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Kas Organisasi (Bendahara)
            </Link>

            <Link
              href="/admin/magang"
              className={`flex items-center px-3 py-2.5 rounded-lg font-semibold transition-colors ${
                pathname === '/admin/magang' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Program Magang
            </Link>

            <Link
              href="/admin/library"
              className={`flex items-center px-3 py-2.5 rounded-lg font-semibold transition-colors ${
                pathname === '/admin/library' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              E-Library Materi
            </Link>

            <Link
              href="/admin/presensi"
              className={`flex items-center px-3 py-2.5 rounded-lg font-semibold transition-colors ${
                pathname.startsWith('/admin/presensi') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Presensi & QR Code
            </Link>

            <Link
              href="/admin/berita"
              className={`flex items-center px-3 py-2.5 rounded-lg font-semibold transition-colors ${
                pathname === '/admin/berita' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Berita & Agenda
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 space-y-3">
          {session && (
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">AKUN ACTIVE:</span>
              <p className="font-bold text-slate-900 truncate">{session.nama}</p>
              <p className="text-blue-700 font-medium truncate">{session.rayonName}</p>
            </div>
          )}
          <LogoutButton />
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 px-6 items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 truncate">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{session?.rayonName}</span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Ruang Kerja: {session?.rayonName}
          </span>
        </header>

        <main className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}