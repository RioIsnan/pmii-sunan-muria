'use server';

import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/app/actions/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function getLibraryMateriList() {
  try {
    return await prisma.libraryMateri.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error getLibraryMateriList:', error);
    return [];
  }
}

export async function createLibraryMateri(formData: FormData) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return { success: false, message: 'Akses ditolak. Sesi admin berakhir.' };
    }

    const judul = formData.get('judul') as string;
    const kategori = formData.get('kategori') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const penulis = formData.get('penulis') as string;
    const tipeSumber = formData.get('tipeSumber') as string;
    let fileUrl = '';

    if (!judul || !kategori) {
      return { success: false, message: 'Judul dan kategori wajib diisi!' };
    }

    if (tipeSumber === 'upload') {
      const file = formData.get('fileDokumen') as File;
      
      if (!file || typeof file === 'string' || file.size === 0) {
        return { success: false, message: 'Silakan pilih file dokumen yang valid terlebih dahulu!' };
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = uniqueSuffix + '-' + file.name.replaceAll(' ', '_');
      
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {}

      await writeFile(path.join(uploadDir, filename), buffer);
      fileUrl = `/uploads/${filename}`;
    } else {
      fileUrl = formData.get('fileUrl') as string;
      if (!fileUrl) {
        return { success: false, message: 'Link URL file eksternal wajib diisi!' };
      }
    }

    await prisma.libraryMateri.create({
      data: {
        judul,
        kategori,
        deskripsi,
        fileUrl,
        penulis: penulis || 'Pengurus Komisariat',
      },
    });

    return { success: true, message: 'Materi berhasil disimpan ke E-Library!' };
  } catch (error: any) {
    console.error('Error createLibraryMateri:', error);
    return { success: false, message: `Gagal menyimpan materi: ${error?.message || 'Error Database'}` };
  }
}

export async function incrementDownloadCount(id: string) {
  try {
    await prisma.libraryMateri.update({
      where: { id },
      data: {
        downloads: { increment: 1 },
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}