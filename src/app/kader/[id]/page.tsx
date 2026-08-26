import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function KtaDigitalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const kader = await prisma.kader.findUnique({
    where: { id },
    include: { rayon: true },
  });

  if (!kader || kader.status !== 'VERIFIED') {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full space-y-6">
        
        {/* Tombol Navigasi Top */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-blue-700 transition-colors">
            ← Kembali ke Beranda
          </Link>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px]">
            E-KTA Resmi Active
          </span>
        </div>

        {/* TAMPILAN KARTU ANGGOTA (E-KTA) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden relative">
          
          {/* Header Kartu */}
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 shrink-0">
                <Image
                  src="/logo_pmii.png"
                  alt="Logo PMII"
                  fill
                  sizes="36px"
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h2 className="font-bold text-xs tracking-wider uppercase text-amber-400">
                  Kartu Tanda Anggota
                </h2>
                <p className="text-[11px] font-semibold text-slate-200 leading-none mt-0.5">
                  PMII SUNAN MURIA
                </p>
                <p className="text-[9px] text-slate-400">Universitas Muria Kudus</p>
              </div>
            </div>
          </div>

          {/* Body Kartu */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">
                  Nomor Tanda Anggota (NTA)
                </span>
                <span className="font-mono text-sm font-bold text-blue-700">
                  {kader.ktaNumber || 'KTA-PENDING'}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 uppercase">
                {kader.rayon?.code}
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                  Nama Lengkap
                </span>
                <span className="font-bold text-slate-900 text-base">
                  {kader.namaLengkap}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                    Fakultas
                  </span>
                  <span className="font-medium text-slate-800">
                    {kader.fakultas}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                    Program Studi
                  </span>
                  <span className="font-medium text-slate-800">
                    {kader.prodi}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                  Rayon Naungan
                </span>
                <span className="font-semibold text-slate-900">
                  {kader.rayon?.name}
                </span>
              </div>
            </div>

            {/* Footer Verifikasi QR */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 -mx-6 -mb-6 p-4">
              <div className="text-[10px] text-slate-500 space-y-0.5">
                <p className="font-semibold text-slate-700">Terverifikasi Sistem</p>
                <p>PMII Komisariat Sunan Muria Kudus</p>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-200">
                <span className="font-mono text-[9px] font-bold text-slate-400">
                  [QR VERIFIED]
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}