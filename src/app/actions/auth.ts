'use server';

import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Daftar akun resmi Komisariat & 5 Rayon untuk fallback
const ACCOUNT_MAPPING: Record<string, { nama: string; role: string; rayonName: string }> = {
  admin_komisariat: {
    nama: 'Pengurus Komisariat Sunan Muria',
    role: 'SUPER_ADMIN',
    rayonName: 'Komisariat Sunan Muria',
  },
  admin_teknik: {
    nama: 'Pengurus Rayon Teknik',
    role: 'ADMIN_RAYON',
    rayonName: 'Rayon Teknik',
  },
  admin_moh_hatta: {
    nama: 'Pengurus Rayon Moh Hatta',
    role: 'ADMIN_RAYON',
    rayonName: 'Rayon Moh Hatta (FEB)',
  },
  admin_khd: {
    nama: 'Pengurus Rayon Ki Hadjar Dewantara',
    role: 'ADMIN_RAYON',
    rayonName: 'Rayon Ki Hadjar Dewantara (FKIP)',
  },
  admin_humpsi: {
    nama: 'Pengurus Rayon Humpsi',
    role: 'ADMIN_RAYON',
    rayonName: 'Rayon Humpsi (Hukum & Psikologi)',
  },
  admin_pertanian: {
    nama: 'Pengurus Rayon Pertanian',
    role: 'ADMIN_RAYON',
    rayonName: 'Rayon Pertanian',
  },
};

export async function loginAdmin(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { success: false, message: 'Username dan password wajib diisi!' };
  }

  const cleanUsername = username.toLowerCase().trim();

  try {
    let user = null;

    // Cek user di database jika prisma.user tersedia
    if (prisma.user) {
      user = await prisma.user.findUnique({
        where: { username: cleanUsername },
        include: { rayon: true },
      });
    }

    // Jika user ditemukan di database dan password cocok
    if (user && user.password === password) {
      const sessionData = {
        id: user.id,
        nama: user.nama,
        role: user.role,
        rayonId: user.rayonId,
        rayonName: user.rayon?.name || 'Komisariat Sunan Muria',
      };

      const cookieStore = await cookies();
      cookieStore.set('admin_session', JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return { success: true, message: 'Login berhasil!' };
    }

    // Jika database belum terisi / fallback untuk semua akun pengurus (Komisariat & Rayon)
    if (ACCOUNT_MAPPING[cleanUsername] && password === 'password123') {
      const account = ACCOUNT_MAPPING[cleanUsername];

      // Ambil rayonId dari DB jika ada
      let dbRayonId = null;
      if (prisma.rayon) {
        const rayonCode = cleanUsername.replace('admin_', '').toUpperCase();
        const rayon = await prisma.rayon.findFirst({
          where: {
            OR: [
              { code: rayonCode },
              { code: cleanUsername === 'admin_khd' ? 'KHD' : rayonCode },
            ],
          },
        });
        if (rayon) dbRayonId = rayon.id;
      }

      const sessionData = {
        id: `fallback-${cleanUsername}`,
        nama: account.nama,
        role: account.role,
        rayonId: dbRayonId,
        rayonName: account.rayonName,
      };

      const cookieStore = await cookies();
      cookieStore.set('admin_session', JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return { success: true, message: 'Login berhasil!' };
    }

    return { success: false, message: 'Username atau password salah!' };
  } catch (error: any) {
    console.error('Error Login Detail:', error);

    // Emergency Fallback untuk semua akun jika terjadi error DB
    if (ACCOUNT_MAPPING[cleanUsername] && password === 'password123') {
      const account = ACCOUNT_MAPPING[cleanUsername];

      const sessionData = {
        id: `emergency-${cleanUsername}`,
        nama: account.nama,
        role: account.role,
        rayonId: null,
        rayonName: account.rayonName,
      };

      const cookieStore = await cookies();
      cookieStore.set('admin_session', JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return { success: true, message: 'Login berhasil (Emergency Mode)!' };
    }

    return {
      success: false,
      message: `Terjadi kesalahan sistem: ${error?.message || 'Gagal login'}`,
    };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return { success: true };
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value) as {
      id: string;
      nama: string;
      role: string;
      rayonId: string | null;
      rayonName: string;
    };
  } catch {
    return null;
  }
}