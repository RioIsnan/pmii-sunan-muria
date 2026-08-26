'use server';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { revalidatePath } from 'next/cache';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function updateKaderVerification(kaderId: string, field: string, value: boolean) {
  try {
    // Ambil data kader saat ini terlebih dahulu
    const currentKader = await prisma.kader.findUnique({
      where: { id: kaderId },
    });

    if (!currentKader) {
      return { success: false, message: 'Kader tidak ditemukan.' };
    }

    // Update status field verifikasi yang dipilih oleh admin
    const updatedData: any = { [field]: value };

    // Cek apakah setelah update ini, ke-4 tahapan menjadi true semua
    const nextBerkas = field === 'isVerifiedBerkas' ? value : currentKader.isVerifiedBerkas;
    const nextPreTest = field === 'isVerifiedPreTest' ? value : currentKader.isVerifiedPreTest;
    const nextMapaba = field === 'isVerifiedMapaba' ? value : currentKader.isVerifiedMapaba;
    const nextPostTest = field === 'isVerifiedPostTest' ? value : currentKader.isVerifiedPostTest;

    const isAllCompleted = nextBerkas && nextPreTest && nextMapaba && nextPostTest;

    if (isAllCompleted) {
      updatedData.status = 'VERIFIED';
      // Jika belum punya KTA, generate nomor KTA resmi otomatis
      if (!currentKader.ktaNumber) {
        const randomCode = Math.floor(100000 + Math.random() * 900000);
        updatedData.ktaNumber = `PMII-SM-${new Date().getFullYear()}-${randomCode}`;
      }
    } else {
      // Jika ada yang belum lengkap, kembalikan status ke PENDING
      updatedData.status = 'PENDING';
    }

    await prisma.kader.update({
      where: { id: kaderId },
      data: updatedData,
    });

    revalidatePath('/admin/database-kader');
    return { success: true, message: 'Status verifikasi berhasil diperbarui!' };
  } catch (error) {
    console.error('Error updateKaderVerification:', error);
    return { success: false, message: 'Gagal memperbarui status verifikasi.' };
  }
}