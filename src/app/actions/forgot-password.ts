'use server';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 1. Kirim Token Reset Password ke Email
export async function requestPasswordReset(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { success: false, message: 'Email wajib diisi!' };
  }

  try {
    const kader = await prisma.kader.findUnique({
      where: { email },
    });

    // Demi keamanan, jika email tidak ditemukan, tetap berikan pesan sukses generik 
    // agar penyerang tidak bisa menebak email mana saja yang terdaftar di sistem.
    if (!kader) {
      return { 
        success: true, 
        message: 'Jika email terdaftar, tautan pemulihan password telah dikirim ke email Anda.' 
      };
    }

    // Buat token unik acak dan masa kedaluwarsa (15 menit ke depan)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Simpan token ke database kader
    await prisma.kader.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    // Simulasi pengiriman email (karena belum pakai layanan pihak ketiga seperti Nodemailer/Resend,
    // kita tampilkan link reset langsung di console server / log untuk kebutuhan pengujian lokal)
    const resetLink = `http://localhost:3000/portal/reset-password?token=${resetToken}`;
    console.log('========================================');
    console.log(`[SIMULASI EMAIL LUPA PASSWORD] Untuk: ${email}`);
    console.log(`Tautan Reset Password Anda: ${resetLink}`);
    console.log('========================================');

    return { 
      success: true, 
      message: 'Tautan pemulihan password berhasil dikirim! (Cek terminal/console server untuk melihat tautan simulasi lokal).' 
    };
  } catch (error) {
    console.error('Error requestPasswordReset:', error);
    return { success: false, message: 'Terjadi kesalahan pada server.' };
  }
}

// 2. Eksekusi Perubahan Password Baru
export async function resetPassword(formData: FormData) {
  const token = formData.get('token') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!token || !newPassword) {
    return { success: false, message: 'Token dan Password baru wajib diisi.' };
  }

  try {
    // Cari kader berdasarkan token valid dan belum expired
    const kader = await prisma.kader.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gte: new Date(), // Belum kadaluarsa
        },
      },
    });

    if (!kader) {
      return { success: false, message: 'Token pemulihan tidak valid atau sudah kedaluwarsa.' };
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Perbarui password dan hapus token agar tidak bisa dipakai ulang
    await prisma.kader.update({
      where: { id: kader.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return { success: true, message: 'Password berhasil diubah! Silakan login dengan password baru.' };
  } catch (error) {
    console.error('Error resetPassword:', error);
    return { success: false, message: 'Terjadi kesalahan saat mereset password.' };
  }
}