import { getAnggotaSession, logoutAnggota } from '@/app/actions/anggota-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function PortalDashboardPage() {
  const kader = await getAnggotaSession();

  // Jika belum login, lempar kembali ke halaman login
  if (!kader) {
    redirect('/portal/login');
  }

  const isVerified = kader.status === 'VERIFIED';

  // Menentukan label status tahap 1 berdasarkan kondisi data
  let labelStatusBerkas = 'Belum Lengkap / Cek';
  let badgeColorBerkas = 'bg-amber-100 text-amber-800';

  if (kader.isVerifiedBerkas) {
    labelStatusBerkas = 'Terverifikasi';
    badgeColorBerkas = 'bg-emerald-100 text-emerald-800';
  } else if (kader.isProfileComplete) {
    labelStatusBerkas = 'Menunggu Verifikasi';
    badgeColorBerkas = 'bg-blue-100 text-blue-800';
  }

  // Pengecekan apakah semua tahapan sudah selesai
  const semuaTahapSelesai = 
    kader.isVerifiedBerkas && 
    kader.isVerifiedPreTest && 
    kader.isVerifiedMapaba && 
    kader.isVerifiedPostTest;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Portal PMII Sunan Muria
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-2">
              Selamat Datang, {kader.namaLengkap}!
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
               <strong className="text-slate-700">{kader.rayon?.name || 'Komisariat'}</strong> |  {kader.fakultas}
            </p>
          </div>

          <form action={logoutAnggota}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium text-xs rounded-xl border border-red-200 transition-colors cursor-pointer"
            >
              Keluar Akun
            </button>
          </form>
        </div>

        {/* Status Warning Jika Administrasi Belum Lengkap */}
        {!kader.isProfileComplete && (
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-amber-900 block text-sm">⚠️ Administrasi Belum Lengkap</span>
              <p className="text-amber-700">
                Mohon lengkapi data profil mandiri Anda (NIM, foto, alamat, dan berkas KTP/KTM) agar proses verifikasi lancar.
              </p>
            </div>
            <Link
              href="/portal/profil"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-xs transition-colors shrink-0"
            >
              Lengkapi Sekarang
            </Link>
          </div>
        )}

        {/* E-KTA atau Kartu Peserta Dinamis */}
        <div className={`rounded-2xl p-6 text-white shadow-lg relative overflow-hidden ${
          isVerified ? 'bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950' : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950'
        }`}>
          <div className="absolute right-4 bottom-4 opacity-10 text-8xl font-mono font-bold tracking-tighter">
            PMII
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase bg-white/15 px-2.5 py-1 rounded-md backdrop-blur-xs">
                {isVerified ? 'E-KTA Resmi PMII' : 'Kartu Peserta MAPABA'}
              </span>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                isVerified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
              }`}>
                {isVerified ? 'Verified' : 'Pending / Proses'}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-wide">{kader.namaLengkap}</h2>
              <p className="text-xs font-mono text-slate-300 mt-0.5">
                {isVerified ? `NTA: ${kader.ktaNumber || 'Menunggu Generate'}` : 'Nomor Pendaftaran Aktif'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase tracking-wider">NIM / Prodi</span>
                <span className="font-medium text-slate-100">{kader.nim || '-'} | {kader.prodi}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase tracking-wider">Status / Jenjang</span>
                <span className="font-semibold text-amber-300">
                  {isVerified ? kader.jenjang : 'Peserta'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase tracking-wider">WhatsApp</span>
                <span className="font-mono text-slate-100">{kader.nomorHp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar 4 Tahap Verifikasi MAPABA (Hanya tampil jika BELUM SEMUA SELESAI) */}
        {!semuaTahapSelesai && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Status Tahapan Kaderisasi & Asesmen MAPABA</h3>
              <p className="text-xs text-slate-500">
                Selesaikan tahapan secara berurutan: Tunggu verifikasi admin untuk membuka tahap berikutnya.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              
              {/* Tahap 1: Berkas Administrasi */}
              <Link href="/portal/profil" className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all hover:border-blue-400 hover:shadow-xs group ${
                kader.isVerifiedBerkas ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold">1. Berkas Administrasi</span>
                  <span className="text-slate-400 group-hover:text-blue-600 transition-colors">↗</span>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-md w-fit font-semibold ${badgeColorBerkas}`}>
                  {labelStatusBerkas}
                </span>
              </Link>

              {/* Tahap 2: Pre-Test */}
              {kader.isVerifiedBerkas ? (
                <Link href="/portal/asesmen/pre-test" className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all hover:border-purple-400 hover:shadow-xs group ${
                  kader.isVerifiedPreTest ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-purple-50/40 border-purple-200 text-purple-900'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">2. Pre-Test</span>
                    <span className="text-slate-400 group-hover:text-purple-600 transition-colors">↗</span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-md w-fit font-semibold ${
                    kader.isVerifiedPreTest ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {kader.isVerifiedPreTest ? 'Selesai Diisi' : 'Mulai Asesmen'}
                  </span>
                </Link>
              ) : (
                <div className="p-4 rounded-xl border bg-slate-100/70 border-slate-200 text-slate-400 flex flex-col justify-between space-y-3 opacity-70 cursor-not-allowed">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">2. Pre-Test</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-md w-fit font-semibold bg-slate-200 text-slate-500">
                    Menunggu Verifikasi Berkas
                  </span>
                </div>
              )}

              {/* Tahap 3: Keikutsertaan MAPABA */}
              {kader.isVerifiedPreTest ? (
                <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  kader.isVerifiedMapaba ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">3. Keikutsertaan MAPABA</span>
                    <span className="text-slate-300">•</span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-md w-fit font-semibold ${
                    kader.isVerifiedMapaba ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {kader.isVerifiedMapaba ? 'Hadir & Mengikuti' : 'Menunggu Jadwal'}
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-xl border bg-slate-100/70 border-slate-200 text-slate-400 flex flex-col justify-between space-y-3 opacity-70 cursor-not-allowed">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">3. Keikutsertaan MAPABA</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-md w-fit font-semibold bg-slate-200 text-slate-500">
                    Menunggu Jadwal
                  </span>
                </div>
              )}

              {/* Tahap 4: Post-Test Pemetaan */}
              {kader.isVerifiedMapaba ? (
                <Link href="/portal/asesmen/post-test" className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all hover:border-purple-400 hover:shadow-xs group ${
                  kader.isVerifiedPostTest ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-purple-50/40 border-purple-200 text-purple-900'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">4. Post-Test Pemetaan</span>
                    <span className="text-slate-400 group-hover:text-purple-600 transition-colors">↗</span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-md w-fit font-semibold ${
                    kader.isVerifiedPostTest ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {kader.isVerifiedPostTest ? 'Selesai Diisi' : 'Mulai Asesmen'}
                  </span>
                </Link>
              ) : (
                <div className="p-4 rounded-xl border bg-slate-100/70 border-slate-200 text-slate-400 flex flex-col justify-between space-y-3 opacity-70 cursor-not-allowed">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">4. Post-Test Pemetaan</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-md w-fit font-semibold bg-slate-200 text-slate-500">
                    Menunggu
                  </span>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Grid Menu Portal Anggota */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/portal/profil"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-sm transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Profil & Administrasi</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Perbarui data diri, NIM, foto, dan berkas persyaratan secara mandiri.</p>
            </div>
          </Link>

          <Link
            href="/portal/logbook"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-purple-300 hover:shadow-sm transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Logbook Kaderisasi</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Pantau rekam jejak pelatihan formal dari MAPABA, PKD, hingga PKL.</p>
            </div>
          </Link>

          <Link
            href="/library"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-sm transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Gudang Materi (E-Library)</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Unduh modul wajib, Buku Biru, NDP, dan materi ke-PMII-an.</p>
            </div>
          </Link>
        </div>

      </div>
    </main>
  );
}