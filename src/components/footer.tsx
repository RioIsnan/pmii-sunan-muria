import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Deskripsi */}
          <div className="space-y-4 md:col-span-2">
            <span className="font-bold text-white tracking-tight text-lg block">
              PMII Komisariat Sunan Muria
            </span>
            <p className="text-slate-400 leading-relaxed max-w-md text-xs sm:text-sm">
              PMII merupakan organisasi gerakan dan kaderisasi yang berlandaskan islam ahlussunah waljamaah. Berdiri sejak tanggal 17 April 1960 di Surabaya dan hingga lebih dari setengah abad kini PMII terus eksis untuk memberikan kontribusi bagi kemajuan bangsa dan negara.
            </p>
          </div>

          {/* Tautan Cepat */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="#profil" className="hover:text-white transition-colors">Profil Singkat</Link></li>
              <li><Link href="#rayon" className="hover:text-white transition-colors">Daftar Rayon</Link></li>
              <li><Link href="/pendaftaran" className="hover:text-white transition-colors">Pendaftaran MAPABA</Link></li>
            </ul>
          </div>

          {/* Area Pengurus */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Internal</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/admin/login" className="hover:text-white transition-colors">Portal Pengurus</Link></li>
              <li><Link href="/portal/login" className="hover:text-white transition-colors">Portal Anggota</Link></li>
              <li><Link href="/daftar" className="hover:text-white transition-colors">Gabung PMII</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PMII Komisariat Sunan Muria. All rights reserved.</p>
          <p>Dikelola oleh Tim Bidang Media Komunikasi dan Informatika Sunan Muria</p>
        </div>
      </div>
    </footer>
  );
}