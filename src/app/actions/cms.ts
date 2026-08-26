'use server';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ==========================================
// 1. ACTION BERITA
// ==========================================

export async function getBeritaList() {
  return await prisma.berita.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });
}

export async function createBerita(formData: FormData) {
  const judul = formData.get('judul') as string;
  const konten = formData.get('konten') as string;
  const penulis = formData.get('penulis') as string;

  if (!judul || !konten || !penulis) {
    return { success: false, message: 'Semua bidang wajib diisi!' };
  }

  const slug = judul
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Date.now();

  try {
    await prisma.berita.create({
      data: {
        judul,
        slug,
        konten,
        penulis,
      },
    });
    return { success: true, message: 'Berita berhasil diterbitkan!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Gagal menerbitkan berita.' };
  }
}

// ==========================================
// 2. ACTION AGENDA
// ==========================================

export async function getAgendaList() {
  return await prisma.agenda.findMany({
    orderBy: { tanggal: 'asc' },
    take: 4,
  });
}

export async function createAgenda(formData: FormData) {
  const judul = formData.get('judul') as string;
  const lokasi = formData.get('lokasi') as string;
  const tanggalStr = formData.get('tanggal') as string;
  const deskripsi = formData.get('deskripsi') as string;

  if (!judul || !lokasi || !tanggalStr) {
    return { success: false, message: 'Judul, lokasi, dan tanggal wajib diisi!' };
  }

  try {
    await prisma.agenda.create({
      data: {
        judul,
        lokasi,
        tanggal: new Date(tanggalStr),
        deskripsi,
      },
    });
    return { success: true, message: 'Agenda kegiatan berhasil ditambahkan!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Gagal menambahkan agenda.' };
  }
}