'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getAnggotaProfile, daftarMagang } from '@/app/actions/anggota';
import { logoutAnggota } from '@/app/actions/anggota-auth';

export default function AnggotaDashboardPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  const fetchProfile = async () => {
    const data = await getAnggotaProfile();
    if (!data) {
      router.push('/portal/login');
      return;
    }
    setProfile(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  async function handleLogout() {
    await logoutAnggota();
    router.push('/portal/login');
  }

  async function handleMagangSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const res = await daftarMagang(formData);
      setMessage({ success: res.success, text: res.message });
      if (res.success) {
        fetchProfile();
      }
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-xs">
        Memuat data dashboard anggota...
      </div>
    );
  }

  const kader = profile?.kader;
  const magang = profile?.magang;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      {/* NAVBAR DASHBOARD */}
      <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="relative w-7 h-7">
            <Image src="/logo_pmii.png" alt="Logo" fill sizes="28px" className="object-contain" priority />
          </div>
          <div>
            <span className="font-bold text-xs sm:text-sm tracking-tight text-slate-900 block leading-none">
              PORTAL ANGGOTA PMII
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Komisariat Sunan Muria</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all cursor-pointer"
        >
          Keluar (Logout)
        </button>
      </header>

      {/* KONTEN UTAMA */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* BANNER SAMBUTAN */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="bg-blue-700/60 text-blue-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-400/30">
              Kader Terverifikasi
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold mt-2">Selamat Datang, {kader?.namaLengkap}!</h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              Asal Rayon: <span className="font-semibold text-white">{kader?.rayon?.name}</span> • Fakultas: {kader?.fakultas}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-right">
            <span className="text-[10px] text-blue-200 block uppercase font-bold">Nomor Tanda Anggota (NTA)</span>
            <span className="font-mono font-extrabold text-sm sm:text-base text-amber-300 tracking-wider">
              {kader?.ktaNumber || 'Menunggu Generate'}
            </span>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-xs font-semibold border ${message.success ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* KOLOM KIRI: KARTU E-KTA DIGITAL */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Kartu Tanda Anggota (E-KTA)</h2>
            
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-slate-800 relative overflow-hidden space-y-4">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6">
                    <Image src="/logo_pmii.png" alt="Logo" fill sizes="24px" className="object-contain" />
                  </div>
                  <span className="font-bold text-[11px] tracking-tight">PMII SUNAN MURIA</span>
                </div>
                <span className="text-[9px] font-mono bg-blue-900/80 text-blue-200 px-2 py-0.5 rounded border border-blue-700">
                  OFFICIAL ID
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Nama Lengkap</span>
                <p className="font-bold text-sm text-white">{kader?.namaLengkap}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Rayon</span>
                  <p className="font-medium text-slate-200 truncate">{kader?.rayon?.name}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Jenjang</span>
                  <p className="font-medium text-amber-300">{kader?.jenjang}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-500 block">NTA</span>
                  <span className="font-mono text-xs font-bold text-slate-300">{kader?.ktaNumber || '---'}</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 bg-emerald-950 text-emerald-400 font-bold rounded border border-emerald-800">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: MODUL PROGRAM MAGANG */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Modul Program Magang & Pengembangan Skill</h2>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
              {magang ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Status Pendaftaran Magang</span>
                      <h3 className="font-bold text-base text-slate-900 mt-0.5">Pilihan: {magang.minatKeahlian}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      magang.status === 'DITERIMA' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      magang.status === 'DITOLAK' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {magang.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <div>
                      <span className="font-bold text-slate-700">Pengalaman / Portofolio:</span>
                      <p className="text-slate-500 mt-0.5">{magang.pengalaman || 'Tidak ada catatan pengalaman.'}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="font-bold text-slate-700">Motivasi Mengikuti Magang:</span>
                      <p className="text-slate-500 mt-0.5">{magang.motivasi}</p>
                    </div>
                    {magang.catatanAdmin && (
                      <div className="pt-2 border-t border-slate-200/60 text-blue-700">
                        <span className="font-bold">Catatan dari Pengurus:</span>
                        <p className="mt-0.5">{magang.catatanAdmin}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 italic">
                    *Pendaftaran magang kamu sedang ditinjau oleh tim pengurus komisariat/rayon. Kamu akan dihubungi jika lolos seleksi tahap awal.
                  </p>
                </div>
              ) : (
                <form action={handleMagangSubmit} className="space-y-4 text-xs">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm">Formulir Pendaftaran Program Magang Organisasi</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Pilih bidang keahlian dan kembangkan potensimu bersama tim media & digital komisariat.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                      Minat Keahlian / Divisi Magang
                    </label>
                    <select
                      name="minatKeahlian"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="">-- Pilih Bidang Keahlian --</option>
                      <option value="Desain Grafis & Video Editing (Canva/CapCut)">Desain Grafis & Video Editing (Canva/CapCut)</option>
                      <option value="Web Development & IT Support">Web Development & IT Support</option>
                      <option value="Administrasi & Kesekretariatan">Administrasi & Kesekretariatan</option>
                      <option value="Digital Marketing & Affiliate Content">Digital Marketing & Affiliate Content</option>
                      <option value="Jurnalistik & Penulisan Berita">Jurnalistik & Penulisan Berita</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                      Pengalaman / Portofolio Singkat (Opsional)
                    </label>
                    <input
                      type="text"
                      name="pengalaman"
                      placeholder="Contoh: Pernah membuat desain banner acara atau mengelola web sederhana"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                      Motivasi Mengikuti Program Magang
                    </label>
                    <textarea
                      name="motivasi"
                      required
                      rows={3}
                      placeholder="Jelaskan alasan dan apa yang ingin kamu pelajari..."
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isPending ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran Magang'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}