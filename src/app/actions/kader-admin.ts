'use server';

import { prisma } from '@/lib/prisma';
import { getAdminSession } from './auth';
import { revalidatePath } from 'next/cache';

// Mengambil daftar kader berdasarkan level login (Rayon vs Komisariat)
export async function getKaderListForAdmin() {
  try {
    const session = await getAdminSession();
    
    const rawData = await prisma.kader.findMany({
      include: {
        rayon: true,
        kaderisasiLogs: {
          orderBy: { tahun: 'desc' },
        },
      },
      orderBy: { namaLengkap: 'asc' },
    });

    if (!session) return rawData;

    const roleLower = (session.role || '').toLowerCase();
    const rayonName = (session.rayonName || '').toLowerCase();
    
    const isKomisariat = roleLower.includes('komisariat') || rayonName.includes('komisariat') || roleLower.includes('super_admin');

    // Jika Komisariat, tampilkan seluruh kader dari semua rayon
    if (isKomisariat) {
      return rawData;
    }

    // Jika Rayon, filter khusus kader yang rayonId-nya atau nama rayonnya cocok
    const keyword = rayonName.replace(/rayon/gi, '').trim();
    return rawData.filter((kader) => {
      const rName = (kader.rayon?.name || '').toLowerCase();
      return rName.includes(keyword);
    });

  } catch (error) {
    console.error('Error getKaderListForAdmin:', error);
    return [];
  }
}

// Memperbarui Posisi Kepengurusan Kader (Misal: Anggota -> Pengurus Rayon)
export async function updateKaderPosition(kaderId: string, posisiBaru: any) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, message: 'Akses ditolak.' };

    await prisma.kader.update({
      where: { id: kaderId },
      data: { posisi: posisiBaru },
    });

    revalidatePath('/admin/kader');
    return { success: true, message: 'Posisi kepengurusan kader berhasil diperbarui.' };
  } catch (error) {
    return { success: false, message: 'Gagal memperbarui posisi.' };
  }
}

// Menambahkan Riwayat Logbook Kaderisasi (MAPABA / PKD / PKL)
export async function addKaderisasiLog(data: {
  kaderId: string;
  jenjang: 'MAPABA' | 'PKD' | 'PKL';
  tahun: number;
  tempat?: string;
  sertifikatNo?: string;
  keterangan?: string;
}) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, message: 'Akses ditolak.' };

    await prisma.kaderisasiLog.create({
      data: {
        kaderId: data.kaderId,
        jenjang: data.jenjang,
        tahun: data.tahun,
        tempat: data.tempat,
        sertifikatNo: data.sertifikatNo,
        keterangan: data.keterangan,
      },
    });

    // Opsional: Update jenjang tertinggi kader di tabel utama
    await prisma.kader.update({
      where: { id: data.kaderId },
      data: { jenjang: data.jenjang },
    });

    revalidatePath('/admin/kader');
    return { success: true, message: 'Riwayat kaderisasi berhasil ditambahkan.' };
  } catch (error) {
    return { success: false, message: 'Gagal mencatat riwayat kaderisasi.' };
  }
}