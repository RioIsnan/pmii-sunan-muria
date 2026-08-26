'use server';

import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/app/actions/auth';
import crypto from 'crypto';
import { redirect } from 'next/navigation';

export async function getPresensiSesiList() {
  try {
    const session = await getAdminSession();
    
    const list = await prisma.presensiSesi.findMany({
      include: {
        agenda: true,
        _count: { select: { logs: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!session) return list;

    const roleLower = (session.role || '').toLowerCase();
    const rayonName = (session.rayonName || '').toLowerCase();
    
    const isKomisariat = roleLower.includes('komisariat') || rayonName.includes('komisariat') || roleLower.includes('super_admin');

    if (isKomisariat) {
      return list;
    }

    // Filter ketat sesi presensi berdasarkan teks lokasi atau judul agenda yang mencocokkan rayon login
    const keyword = rayonName.replace(/rayon/gi, '').trim();

    return list.filter((sesi) => {
      const lokasi = (sesi.agenda?.lokasi || '').toLowerCase();
      const judul = (sesi.agenda?.judul || '').toLowerCase();
      return lokasi.includes(keyword) || judul.includes(keyword);
    });

  } catch (error) {
    console.error('Error getPresensiSesiList:', error);
    return [];
  }
}

export async function createPresensiSesi(formData: FormData) {
  let sesiId = '';
  try {
    const session = await getAdminSession();
    if (!session) {
      return { success: false, message: 'Akses ditolak.' };
    }

    const namaAgendaManual = formData.get('namaAgendaManual') as string;
    const namaSesi = formData.get('namaSesi') as string;
    const durasiJamStr = formData.get('durasiJam') as string || '2';

    if (!namaAgendaManual || !namaSesi) {
      return { success: false, message: 'Nama kegiatan dan nama sesi wajib diisi!' };
    }

    let agenda = await prisma.agenda.findFirst({
      where: { judul: namaAgendaManual.trim() }
    });

    if (!agenda) {
      agenda = await prisma.agenda.create({
        data: {
          judul: namaAgendaManual.trim(),
          lokasi: `Sekretariat / ${session.rayonName || 'Komisariat'}`,
          tanggal: new Date(),
          deskripsi: 'Agenda otomatis dari modul presensi mandiri',
        },
      });
    }

    const tokenDinamis = crypto.randomBytes(3).toString('hex').toUpperCase();
    const durasiJam = parseInt(durasiJamStr);
    
    const waktuMulai = new Date();
    const waktuSelesai = new Date(Date.now() + durasiJam * 3600 * 1000);

    const sesiBaru = await prisma.presensiSesi.create({
      data: {
        agendaId: agenda.id,
        namaSesi,
        tokenDinamis,
        waktuMulai,
        waktuSelesai,
      },
    });

    sesiId = sesiBaru.id;
  } catch (error: any) {
    console.error('Error createPresensiSesi:', error);
    return { success: false, message: `Gagal membuat sesi: ${error?.message}` };
  }

  if (sesiId) {
    redirect(`/admin/presensi/${sesiId}`);
  }
}

export async function rotatePresensiToken(sesiId: string) {
  try {
    const tokenBaru = crypto.randomBytes(3).toString('hex').toUpperCase();
    await prisma.presensiSesi.update({
      where: { id: sesiId },
      data: { tokenDinamis: tokenBaru },
    });
    return { success: true, tokenDinamis: tokenBaru };
  } catch (error) {
    return { success: false, tokenDinamis: '' };
  }
}

export async function getPresensiSesiDetail(id: string) {
  try {
    return await prisma.presensiSesi.findUnique({
      where: { id },
      include: {
        agenda: true,
        logs: {
          include: { kader: true },
          orderBy: { waktuHadir: 'desc' },
        },
      },
    });
  } catch (error) {
    return null;
  }
}

export async function submitPresensiKader(data: { sesiId: string; emailOrNim: string; tokenInput: string }) {
  try {
    const sesi = await prisma.presensiSesi.findUnique({
      where: { id: data.sesiId },
    });

    if (!sesi) {
      return { success: false, message: 'Sesi presensi tidak ditemukan.' };
    }

    if (sesi.tokenDinamis !== data.tokenInput.trim().toUpperCase()) {
      return { success: false, message: 'Token QR Code salah atau sudah kadaluarsa! Silakan scan ulang QR terbaru.' };
    }

    const kader = await prisma.kader.findFirst({
      where: {
        OR: [
          { nik: data.emailOrNim.trim() },
          { email: data.emailOrNim.trim().toLowerCase() },
          { ktaNumber: data.emailOrNim.trim() }
        ]
      },
    });

    if (!kader) {
      return { success: false, message: 'Data kader tidak ditemukan. Pastikan NIK / Email / No KTA benar.' };
    }

    const sudahAbsen = await prisma.presensiLog.findUnique({
      where: {
        sesiId_kaderId: {
          sesiId: data.sesiId,
          kaderId: kader.id,
        },
      },
    });

    if (sudahAbsen) {
      return { success: false, message: `Kader ${kader.namaLengkap} sudah tercatat hadir di sesi ini sebelumnya.` };
    }

    await prisma.presensiLog.create({
      data: {
        sesiId: data.sesiId,
        kaderId: kader.id,
        statusKehadiran: 'HADIR',
      },
    });

    return { success: true, message: `Alhamdulillah, kehadiran ${kader.namaLengkap} berhasil dicatat!` };
  } catch (error: any) {
    return { success: false, message: `Gagal melakukan presensi: ${error?.message}` };
  }
}

export async function deletePresensiSesi(id: string) {
  try {
    const session = await getAdminSession();
    if (!session) return { success: false, message: 'Akses ditolak.' };

    await prisma.presensiSesi.delete({ where: { id } });
    return { success: true, message: 'Sesi presensi berhasil dihapus.' };
  } catch (error) {
    return { success: false, message: 'Gagal menghapus sesi.' };
  }
}