import type { ReactNode } from "react";

/**
 * Scroll reveal MURNI CSS -- tidak ada JavaScript sama sekali, jadi ini
 * Server Component biasa.
 *
 * Riwayat keputusannya penting, karena dua pendekatan sebelumnya gagal:
 *
 * 1. `initial={{opacity:0}}` milik Motion ikut tertulis ke HTML hasil static
 *    export. Terverifikasi di `out/id/index.html`. Pengunjung tanpa
 *    JavaScript melihat halaman kosong di bawah hero.
 *
 * 2. IntersectionObserver sendiri ternyata RAPUH terhadap gulir cepat. Diukur
 *    langsung: menggulir cepat menyisakan 25 dari 32 elemen tetap tersembunyi,
 *    sementara gulir pelan memunculkan semuanya. Sebabnya observer hanya
 *    dipanggil saat status perpotongan BERUBAH -- elemen yang melintasi
 *    viewport di antara dua frame tidak pernah tercatat sebagai terlihat.
 *    Di HP, satu flick ke bawah cukup untuk meninggalkan section kosong.
 *
 * `animation-timeline: view()` tidak punya kedua masalah itu: posisi animasi
 * dihitung dari posisi gulir, bukan dari kejadian yang bisa terlewat. Dan
 * karena dibungkus `@supports`, peramban yang belum mendukungnya (Firefox)
 * cukup menampilkan isinya tanpa animasi -- degradasi yang benar untuk
 * sesuatu yang memang cuma hiasan.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Diterjemahkan jadi jeda tahapan, bukan detik -- lihat globals.css. */
  delay?: number;
  className?: string;
}) {
  return (
    <div
      data-reveal=""
      style={delay ? ({ "--reveal-order": delay } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
