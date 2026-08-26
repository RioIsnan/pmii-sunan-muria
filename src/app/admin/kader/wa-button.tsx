'use client';

export default function WaButton({ nama, nomorHp }: { nama: string; nomorHp: string }) {
  const formatPhone = (phone: string) => {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    return clean;
  };

  const message = `Halo Sahabat ${nama}, kami dari Pengurus PMII Komisariat Sunan Muria mengenai pendaftaran Anda.`;
  const waUrl = `https://wa.me/${formatPhone(nomorHp)}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold transition-all"
    >
      <span>WA</span>
    </a>
  );
}