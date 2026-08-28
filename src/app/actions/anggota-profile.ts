'use server';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getAnggotaSession } from './anggota-auth';
import { revalidatePath } from 'next/cache';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function updateAnggotaProfile(formData: FormData) {
  const session = await getAnggotaSession();
  if (!session) {
    return { success: false, message: 'Akses ditolak. Silakan login ulang.' };
  }

  const nim = formData.get('nim') as string;
  const nomorHp = formData.get('nomorHp') as string;
  const prodi = formData.get('prodi') as string;
  const fakultas = formData.get('fakultas') as string;
  const alamat = formData.get('alamat') as string;
  const tanggalLahirStr = formData.get('tanggalLahir') as string;

  const ktpFile = formData.get('ktp') as File | null;
  const ktmFile = formData.get('ktm') as File | null;

  if (!nomorHp || !prodi || !fakultas || !alamat) {
    return { success: false, message: 'Nomor HP, Prodi, Fakultas, dan Alamat wajib diisi.' };
  }

  try {
    let ktpUrl = undefined;
    let ktmUrl = undefined;

    // Batasan maksimal ukuran file 2MB (2 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    // 1. Proses File KTP & Batasi Ukurannya
    if (ktpFile && ktpFile.size > 0) {
      if (ktpFile.size > MAX_FILE_SIZE) {
        return { success: false, message: 'Ukuran file KTP terlalu besar! Maksimal 2MB.' };
      }
      const arrayBuffer = await ktpFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      ktpUrl = `data:${ktpFile.type};base64,${buffer.toString('base64')}`;
    }

    // 2. Proses File KTM & Batasi Ukurannya
    if (ktmFile && ktmFile.size > 0) {
      if (ktmFile.size > MAX_FILE_SIZE) {
        return { success: false, message: 'Ukuran file KTM terlalu besar! Maksimal 2MB.' };
      }
      const arrayBuffer = await ktmFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      ktmUrl = `data:${ktmFile.type};base64,${buffer.toString('base64')}`;
    }

    // 3. Simpan data teks dan file (Base64) ke Database via Prisma
    await prisma.kader.update({
      where: { id: session.id },
      data: {
        nim: nim || null,
        nomorHp,
        prodi,
        fakultas,
        alamat,
        tanggalLahir: tanggalLahirStr ? new Date(tanggalLahirStr) : null,
        ...(ktpUrl && { ktpUrl }),
        ...(ktmUrl && { ktmUrl }),
        isProfileComplete: true,
      },
    });

    revalidatePath('/portal');
    return { success: true, message: 'Data pemberkasan dan dokumen berhasil disimpan!' };
  } catch (error: any) {
    console.error('Error updateAnggotaProfile:', error);
    return { success: false, message: `Gagal: ${error.message || JSON.stringify(error)}` };
  }
}