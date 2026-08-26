'use server';

import { PrismaClient, StatusKader, JenjangKaderisasi } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getAdminSession } from './auth';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Map Nama Fakultas ke Kode Rayon
const FAKULTAS_TO_RAYON_CODE: Record<string, string> = {
  'Fakultas Teknik': 'TEKNIK',
  'Fakultas Ekonomi dan Bisnis': 'MOH_HATTA',
  'Fakultas Keguruan dan Ilmu Pendidikan': 'KHD',
  'Fakultas Hukum': 'HUMPSI',
  'Fakultas Psikologi': 'HUMPSI',
  'Fakultas Pertanian': 'PERTANIAN',
};

export async function getRayonList() {
  return await prisma.rayon.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function daftarKader(formData: FormData) {
  const namaLengkap = formData.get('namaLengkap') as string;
  const email = formData.get('email') as string;
  const nomorHp = formData.get('nomorHp') as string;
  const fakultas = formData.get('fakultas') as string;
  const prodi = formData.get('prodi') as string;

  if (!namaLengkap || !email || !nomorHp || !fakultas || !prodi) {
    return { success: false, message: 'Semua bidang wajib diisi!' };
  }

  try {
    const targetRayonCode = FAKULTAS_TO_RAYON_CODE[fakultas];

    let rayon = await prisma.rayon.findFirst({
      where: { code: targetRayonCode },
    });

    if (!rayon) {
      rayon = await prisma.rayon.findFirst();
    }

    if (!rayon) {
      return { success: false, message: 'Sistem Rayon belum terkonfigurasi.' };
    }

    await prisma.kader.create({
      data: {
        namaLengkap,
        email,
        nomorHp,
        fakultas,
        prodi,
        rayonId: rayon.id,
      },
    });

    return { success: true, message: 'Pendaftaran MAPABA berhasil disimpan!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Gagal mendaftar. Email mungkin sudah terdaftar.' };
  }
}

// Mengambil daftar kader dengan penguncian otomatis berdasarkan Rayon akun yang login
export async function getKaderList(search?: string, statusFilter?: string) {
  try {
    const session = await getAdminSession();
    
    let effectiveRayonId: string | null = null;
    
    if (session) {
      if (session.role === 'ADMIN_RAYON' && session.rayonId) {
        effectiveRayonId = session.rayonId;
      } else if (session.rayonName && !session.rayonName.includes('Komisariat') && !session.rayonId) {
        let code = 'TEKNIK';
        if (session.rayonName.includes('Moh Hatta') || session.rayonName.includes('FEB')) code = 'MOH_HATTA';
        else if (session.rayonName.includes('Ki Hadjar') || session.rayonName.includes('FKIP')) code = 'KHD';
        else if (session.rayonName.includes('Humpsi')) code = 'HUMPSI';
        else if (session.rayonName.includes('Pertanian')) code = 'PERTANIAN';

        const rayonObj = await prisma.rayon.findUnique({ where: { code } });
        if (rayonObj) effectiveRayonId = rayonObj.id;
      }
    }

    return await prisma.kader.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { namaLengkap: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                  { nomorHp: { contains: search, mode: 'insensitive' } },
                  { prodi: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          statusFilter && statusFilter !== 'ALL'
            ? { status: statusFilter as StatusKader }
            : {},
          effectiveRayonId ? { rayonId: effectiveRayonId } : {},
        ],
      },
      include: {
        rayon: true,
        kaderisasiLogs: {
          orderBy: { tahun: 'desc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error getKaderList:', error);
    return [];
  }
}

export async function updateStatusKader(id: string, status: StatusKader) {
  try {
    const kader = await prisma.kader.findUnique({
      where: { id },
      include: { rayon: true },
    });

    if (!kader) {
      return { success: false, message: 'Data kader tidak ditemukan.' };
    }

    let ktaNumber = kader.ktaNumber;

    if (status === 'VERIFIED' && !ktaNumber) {
      const year = new Date().getFullYear();
      const rayonCode = kader.rayon?.code || 'SM';
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      ktaNumber = `KTA-${rayonCode}-${year}-${randomDigits}`;
    }

    await prisma.kader.update({
      where: { id },
      data: {
        status,
        ktaNumber,
      },
    });

    return { success: true, message: 'Status berhasil diperbarui!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Gagal memperbarui status.' };
  }
}

export async function getKaderStats() {
  try {
    const session = await getAdminSession();
    let effectiveRayonId: string | null = null;

    if (session && session.role === 'ADMIN_RAYON' && session.rayonId) {
      effectiveRayonId = session.rayonId;
    }

    const allKader = await prisma.kader.findMany({
      where: effectiveRayonId ? { rayonId: effectiveRayonId } : {},
      select: { status: true },
    });

    const total = allKader.length;
    const verified = allKader.filter((k) => k.status === 'VERIFIED').length;
    const pending = allKader.filter((k) => k.status === 'PENDING').length;
    const rejected = allKader.filter((k) => k.status === 'REJECTED').length;

    return { total, verified, pending, rejected };
  } catch (error) {
    return { total: 0, verified: 0, pending: 0, rejected: 0 };
  }
}

export async function checkStatusKader(identifier: string) {
  if (!identifier) {
    return { success: false, message: 'Masukkan Nomor WhatsApp atau Email!' };
  }

  const cleanQuery = identifier.trim();

  const result = await prisma.kader.findFirst({
    where: {
      OR: [
        { email: { equals: cleanQuery, mode: 'insensitive' } },
        { nomorHp: { contains: cleanQuery } },
      ],
    },
    include: {
      rayon: true,
    },
  });

  if (!result) {
    return {
      success: false,
      message: 'Data pendaftaran tidak ditemukan. Pastikan Nomor HP atau Email sudah benar.',
    };
  }

  return {
    success: true,
    data: {
      id: result.id,
      namaLengkap: result.namaLengkap,
      email: result.email,
      nomorHp: result.nomorHp,
      fakultas: result.fakultas,
      prodi: result.prodi,
      rayon: result.rayon?.name,
      status: result.status,
      tanggalDaftar: result.createdAt,
    },
  };
}

// Memperbarui Posisi Kepengurusan Kader Secara Fleksibel (String bebas: Biro/Bidang/dll)
export async function updateKaderPosition(kaderId: string, posisiBaru: string) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, message: 'Akses ditolak.' };

    if (!posisiBaru) {
      return { success: false, message: 'Posisi jabatan tidak boleh kosong.' };
    }

    await prisma.kader.update({
      where: { id: kaderId },
      data: { posisi: posisiBaru.trim() },
    });

    return { success: true, message: 'Posisi kepengurusan kader berhasil diperbarui.' };
  } catch (error) {
    console.error('Error updateKaderPosition:', error);
    return { success: false, message: 'Gagal memperbarui posisi kepengurusan.' };
  }
}

// Menambahkan Riwayat Logbook Kaderisasi (MAPABA / PKD / PKL)
export async function addKaderisasiLog(data: {
  kaderId: string;
  jenjang: JenjangKaderisasi;
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

    await prisma.kader.update({
      where: { id: data.kaderId },
      data: { jenjang: data.jenjang },
    });

    return { success: true, message: 'Riwayat kaderisasi berhasil dicatat.' };
  } catch (error) {
    console.error('Error addKaderisasiLog:', error);
    return { success: false, message: 'Gagal mencatat riwayat kaderisasi.' };
  }
}