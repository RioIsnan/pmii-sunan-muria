'use server';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getAnggotaSession } from './anggota-auth';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

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

    // Helper sederhana untuk menyimpan file upload ke folder public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (ktpFile && ktpFile.size > 0) {
      const ktpName = `${session.id}-ktp-${Date.now()}${path.extname(ktpFile.name)}`;
      const ktpBuffer = Buffer.from(await ktpFile.arrayBuffer());
      fs.writeFileSync(path.join(uploadDir, ktpName), ktpBuffer);
      ktpUrl = `/uploads/${ktpName}`;
    }

    if (ktmFile && ktmFile.size > 0) {
      const ktmName = `${session.id}-ktm-${Date.now()}${path.extname(ktmFile.name)}`;
      const ktmBuffer = Buffer.from(await ktmFile.arrayBuffer());
      fs.writeFileSync(path.join(uploadDir, ktmName), ktmBuffer);
      ktmUrl = `/uploads/${ktmName}`;
    }

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
  } catch (error) {
    console.error('Error updateAnggotaProfile:', error);
    return { success: false, message: 'Gagal memperbarui profil dan berkas.' };
  }
}