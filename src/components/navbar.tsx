'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/logo_pmii.png"
                alt="Logo PMII"
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </div>
            <div className="truncate">
              <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base block leading-none">
                PMII SUNAN MURIA
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase block mt-1 truncate">
                Komisariat UMK
              </span>
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/" className="text-slate-900 hover:text-blue-700 transition-colors">Beranda</Link>
            <Link href="#profil" className="hover:text-blue-700 transition-colors">Profil</Link>
            <Link href="#rayon" className="hover:text-blue-700 transition-colors">Rayon</Link>
            <Link href="#berita" className="hover:text-blue-700 transition-colors">Berita</Link>
            <Link href="#library" className="hover:text-blue-700 transition-colors">E-Library</Link>
            <Link href="#faq" className="hover:text-blue-700 transition-colors">FAQ</Link>
            <Link href="#kontak" className="hover:text-blue-700 transition-colors">Kontak</Link>
          </nav>

          {/* Tombol Aksi Desktop & Dropdown Masuk */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative group">
              <button 
                type="button"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Masuk</span>
                <span className="text-[9px] text-slate-500">▼</span>
              </button>

              <div className="absolute right-0 pt-2 w-52 hidden group-hover:block z-50">
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl p-2 space-y-1">
                  <Link href="/portal/login" className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 font-semibold text-xs text-slate-700">
                    Login Portal 
                  </Link>
                  <Link href="/admin/login" className="block px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 font-semibold text-xs text-slate-600 border-t border-slate-100">
                    Login Pengurus
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/daftar"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors shadow-sm"
            >
              Daftar Mapaba
            </Link>
          </div>

          {/* Hamburger Menu HP - Paling Depan (z-50) */}
          <div className="flex md:hidden items-center relative z-50">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-800 bg-slate-100 active:scale-95 cursor-pointer"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Drawer Navigasi HP (Muncul di bawah Navbar dengan z-40) */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 text-xs shadow-2xl z-40">
          <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700 rounded-lg">
            Beranda
          </Link>
          <Link href="#profil" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700 rounded-lg">
            Profil
          </Link>
          <Link href="#rayon" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700 rounded-lg">
            Rayon
          </Link>
          <Link href="#berita" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700 rounded-lg">
            Berita
          </Link>
          <Link href="#library" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700 rounded-lg">
            E-Library
          </Link>
          <Link href="#faq" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700 rounded-lg">
            FAQ
          </Link>
          <Link href="#kontak" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700 rounded-lg">
            Kontak
          </Link>
          
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/portal/login" onClick={() => setIsOpen(false)} className="w-full text-center py-2.5 font-semibold text-slate-700 bg-slate-100 rounded-xl">
              Login Portal Anggota
            </Link>
            <Link href="/admin/login" onClick={() => setIsOpen(false)} className="w-full text-center py-2.5 font-semibold text-slate-600 bg-slate-50 rounded-xl border border-slate-200">
              Login Pengurus
            </Link>
            <Link href="/daftar" onClick={() => setIsOpen(false)} className="w-full text-center py-2.5 font-semibold text-white bg-blue-700 rounded-xl shadow-sm">
              Daftar Mapaba
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}