'use server';

import { prisma } from '@/lib/prisma';
import { getAdminSession } from './auth';
import { revalidatePath } from 'next/cache';

export async function getMagangListForAdmin() {
  try {
    const session = await getAdminSession();
    
    const rawData = await prisma.magangApplication.findMany({
      include: {
        anggotaUser: {
          include: {
            kader: {
              include: {
                rayon: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = rawData.map((item) => ({
      id: item.id,
      namaLengkap: item.anggotaUser?.kader?.namaLengkap || 'Tanpa Nama',
      asalRayon: item.anggotaUser?.kader?.rayon?.name || 'Rayon Tidak Diketahui',
      noWhatsapp: item.anggotaUser?.kader?.nomorHp || '-',
      divisiTujuan: item.minatKeahlian || 'Umum',
      pengalaman: item.pengalaman,
      motivasi: item.motivasi,
      status: item.status,
      createdAt: item.createdAt,
    }));

    if (!session) return data;

    const roleLower = (session.role || '').toLowerCase();
    const rayonName = (session.rayonName || '').toLowerCase();
    
    const isKomisariat = roleLower.includes('komisariat') || rayonName.includes('komisariat') || roleLower.includes('super_admin');

    if (isKomisariat) {
      return data;
    }

    // Filter ketat berdasarkan nama rayon yang aktif login
    return data.filter((item) => {
      const itemRayon = (item.asalRayon || '').toLowerCase();
      // Contoh: Jika login "Rayon Pertanian", maka item rayon harus mengandung kata "pertanian"
      const keyword = rayonName.replace(/rayon/gi, '').trim();
      return itemRayon.includes(keyword);
    });

  } catch (error) {
    console.error('Error getMagangListForAdmin:', error);
    return [];
  }
}

export async function approveByRayon(id: string) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, message: 'Akses ditolak.' };

    await prisma.magangApplication.update({
      where: { id },
      data: { status: 'DITINJAU' },
    });

    revalidatePath('/admin/magang');
    return { success: true, message: 'Pendaftaran magang disetujui oleh Rayon. Menunggu verifikasi final Komisariat.' };
  } catch (error) {
    return { success: false, message: 'Gagal memproses persetujuan rayon.' };
  }
}

export async function approveByKomisariat(id: string) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, message: 'Akses ditolak.' };

    await prisma.magangApplication.update({
      where: { id },
      data: { status: 'DITERIMA' },
    });

    revalidatePath('/admin/magang');
    return { success: true, message: 'Magang berhasil disetujui secara final oleh Komisariat.' };
  } catch (error) {
    return { success: false, message: 'Gagal memproses persetujuan komisariat.' };
  }
}

export async function rejectMagang(id: string) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, message: 'Akses ditolak.' };

    await prisma.magangApplication.update({
      where: { id },
      data: { status: 'DITOLAK' },
    });

    revalidatePath('/admin/magang');
    return { success: true, message: 'Pendaftaran magang berhasil ditolak.' };
  } catch (error) {
    return { success: false, message: 'Gagal memproses penolakan.' };
  }
}