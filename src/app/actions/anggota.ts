'use server';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getAnggotaSession } from './anggota-auth';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function getAnggotaProfile() {
  try {
    const session = await getAnggotaSession();
    if (!session) return null;

    const anggota = await prisma.anggotaUser.findUnique({
      where: { id: session.anggotaUserId },
      include: {
        kader: {
          include: {
            rayon: true,
          },
        },
        magang: true,
      },
    });

    return anggota;
  } catch (error) {
    console.error('Error getAnggotaProfile:', error);
    return null;
  }
}

export async function daftarMagang(formData: FormData) {
  try {
    const session = await getAnggotaSession();
    if (!session) {
      return { success: false, message: 'Sesi anda telah berakhir. Silakan login ulang.' };
    }

    const minatKeahlian = formData.get('minatKeahlian') as string;
    const pengalaman = formData.get('pengalaman') as string;
    const motivasi = formData.get('motivasi') as string;

    if (!minatKeahlian || !motivasi) {
      return { success: false, message: 'Minat keahlian dan motivasi wajib diisi!' };
    }

    const existing = await prisma.magangApplication.findUnique({
      where: { anggotaUserId: session.anggotaUserId },
    });

    if (existing) {
      await prisma.magangApplication.update({
        where: { anggotaUserId: session.anggotaUserId },
        data: {
          minatKeahlian,
          pengalaman,
          motivasi,
          status: 'MENDAFTAR',
        },
      });
    } else {
      await prisma.magangApplication.create({
        data: {
          anggotaUserId: session.anggotaUserId,
          minatKeahlian,
          pengalaman,
          motivasi,
          status: 'MENDAFTAR',
        },
      });
    }

    return { success: true, message: 'Pendaftaran program magang berhasil dikirim!' };
  } catch (error: any) {
    console.error('Error daftarMagang:', error);
    return { success: false, message: `Gagal mendaftar magang: ${error?.message || 'Error DB'}` };
  }
}