'use server';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 1. Fungsi Registrasi Instan Calon Anggota (Langsung Aktif & Bisa Login)
export async function registerAnggota(formData: FormData) {
  const namaLengkap = formData.get('namaLengkap') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const nomorHp = formData.get('nomorHp') as string;
  const fakultas = formData.get('fakultas') as string;
  const prodi = formData.get('prodi') as string;
  const rayonId = formData.get('rayonId') as string;

  if (!namaLengkap || !email || !password || !nomorHp || !fakultas || !prodi || !rayonId) {
    return { success: false, message: 'Semua kolom wajib diisi!' };
  }

  try {
    // Cek apakah email sudah terdaftar
    const existingKader = await prisma.kader.findUnique({
      where: { email },
    });

    if (existingKader) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.' };
    }

    // Hash password demi keamanan sistem
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan data kader baru dengan status PENDING (tapi akun langsung aktif untuk login & lengkapi berkas)
    await prisma.kader.create({
      data: {
        namaLengkap,
        email,
        password: hashedPassword,
        nomorHp,
        fakultas,
        prodi,
        rayonId,
        isProfileComplete: false, // Menandakan administrasi belum lengkap sempurna
        status: 'PENDING',
      },
    });

    return { 
      success: true, 
      message: 'Pendaftaran berhasil! Akun Anda sudah aktif. Silakan login untuk melengkapi administrasi.' 
    };
  } catch (error) {
    console.error('Error registerAnggota:', error);
    return { success: false, message: 'Terjadi kesalahan pada server saat mendaftar.' };
  }
}

// 2. Fungsi Login Portal Anggota (Berbasis Email & Password)
export async function loginAnggota(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, message: 'Email dan Password wajib diisi!' };
  }

  try {
    const kader = await prisma.kader.findUnique({
      where: { email },
      include: { rayon: true },
    });

    if (!kader || !kader.password) {
      return { success: false, message: 'Email atau Password salah.' };
    }

    // Cocokkan password
    const isPasswordValid = await bcrypt.compare(password, kader.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Email atau Password salah.' };
    }

    // Buat cookie sesi sederhana untuk portal anggota
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'anggota_session',
      value: JSON.stringify({ id: kader.id, email: kader.email, nama: kader.namaLengkap }),
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 minggu
    });

    return { success: true, message: 'Login berhasil! Mengalihkan ke portal...' };
  } catch (error) {
    console.error('Error loginAnggota:', error);
    return { success: false, message: 'Terjadi kesalahan saat proses login.' };
  }
}

// 3. Fungsi Ambil Sesi Anggota yang Sedang Login
export async function getAnggotaSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('anggota_session');
    if (!sessionCookie) return null;

    const sessionData = JSON.parse(sessionCookie.value);
    
    // Ambil data terbaru kader dari database
    const kader = await prisma.kader.findUnique({
      where: { id: sessionData.id },
      include: { rayon: true, kaderisasiLogs: true },
    });

    return kader;
  } catch (error) {
    return null;
  }
}

// 4. Fungsi Logout Anggota
export async function logoutAnggota() {
  const cookieStore = await cookies();
  cookieStore.delete('anggota_session');
  return { success: true };
}