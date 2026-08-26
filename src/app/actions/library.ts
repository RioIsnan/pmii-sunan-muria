'use server';

import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/app/actions/auth';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

      // 1. Siapkan nama file unik untuk Supabase Storage
      const fileExt = file.name.split('.').pop();
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `library/${uniqueSuffix}-${file.name.replaceAll(' ', '_')}`;
      
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 2. Upload ke Supabase Storage (Bucket: 'uploads')
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Gagal upload ke Supabase: ${uploadError.message}`);
      }

      // 3. Ambil Public URL dari file yang di-upload
      const { data: publicUrlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filename);

      fileUrl = publicUrlData.publicUrl;

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