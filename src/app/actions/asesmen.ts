'use server';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAnggotaSession } from './anggota-auth';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function submitAsesmen(tipe: string, formData: FormData) {
  const kader = await getAnggotaSession();
  if (!kader) {
    redirect('/portal/login');
  }

  const tipeAsesmen = tipe.toUpperCase() === 'PRE-TEST' ? 'PRE_TEST' : 'POST_TEST';

  const p1 = formData.get('pilihan1') as string || '';
  const u1 = formData.get('uraian1') as string || '';
  const p2 = formData.get('pilihan2') as string || '';
  const u2 = formData.get('uraian2') as string || '';
  const p3 = formData.get('pilihan3') as string || '';
  const u3 = formData.get('uraian3') as string || '';
  const p4 = formData.get('pilihan4') as string || '';
  const u4 = formData.get('uraian4') as string || '';

  // Validasi minimal salah satu terisi per nomor
  if ((!p1 && !u1) || (!p2 && !u2) || (!p3 && !u3) || (!p4 && !u4)) {
    throw new Error('Mohon lengkapi seluruh pertanyaan.');
  }

  // Cek apakah data asesmen untuk kader & tipe ini sudah pernah ada
  const existing = await prisma.asesmenKader.findFirst({
    where: { kaderId: kader.id, tipeAsesmen },
  });

  if (existing) {
    await prisma.asesmenKader.update({
      where: { id: existing.id },
      data: {
        jawaban1: p1 || u1,
        uraian1: u1,
        jawaban2: p2 || u2,
        uraian2: u2,
        jawaban3: p3 || u3,
        uraian3: u3,
        jawaban4: p4 || u4,
        uraian4: u4,
      },
    });
  } else {
    await prisma.asesmenKader.create({
      data: {
        kaderId: kader.id,
        tipeAsesmen,
        jawaban1: p1 || u1,
        uraian1: u1,
        jawaban2: p2 || u2,
        uraian2: u2,
        jawaban3: p3 || u3,
        uraian3: u3,
        jawaban4: p4 || u4,
        uraian4: u4,
      },
    });
  }

  // Update status tahap verifikasi di tabel Kader
  if (tipeAsesmen === 'PRE_TEST') {
    await prisma.kader.update({
      where: { id: kader.id },
      data: { isVerifiedPreTest: true },
    });
  } else {
    await prisma.kader.update({
      where: { id: kader.id },
      data: { isVerifiedPostTest: true },
    });
  }

  revalidatePath('/portal');
  redirect('/portal');
}