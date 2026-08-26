import { getAnggotaSession } from '@/app/actions/anggota-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { submitAsesmen } from '@/app/actions/asesmen';

export default async function FormAsesmenPage({ params }: { params: Promise<{ tipe: string }> }) {
  const resolvedParams = await params;
  const tipe = resolvedParams.tipe; // 'pre-test' atau 'post-test'
  const kader = await getAnggotaSession();

  if (!kader) {
    redirect('/portal/login');
  }

  const isPreTest = tipe === 'pre-test';

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header Nav */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              {isPreTest ? 'Tahap 2: Pre-Test MAPABA' : 'Tahap 4: Post-Test Pemetaan'}
            </span>
            <h1 className="text-base font-bold text-slate-900 mt-1">
              {isPreTest ? 'Kenalan & Petakan Potensimu Yuk!' : 'Evaluasi & Arah Gerakmu di PMII'}
            </h1>
          </div>
          <Link href="/portal" className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl transition-colors">
            ← Kembali
          </Link>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900 leading-relaxed space-y-1">
          <span className="font-bold block">💡 Petunjuk Pengisian:</span>
          <p>
            Kamu bisa memilih salah satu opsi pilihan ganda <b>ATAU</b> menuliskan jawaban sendiri pada kolom uraian di bawahnya. Pastikan setiap nomor terisi ya!
          </p>
        </div>

        {/* Form Utama */}
        <form action={submitAsesmen.bind(null, tipe)} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
          
          {/* ================= PRE-TEST ================= */}
          {isPreTest ? (
            <>
              {/* Soal 1 */}
              <div className="space-y-3 pb-6 border-b border-slate-100">
                <label className="text-xs font-bold text-slate-900 block leading-snug">
                  1. Apa motivasi atau alasan utama kamu tertarik gabung PMII? <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2 text-xs">
                  {[
                    'Ingin memperluas relasi, pertemanan, dan jaringan pergaulan positif.',
                    'Ingin belajar organisasi, kepemimpinan, dan jago ngomong di depan umum (public speaking).',
                    'Ingin memperdalam ilmu keislaman (Ahlussunnah wal Jamaah) & nasionalisme.',
                    'Ingin mengasah skill khusus (IT, media kreatif, desain, atau bisnis).',
                    'Ajakan dari teman atau rekomendasi senior.',
                  ].map((opt, idx) => (
                    <label key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200/60 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="radio" name="pilihan1" value={opt} className="mt-0.5 text-blue-600 focus:ring-blue-500" />
                      <span className="text-slate-700">{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 block mb-1 font-medium">Atau tuliskan alasan versimu sendiri:</span>
                  <input type="text" name="uraian1" placeholder="Tuliskan jawabanmu di sini..." className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs" />
                </div>
              </div>

              {/* Soal 2 */}
              <div className="space-y-3 pb-6 border-b border-slate-100">
                <label className="text-xs font-bold text-slate-900 block leading-snug">
                  2. Aktivitas atau hobi apa yang paling sering kamu lakukan di waktu luang? <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2 text-xs">
                  {[
                    'Nongkrong seru sambil diskusi santai atau ngobrolin isu-isu hangat.',
                    'Aktif bikin konten sosmed, desain grafis, atau ngedit video.',
                    'Suka baca buku, nulis esai, atau kepoin berita terbaru.',
                    'Ikut kegiatan sosial, komunitas hobi, atau organisasi luar.',
                    'Suka ngulik teknologi, coding, atau proyek kreatif digital.',
                  ].map((opt, idx) => (
                    <label key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200/60 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="radio" name="pilihan2" value={opt} className="mt-0.5 text-blue-600 focus:ring-blue-500" />
                      <span className="text-slate-700">{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 block mb-1 font-medium">Atau tuliskan hobi versimu sendiri:</span>
                  <input type="text" name="uraian2" placeholder="Tuliskan jawabanmu di sini..." className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs" />
                </div>
              </div>

              {/* Soal 3 */}
              <div className="space-y-3 pb-6 border-b border-slate-100">
                <label className="text-xs font-bold text-slate-900 block leading-snug">
                  3. Saat ada tugas kelompok kuliah, biasanya kamu tipe yang mana? <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2 text-xs">
                  {[
                    'Jadi ketua/koordinator yang bagi-bagi tugas ke teman tim.',
                    'Fokus nyari materi, bikin makalah, atau menyusun laporan teks.',
                    'Bikin slide presentasi, desain visual, atau rapihin dokumen.',
                    'Maju ke depan buat presentasi dan jelasin hasil kerja kelompok.',
                    'Ikut ngerjain apa aja sesuai kebutuhan tim secara fleksibel.',
                  ].map((opt, idx) => (
                    <label key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200/60 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="radio" name="pilihan3" value={opt} className="mt-0.5 text-blue-600 focus:ring-blue-500" />
                      <span className="text-slate-700">{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 block mb-1 font-medium">Atau tuliskan peran versimu sendiri:</span>
                  <input type="text" name="uraian3" placeholder="Tuliskan jawabanmu di sini..." className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs" />
                </div>
              </div>

              {/* Soal 4 */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-900 block leading-snug">
                  4. Apa target utama yang ingin kamu capai selama 1 tahun ke depan di kampus? <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2 text-xs">
                  {[
                    'Punya banyak teman lintas jurusan dan senior yang asik & suportif.',
                    'Jago skill baru yang gak diajarin di dalam kelas kuliah.',
                    'Lebih pede ngomong di depan umum dan aktif berorganisasi.',
                    'Numpuk pengalaman & portofolio keren buat modal lulus kuliah nanti.',
                  ].map((opt, idx) => (
                    <label key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200/60 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="radio" name="pilihan4" value={opt} className="mt-0.5 text-blue-600 focus:ring-blue-500" />
                      <span className="text-slate-700">{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 block mb-1 font-medium">Atau tuliskan target versimu sendiri:</span>
                  <input type="text" name="uraian4" placeholder="Tuliskan jawabanmu di sini..." className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs" />
                </div>
              </div>
            </>
          ) : (
            /* ================= POST-TEST ================= */
            <>
              {/* Soal 1 */}
              <div className="space-y-3 pb-6 border-b border-slate-100">
                <label className="text-xs font-bold text-slate-900 block leading-snug">
                  1. Gimana kesan kamu setelah ikutan rangkaian acara MAPABA? <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2 text-xs">
                  {[
                    'Seru banget, asik, dan ngebuka cara pandang baru soal dunia mahasiswa.',
                    'Cukup ngebuka wawasan, walau masih perlu banyak belajar lagi.',
                    'Dapet banyak temen baru dari berbagai fakultas yang solid.',
                    'Jadi titik awal yang pas banget buat mulai berproses di pergerakan.',
                  ].map((opt, idx) => (
                    <label key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200/60 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="radio" name="pilihan1" value={opt} className="mt-0.5 text-blue-600 focus:ring-blue-500" />
                      <span className="text-slate-700">{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 block mb-1 font-medium">Atau tuliskan kesan versimu sendiri:</span>
                  <input type="text" name="uraian1" placeholder="Tuliskan jawabanmu di sini..." className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs" />
                </div>
              </div>

              {/* Soal 2 */}
              <div className="space-y-3 pb-6 border-b border-slate-100">
                <label className="text-xs font-bold text-slate-900 block leading-snug">
                  2. Kalau dikasih kesempatan aktif di pengurusan, kamu pengen ditempatkan di bagian mana? <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2 text-xs">
                  {[
                    'Biro Kaderisasi & Organisasi (Ngurusin database, data anggota & alur kaderisasi).',
                    'Lembaga Pers & Media Kreatif (Ngurusin sosmed, desain grafis, video, & publikasi).',
                    'Lembaga Kajian & Diskusi (Bikin bedah buku, diskusi isu kampus, & pelatihan ilmiah).',
                    'Lembaga Kewirausahaan (Ngurusin bisnis kreatif, jualan atribut, & kemandirian ekonomi).',
                  ].map((opt, idx) => (
                    <label key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200/60 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="radio" name="pilihan2" value={opt} className="mt-0.5 text-blue-600 focus:ring-blue-500" />
                      <span className="text-slate-700">{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 block mb-1 font-medium">Atau tuliskan divisi impian versimu sendiri:</span>
                  <input type="text" name="uraian2" placeholder="Tuliskan jawabanmu di sini..." className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs" />
                </div>
              </div>

              {/* Soal 3 (Orientasi - Uraian Wajib) */}
              <div className="space-y-3 pb-6 border-b border-slate-100">
                <label className="text-xs font-bold text-slate-900 block leading-snug">
                  3. Setelah resmi gabung PMII, apa sih hal yang paling pengen kamu pelajari, tekuni, dan minati? <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Ceritain dong apa orientasi atau tujuan jangka panjang yang pengen kamu capai selama berproses di PMII.
                </p>
                <textarea 
                  name="pilihan3" 
                  rows={4} 
                  placeholder="Tuliskan orientasi dan tujuanmu di sini..." 
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                ></textarea>
                <input type="hidden" name="uraian3" value="" />
              </div>

              {/* Soal 4 (Komitmen - Uraian Wajib) */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-900 block leading-snug">
                  4. Komitmen Aksi Nyata (Satu Kalimat Semangat) <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Tuliskan satu kata, kalimat semangat, atau komitmen kamu buat langkah awal jadi Kader Pergerakan!
                </p>
                <input 
                  type="text" 
                  name="pilihan4" 
                  placeholder="Contoh: Yakin Usaha Sampai, siap berproses bersama PMII!" 
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs" 
                />
                <input type="hidden" name="uraian4" value="" />
              </div>
            </>
          )}

          {/* Tombol Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Kirim Jawaban & Selesaikan Tahap Ini 🚀
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Pastikan menjawab setiap nomor melalui pilihan ganda atau kolom uraian.
            </p>
          </div>

        </form>

      </div>
    </main>
  );
}