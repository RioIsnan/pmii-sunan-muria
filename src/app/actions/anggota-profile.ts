'use server';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getAnggotaSession } from './anggota-auth';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function updateAnggotaProfile(formData: FormData) {
  const session = await getAnggotaSession();
  if (!session) {
    return { success: false, message: 'Akses ditolak. Silakan login ulang.' };
  }

  // Inisialisasi Supabase Client secara lokal di dalam Server Action
  const supabase = createClient(
    'https://qklqviaqjnxcjxxfywk.supabase.co',
    'sb_publishable_ka-X43p5rWH15U0C6pdAIg_stx_125i'
  );

  const nim = formData.get('nim') as string;
  const nomorHp = formData.get('nomorHp') as string;
  const prodi = formData.get('prodi') as string;
  const fakultas = formData.get('fakultas') as string;
  const alamat = formData.get('alamat') as string;
  const tanggalLahirStr = formData.get('tanggalLahir') as string;

  const ktpFile = formData.get('ktp') as File | null;
  const ktmFile = formData.get('ktm') as File | null;

  if (!nomorHp || !prodi || !fakultas || !alamat) {
    return { success: false, message: 'Nomor HP, Prodi, Fakultas, dan Alamat wajib diisi.' };
  }

  try {
    let ktpUrl = undefined;
    let ktmUrl = undefined;

    // 1. Upload KTP ke Supabase Storage (Bucket: 'uploads')
    if (ktpFile && ktpFile.size > 0) {
      const fileExt = ktpFile.name.split('.').pop();
      const ktpName = `${session.id}-ktp-${Date.now()}.${fileExt}`;
      const arrayBuffer = await ktpFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(`kader/${ktpName}`, buffer, {
          contentType: ktpFile.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(`kader/${ktpName}`);

      ktpUrl = publicUrlData.publicUrl;
    }

    // 2. Upload KTM ke Supabase Storage
    if (ktmFile && ktmFile.size > 0) {
      const fileExt = ktmFile.name.split('.').pop();
      const ktmName = `${session.id}-ktm-${Date.now()}.${fileExt}`;
      const arrayBuffer = await ktmFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(`kader/${ktmName}`, buffer, {
          contentType: ktmFile.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(`kader/${ktmName}`);

      ktmUrl = publicUrlData.publicUrl;
    }

    // 3. Update data ke Database via Prisma
    await prisma.kader.update({
      where: { id: session.id },
      data: {
        nim: nim || null,
        nomorHp,
        prodi,
        fakultas,
        alamat,
        tanggalLahir: tanggalLahirStr ? new Date(tanggalLahirStr) : null,
        ...(ktpUrl && { ktpUrl }),
        ...(ktmUrl && { ktmUrl }),
        isProfileComplete: true,
      },
    });

    revalidatePath('/portal');
    return { success: true, message: 'Data pemberkasan dan dokumen berhasil disimpan ke Supabase!' };
  } catch (error: any) {
    console.error('Error updateAnggotaProfile:', error);
    // Menampilkan detail error asli ke tampilan web
    return { success: false, message: `Gagal: ${error.message || JSON.stringify(error)}` };
  }
}