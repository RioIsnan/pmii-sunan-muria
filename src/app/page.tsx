import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { getRayonList } from '@/app/actions/kader';
import { getBeritaList, getAgendaList } from '@/app/actions/cms';
import { getLibraryMateriList } from '@/app/actions/library';
import LibraryCard from '@/components/LibraryCard';

export default async function HomePage() {
  const rayons = await getRayonList();
  const beritas = await getBeritaList();
  const agendas = await getAgendaList();
  const materiList = await getLibraryMateriList();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-grow pt-16 sm:pt-20">
        
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden bg-white border-b border-slate-200 py-12 sm:py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              
              {/* Kolom Kiri: Logo Siluet dengan Efek Timbul ke Depan Saat Diarahkan Kursor (Tanpa Miring) */}
              <div className="hidden lg:flex lg:col-span-5 justify-center items-center relative">
                <div 
                  className="w-[420px] h-[420px] bg-no-repeat bg-contain opacity-100 filter contrast-125 brightness-105 drop-shadow-[0_10px_20px_rgba(30,58,138,0.15)] transition-all duration-500 ease-out hover:scale-110 hover:drop-shadow-[0_25px_35px_rgba(30,58,138,0.3)] hover:brightness-110 cursor-pointer"
                  style={{ backgroundImage: "url('/logo_pmii.png')" }}
                ></div>
              </div>

              {/* Kolom Kanan: Teks & Tombol */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold shadow-xs transition-all duration-300 hover:scale-105">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                  Pendaftaran Mapaba & Portal Anggota Dibuka
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  PORTAL PMII <span className="text-blue-700">PERGERAKAN MAHASISWA ISLAM INDONESIA</span>
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-light">
                  Portal resmi Pergerakan Mahasiswa Islam Indonesia (PMII) Komisariat Sunan Muria. Wadah pengembangan intelektual, kepemimpinan, e-KTA digital, arsip surat, kas organisasi, hingga program magang kader.
                </p>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link
                    href="/daftar"
                    className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl text-center transition-all duration-300 shadow-md shadow-blue-700/20 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
                  >
                    Daftar MAPABA Sekarang
                  </Link>
                  <Link
                    href="/portal/login"
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl text-center transition-all duration-300 shadow-md flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-lg"
                  >
                    Login Portal Anggota
                  </Link>
                  <Link
                    href="#profil"
                    className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl text-center transition-all duration-300 shadow-xs hover:-translate-y-1"
                  >
                    Pelajari Lebih Lanjut
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ================= STATISTIK ORGANISASI BAR ================= */}
        <section className="border-b border-slate-200 bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="space-y-1 pt-2 md:pt-0 transition-transform duration-300 hover:scale-110 cursor-default">
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900">5</span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Rayon</span>
              </div>
              <div className="space-y-1 pt-2 md:pt-0 transition-transform duration-300 hover:scale-110 cursor-default">
                <span className="block text-2xl sm:text-3xl font-extrabold text-blue-700">100%</span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Digitalisasi E-KTA</span>
              </div>
              <div className="space-y-1 pt-2 md:pt-0 transition-transform duration-300 hover:scale-110 cursor-default">
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900">Aswaja</span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Haluan Ideologi</span>
              </div>
              <div className="space-y-1 pt-2 md:pt-0 transition-transform duration-300 hover:scale-110 cursor-default">
                <span className="block text-2xl sm:text-3xl font-extrabold text-blue-700">UMK</span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Universitas Muria Kudus</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= AGENDA KEGIATAN MENDATANG ================= */}
        {agendas.length > 0 && (
          <section className="py-12 sm:py-16 bg-blue-950 text-white border-b border-blue-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Kalender Kegiatan
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Agenda Mendatang PMII Sunan Muria
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {agendas.map((item) => (
                  <div
                    key={item.id}
                    className="bg-blue-900/50 border border-blue-800/80 p-5 rounded-2xl space-y-2.5 backdrop-blur-xs transition-all duration-300 hover:bg-blue-900 hover:-translate-y-2 hover:shadow-xl hover:border-amber-400/50"
                  >
                    <span className="inline-block text-[10px] font-mono font-bold px-2.5 py-1 bg-amber-400 text-slate-950 rounded-md">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">{item.judul}</h3>
                    <p className="text-xs text-blue-200 flex items-center gap-1.5 font-medium">
                      📍 {item.lokasi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================= PROFIL & TRILOGI PMII ================= */}
        <section id="profil" className="py-16 sm:py-24 border-b border-slate-200 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-16 items-start">
              
              <div className="space-y-3">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                  Tentang Kami
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  PMII Komisariat Sunan Muria
                </h2>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                  Terbentuknya pribadi Muslim Indonesia yang bertakwa kepada Allah SWT, berbudi luhur, berilmu, cakap, dan bertanggung jawab dalam mengamalkan ilmunya, serta berkomitmen memperjuangkan cita-cita kemerdekaan Indonesia
                </p>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-xs transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-300">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs transition-transform duration-300 hover:scale-110">
                    01
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Tri Motto</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dzikir, Fikir, dan Amal Sholeh. <br />Tiga pilar utama yang menjadi landasan pergerakan mahasiswa Islam Indonesia dalam mengembangkan diri dan berkontribusi bagi masyarakat.
                  </p>
                </div>
                
                <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-xs transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-300">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs transition-transform duration-300 hover:scale-110">
                    02
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Tri Komitmen</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                   Kejujuran, Kebenaran, dan Keadilan. <br />Komitmen moral yang menjadi pedoman kader PMII dalam bersikap, bertindak, dan berinteraksi di lingkungan kampus maupun masyarakat.
                  </p>
                </div>
                <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-xs transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-300">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs transition-transform duration-300 hover:scale-110">
                    03
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Tri Khidmat</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                   Taqwa, Intelektual, dan Profesional. <br />Tiga bentuk pengabdian yang menjadi tujuan akhir kader PMII dalam mengamalkan ilmunya untuk kemaslahatan umat dan bangsa.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= ROADMAP / ALUR MAPABA ================= */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                Roadmap Pengkaderan
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Alur Pendaftaran MAPABA
              </h2>
              <p className="text-xs sm:text-slate-600">Empat langkah transparan untuk resmi bergabung bersama pergerakan.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-white hover:border-blue-300">
                <span className="text-blue-700 font-mono font-bold text-base">01</span>
                <h3 className="font-bold text-slate-900 text-sm">Daftar Akun & Berkas</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Buat akun portal mandiri, isi data diri, dan pemberkasan.</p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-white hover:border-blue-300">
                <span className="text-blue-700 font-mono font-bold text-base">02</span>
                <h3 className="font-bold text-slate-900 text-sm">Pre-Test & Asesmen</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Selesaikan pengisian pengenalan diri dan motivasi awal.</p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-white hover:border-blue-300">
                <span className="text-blue-700 font-mono font-bold text-base">03</span>
                <h3 className="font-bold text-slate-900 text-sm">Ikuti Forum MAPABA</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Ikuti rangkaian acara Masa Penerimaan Anggota Baru yang diselenggarakan.</p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-white hover:border-blue-300">
                <span className="text-blue-700 font-mono font-bold text-base">04</span>
                <h3 className="font-bold text-slate-900 text-sm">Post-Test & E-KTA</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Selesaikan evaluasi akhir pasca-acara dan aktifkan E-KTA resmi PMII.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BERITA & PUBLIKASI ================= */}
        {beritas.length > 0 && (
          <section id="berita" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                  Kabar Pergerakan
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Berita & Informasi Terkini
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {beritas.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between shadow-xs transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-300"
                  >
                    <div className="space-y-3">
                      <span className="text-[11px] font-semibold text-slate-400 block">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {item.judul}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {item.konten}
                      </p>
                    </div>
                    <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Penulis: {item.penulis}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================= RAYON SECTION ================= */}
        <section id="rayon" className="py-20 sm:py-28 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Struktur Organisasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Rayon Dalam Naungan Komisariat
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                Pilih basis rayon sesuai dengan rumpun fakultas Anda di Universitas Muria Kudus.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rayons.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between transition-all duration-300 hover:bg-white hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2.5 group cursor-pointer"
                >
                  <div className="space-y-3">
                    <span className="inline-block text-[10px] font-bold px-2.5 py-1 bg-blue-100/70 text-blue-800 border border-blue-200 rounded-md uppercase tracking-wider">
                      {item.code}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 flex items-center gap-1 transition-transform group-hover:translate-x-1">
                      Daftar MAPABA →
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ================= E-LIBRARY SECTION ================= */}
        {materiList.length > 0 && (
          <section id="library" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="max-w-2xl space-y-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                  Perpustakaan Digital Internal
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  E-Library & Gudang Materi PMII
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Unduh modul wajib pengkaderan, literasi NDP, ke-Aswaja-an, dan panduan organisasi secara gratis bagi seluruh kader.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materiList.map((materi) => (
                  <LibraryCard key={materi.id} materi={materi} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================= FAQ / PERTANYAAN UMUM ================= */}
        <section id="faq" className="py-16 sm:py-24 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Pertanyaan yang Sering Diajukan
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 transition-all duration-300 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1">
                <h3 className="font-bold text-slate-900 text-base">Apakah PMII itu organisasi politik?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Tidak, Orang sering mengira PMII adalah partai politik. Padahal, PMII adalah organisasi kemahasiswaan independen yang fokus pada kaderisasi dan pengembangan diri.
                </p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 transition-all duration-300 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1">
                <h3 className="font-bold text-slate-900 text-base">Apa saja kegiatan anak PMII?</h3>
                <p className="text-slate-600 leading-relaxed">
                 Orang awam sering penasaran apa yang dilakukan selain kuliah. Kegiatan utamanya meliputi pengembangan skill, keilmuan fakultatif, diskusi, pelatihan kepemimpinan, aksi sosial, dan kajian keagamaan.
                </p>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 transition-all duration-300 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1">
                <h3 className="font-bold text-slate-900 text-base">Apa keuntungan ikut PMII?</h3>
                <p className="text-slate-600 leading-relaxed">
                 Banyak yang bertanya apa manfaatnya untuk masa depan. Ikut PMII melatih public speaking, memperluas jaringan pertemanan, dan membentuk mental kepemimpinan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= KONTAK & BASECAMP SECTION ================= */}
        <section id="kontak" className="py-16 sm:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                Sekretariat & Layanan
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Hubungi & Kunjungi Kami
              </h2>
              <p className="text-xs sm:text-slate-600">Silakan hubungi narahubung kami atau berkunjung langsung ke basecamp komisariat.</p>
            </div>

            {/* Kotakan Utama Informasi Kontak */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Kartu 1: Lokasi Basecamp */}
              <a 
                href="https://www.google.com/maps/place/Komisariat+Sunan+Muria/@-6.7960379,110.8685585,20.61z/data=!4m6!3m5!1s0x2e70c50000b2fac1:0x34e84dc7434fb874!8m2!3d-6.7959705!4d110.8688244!16s%2Fg%2F11yvf6d0mr?entry=ttu&g_ep=EgoyMDI2MDgyMy4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs flex flex-col justify-between hover:border-blue-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Sekretariat PMII Sunan Muria</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sekretariat Komisariat PMII Sunan Muria <br />
                    Gg. Mawar, Kepyar, Dersalam, Kec. Bae, Kabupaten Kudus, Jawa Tengah 59321
                  </p>
                </div>
                {/* <span className="text-xs font-bold text-blue-700 transition-transform group-hover:translate-x-1">
                  Buka di Google Maps →
                </span> */}
              </a>

              {/* Kartu 2: Email Resmi */}
              <a 
                href="mailto:pmiisunanmuria@gmail.com" 
                className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs flex flex-col justify-between hover:border-blue-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Email Resmi</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Kirimkan surat resmi atau kerja sama organisasi melalui email kami:
                  </p>
                  <span className="block text-xs font-bold text-blue-700">
                    pmiisunanmuriakudus@gmail.com
                  </span>
                </div>
                {/* <span className="text-xs font-bold text-blue-700 transition-transform group-hover:translate-x-1">
                  Kirim Email Sekarang →
                </span> */}
              </a>

              {/* Kartu 3: WhatsApp Center */}
              <a 
                href="https://wa.me/6285225288985?text=Halo%20Pengurus%20PMII%20Sunan%20Muria,%20saya%20ingin%20bertanya%20seputar%20pendaftaran%20Mapaba." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs flex flex-col justify-between hover:border-emerald-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">WhatsApp Center</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Informasi seputar pendaftaran Mapaba & keorganisasian:
                  </p>
                  <span className="block text-xs font-bold text-emerald-700">
                    +62 852-2528-8985
                  </span>
                </div>
                {/* <span className="text-xs font-bold text-emerald-700 transition-transform group-hover:translate-x-1">
                  Chat WhatsApp Langsung →
                </span> */}
              </a>

            </div>

            {/* Pratinjau Peta Lokasi (Google Maps Embed Stabil Tanpa Animasi Potong) */}
            <div className="w-full bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="w-full h-[350px] sm:h-[400px] rounded-xl overflow-hidden">
                <iframe
                  title="Peta Lokasi Komisariat Sunan Muria"
                  src="https://maps.google.com/maps?q=-6.7959705,110.8688244&z=18&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-10 hover:grayscale-0 transition-all duration-500"
                ></iframe>
              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}