import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { updateKaderVerification } from '@/app/actions/admin-verifikasi';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function DetailKaderAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const kaderId = resolvedParams.id;

  const kader = await prisma.kader.findUnique({
    where: { id: kaderId },
    include: {
      rayon: true,
      asesmen: true,
    },
  });

  if (!kader) {
    notFound();
  }

  // Server action handler untuk form submit centang verifikasi
  async function handleToggleVerification(formData: FormData) {
    'use server';
    const field = formData.get('field') as string;
    const currentVal = formData.get('currentVal') === 'true';
    await updateKaderVerification(kaderId, field, !currentVal);
    redirect(`/admin/kader/${kaderId}`);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              Panel Verifikasi Admin Komisariat
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-2">
              {kader.namaLengkap}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Rayon: {kader.rayon?.name || '-'} | Fakultas: {kader.fakultas} ({kader.prodi})
            </p>
          </div>
          <Link href="/admin/kader" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors">
            ← Kembali ke Daftar
          </Link>
        </div>

        {/* Status Kader & NTA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-slate-400 block">Status Akun Utama</span>
            <span className={`inline-block px-2.5 py-1 rounded-full font-bold ${
              kader.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {kader.status}
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-slate-400 block">Nomor Tanda Anggota (NTA)</span>
            <span className="font-mono font-bold text-slate-800">{kader.ktaNumber || 'Belum Digenerate (Selesaikan 4 Tahap)'}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-slate-400 block">Nomor WhatsApp</span>
            <span className="font-mono font-semibold text-slate-800">{kader.nomorHp}</span>
          </div>
        </div>

        {/* 4 Tahap Verifikasi Interaktif */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Validasi 4 Tahapan Kaderisasi MAPABA</h3>
            <p className="text-xs text-slate-500">Klik tombol verifikasi di bawah untuk mengubah status centang pada setiap tahapan kader.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Tahap 1: Berkas */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              kader.isVerifiedBerkas ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div>
                <span className="font-bold block">1. Berkas & Administrasi</span>
                <span className="text-[11px] text-slate-500">Cek KTP, KTM, dan data diri kader</span>
              </div>
              <form action={handleToggleVerification}>
                <input type="hidden" name="field" value="isVerifiedBerkas" />
                <input type="hidden" name="currentVal" value={kader.isVerifiedBerkas ? 'true' : 'false'} />
                <button type="submit" className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                  kader.isVerifiedBerkas ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}>
                  {kader.isVerifiedBerkas ? '✔ Terverifikasi' : 'Verifikasi Berkas'}
                </button>
              </form>
            </div>

            {/* Tahap 2: Pre-Test */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              kader.isVerifiedPreTest ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div>
                <span className="font-bold block">2. Pre-Test / Asesmen Potensi</span>
                <span className="text-[11px] text-slate-500">Pengisian motivasi & hobi awal</span>
              </div>
              <form action={handleToggleVerification}>
                <input type="hidden" name="field" value="isVerifiedPreTest" />
                <input type="hidden" name="currentVal" value={kader.isVerifiedPreTest ? 'true' : 'false'} />
                <button type="submit" className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                  kader.isVerifiedPreTest ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}>
                  {kader.isVerifiedPreTest ? '✔ Selesai' : 'Validasi Pre-Test'}
                </button>
              </form>
            </div>

            {/* Tahap 3: MAPABA */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              kader.isVerifiedMapaba ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div>
                <span className="font-bold block">3. Keikutsertaan MAPABA</span>
                <span className="text-[11px] text-slate-500">Kehadiran dan keikutsertaan acara inti</span>
              </div>
              <form action={handleToggleVerification}>
                <input type="hidden" name="field" value="isVerifiedMapaba" />
                <input type="hidden" name="currentVal" value={kader.isVerifiedMapaba ? 'true' : 'false'} />
                <button type="submit" className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                  kader.isVerifiedMapaba ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}>
                  {kader.isVerifiedMapaba ? '✔ Hadir & Ikut' : 'Validasi Kehadiran'}
                </button>
              </form>
            </div>

            {/* Tahap 4: Post-Test */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              kader.isVerifiedPostTest ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div>
                <span className="font-bold block">4. Post-Test Pemetaan</span>
                <span className="text-[11px] text-slate-500">Evaluasi & orientasi kader setelah bergabung</span>
              </div>
              <form action={handleToggleVerification}>
                <input type="hidden" name="field" value="isVerifiedPostTest" />
                <input type="hidden" name="currentVal" value={kader.isVerifiedPostTest ? 'true' : 'false'} />
                <button type="submit" className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                  kader.isVerifiedPostTest ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}>
                  {kader.isVerifiedPostTest ? '✔ Selesai' : 'Validasi Post-Test'}
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Hasil Asesmen Pemetaan Potensi (Pre-Test & Post-Test) dari Kader */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Hasil Pemetaan Potensi & Asesmen Kader</h3>
            <p className="text-xs text-slate-500">Data jawaban pre-test dan post-test yang diisi mandiri oleh kader.</p>
          </div>

          {kader.asesmen && kader.asesmen.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kader.asesmen.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px] border border-purple-200">
                      {item.tipeAsesmen}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 font-semibold block">1. Motivasi / Kesan:</span>
                      <p className="text-slate-800 font-medium">{item.jawaban1 || item.uraian1 || '-'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">2. Hobi / Penempatan Divisi:</span>
                      <p className="text-slate-800 font-medium">{item.jawaban2 || item.uraian2 || '-'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">3. Peran Kelompok / Orientasi Belajar:</span>
                      <p className="text-slate-800 font-medium">{item.jawaban3 || item.uraian3 || '-'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">4. Target / Komitmen Aksi Nyata:</span>
                      <p className="text-slate-800 font-medium">{item.jawaban4 || item.uraian4 || '-'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-500">
              Kader belum mengisi formulir asesmen Pre-Test / Post-Test.
            </div>
          )}
        </div>

        {/* Pratinjau Berkas Administrasi (KTP / KTM) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Berkas & Dokumen Persyaratan</h3>
            <p className="text-xs text-slate-500">Dokumen identitas yang diunggah oleh calon anggota.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 block">Scan / Foto KTP</span>
              {kader.ktpUrl ? (
                <a href={kader.ktpUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold underline block">
                  Lihat Dokumen KTP ↗
                </a>
              ) : (
                <span className="text-slate-400 italic">KTP belum diunggah</span>
              )}
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 block">Scan / Foto KTM (Kartu Tanda Mahasiswa)</span>
              {kader.ktmUrl ? (
                <a href={kader.ktmUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold underline block">
                  Lihat Dokumen KTM ↗
                </a>
              ) : (
                <span className="text-slate-400 italic">KTM belum diunggah</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}