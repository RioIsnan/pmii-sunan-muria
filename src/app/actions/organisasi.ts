'use server';

import { PrismaClient, TipeSurat, TipeKas } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getAdminSession } from './auth';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function resolveRayonId(sessionRayonName?: string, sessionRayonId?: string | null) {
  if (sessionRayonId) {
    const checkRayon = await prisma.rayon.findUnique({ where: { id: sessionRayonId } });
    if (checkRayon) return sessionRayonId;
  }

  if (!sessionRayonName || sessionRayonName.includes('Komisariat')) return null;

  let code = 'TEKNIK';
  if (sessionRayonName.includes('Moh Hatta') || sessionRayonName.includes('FEB')) code = 'MOH_HATTA';
  else if (sessionRayonName.includes('Ki Hadjar') || sessionRayonName.includes('FKIP')) code = 'KHD';
  else if (sessionRayonName.includes('Humpsi')) code = 'HUMPSI';
  else if (sessionRayonName.includes('Pertanian')) code = 'PERTANIAN';

  const rayon = await prisma.rayon.upsert({
    where: { code },
    update: {},
    create: {
      code,
      name: sessionRayonName,
    },
  });

  return rayon.id;
}

// ==========================================
// 1. MODUL SEKRETARIS (ARSIP SURAT MASUK & KELUAR)
// ==========================================

export async function getSuratList(tipe: TipeSurat) {
  try {
    const session = await getAdminSession();
    const targetRayonId = await resolveRayonId(session?.rayonName, session?.rayonId);

    return await prisma.surat.findMany({
      where: {
        tipe,
        rayonId: targetRayonId,
      },
      orderBy: { tanggal: 'desc' },
    });
  } catch (error) {
    console.error('Error getSuratList:', error);
    return [];
  }
}

export async function createSurat(formData: FormData) {
  const nomorSurat = formData.get('nomorSurat') as string;
  const judulSurat = formData.get('judulSurat') as string;
  const tipe = formData.get('tipe') as TipeSurat;
  const tanggalStr = formData.get('tanggal') as string;
  const keterangan = formData.get('keterangan') as string;
  const file = formData.get('fileDocument') as File | null;

  if (!nomorSurat || !judulSurat || !tipe || !tanggalStr) {
    return { success: false, message: 'Nomor, Judul, Tipe, dan Tanggal wajib diisi!' };
  }

  try {
    const session = await getAdminSession();
    const targetRayonId = await resolveRayonId(session?.rayonName, session?.rayonId);

    let fileUrl: string | null = null;
    let fileName: string | null = null;

    if (file && file.size > 0) {
      fileName = file.name;
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      fileUrl = `data:${file.type};base64,${base64}`;
    }

    await prisma.surat.create({
      data: {
        nomorSurat,
        judulSurat,
        tipe,
        tanggal: new Date(tanggalStr),
        keterangan,
        fileUrl,
        fileName,
        rayonId: targetRayonId,
      },
    });

    return { success: true, message: 'Surat berhasil diarsipkan!' };
  } catch (error: any) {
    console.error('Error createSurat:', error);
    return { success: false, message: `Gagal menyimpan surat: ${error?.message || 'Error DB'}` };
  }
}

export async function deleteSurat(id: string) {
  try {
    await prisma.surat.delete({ where: { id } });
    return { success: true, message: 'Surat berhasil dihapus!' };
  } catch (error) {
    console.error('Error deleteSurat:', error);
    return { success: false, message: 'Gagal menghapus surat.' };
  }
}

// ==========================================
// 2. MODUL BENDAHARA (KEGIATAN & KAS DINAMIS)
// ==========================================

export async function getKegiatanKeuanganList() {
  try {
    const session = await getAdminSession();
    const targetRayonId = await resolveRayonId(session?.rayonName, session?.rayonId);

    const kegiatan = await prisma.kegiatanKeuangan.findMany({
      where: { rayonId: targetRayonId },
      include: {
        transaksi: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return kegiatan.map((k) => {
      const totalPemasukan = k.transaksi
        .filter((t) => t.tipe === 'PEMASUKAN')
        .reduce((sum, t) => sum + t.jumlah, 0);

      const totalPengeluaran = k.transaksi
        .filter((t) => t.tipe === 'PENGELUARAN')
        .reduce((sum, t) => sum + t.jumlah, 0);

      return {
        ...k,
        totalPemasukan,
        totalPengeluaran,
        saldoSisa: totalPemasukan - totalPengeluaran,
      };
    });
  } catch (error) {
    console.error('Error getKegiatanKeuanganList:', error);
    return [];
  }
}

export async function createKegiatanDenganTransaksi(formData: FormData) {
  const namaKegiatan = formData.get('namaKegiatan') as string;
  const deskripsi = formData.get('deskripsi') as string;
  const itemsStr = formData.get('items') as string;

  if (!namaKegiatan) {
    return { success: false, message: 'Nama kegiatan wajib diisi!' };
  }

  try {
    const session = await getAdminSession();
    const targetRayonId = await resolveRayonId(session?.rayonName, session?.rayonId);
    const items = JSON.parse(itemsStr || '[]');

    await prisma.kegiatanKeuangan.create({
      data: {
        namaKegiatan,
        deskripsi,
        rayonId: targetRayonId,
        transaksi: {
          create: items.map((item: any) => ({
            kategori: item.kategori,
            tipe: item.tipe,
            jumlah: parseFloat(item.jumlah || '0'),
            keterangan: item.keterangan,
          })),
        },
      },
    });

    return { success: true, message: 'Laporan keuangan kegiatan berhasil disimpan!' };
  } catch (error: any) {
    console.error('Error createKegiatanDenganTransaksi:', error);
    return { success: false, message: `Gagal menyimpan: ${error?.message || 'Error DB'}` };
  }
}

export async function deleteKegiatanKeuangan(id: string) {
  try {
    await prisma.kegiatanKeuangan.delete({ where: { id } });
    return { success: true, message: 'Kegiatan berhasil dihapus!' };
  } catch (error) {
    console.error('Error deleteKegiatanKeuangan:', error);
    return { success: false, message: 'Gagal menghapus kegiatan.' };
  }
}