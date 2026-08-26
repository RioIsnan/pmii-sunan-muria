import { PrismaClient, GlobalRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Rayon & User Pengurus...');

  // 1. Buat Data Rayon
  const rayonData = [
    { code: 'TEKNIK', name: 'Rayon Teknik' },
    { code: 'MOH_HATTA', name: 'Rayon Moh Hatta (FEB)' },
    { code: 'KHD', name: 'Rayon Ki Hadjar Dewantara (FKIP)' },
    { code: 'HUMPSI', name: 'Rayon Humpsi (Hukum & Psikologi)' },
    { code: 'PERTANIAN', name: 'Rayon Pertanian' },
  ];

  for (const r of rayonData) {
    await prisma.rayon.upsert({
      where: { code: r.code },
      update: { name: r.name },
      create: r,
    });
  }

  const allRayons = await prisma.rayon.findMany();

  // 2. Buat User Super Admin / Komisariat
  await prisma.user.upsert({
    where: { username: 'admin_komisariat' },
    update: {
      role: GlobalRole.SUPER_ADMIN,
    },
    create: {
      username: 'admin_komisariat',
      password: 'password123',
      nama: 'Pengurus Komisariat Sunan Muria',
      role: GlobalRole.SUPER_ADMIN,
      rayonId: null,
    },
  });

  // 3. Buat User Admin untuk Masing-masing Rayon
  for (const rayon of allRayons) {
    const username = `admin_${rayon.code.toLowerCase()}`;
    await prisma.user.upsert({
      where: { username },
      update: {
        role: GlobalRole.ADMIN_RAYON,
        rayonId: rayon.id,
      },
      create: {
        username,
        password: 'password123',
        nama: `Pengurus ${rayon.name}`,
        role: GlobalRole.ADMIN_RAYON,
        rayonId: rayon.id,
      },
    });
  }

  console.log('Seeding selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });