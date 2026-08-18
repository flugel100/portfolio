"use client";

import { useEffect } from "react";

/**
 * Gulir halus untuk tautan sesama halaman (#work, #kontak, dst).
 *
 * Dulu ini cukup satu baris CSS: `html { scroll-behavior: smooth }`. Baris
 * itu DIHAPUS karena merusak perpindahan bahasa secara parah.
 *
 * Sebabnya: Next.js App Router memanggil `window.scrollTo(0, 0)` saat pindah
 * rute. Dengan `scroll-behavior: smooth`, panggilan itu berubah jadi animasi
 * gulir -- lalu animasinya tertabrak render halaman baru dan berhenti di
 * posisi acak. Terukur: dari posisi paling atas, menekan tombol ganti bahasa
 * melemparkan layar ke 8.400px, hampir dasar halaman. Dengan
 * `scroll-behavior: auto` hasilnya 0px, benar.
 *
 * Jadi kehalusan dipasang HANYA di tempat yang memang diinginkan: klik pada
 * tautan jangkar. Perpindahan rute dibiarkan memakai gulir instan bawaan
 * peramban, yang justru perilaku yang benar.
 *
 * Dipasang sebagai satu pendengar di dokumen, bukan per-tombol, supaya
 * jangkar yang ditambahkan nanti ikut bekerja tanpa perlu diingat.
 */
export function AnchorHalus() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Biarkan peramban menangani klik yang disertai modifier (buka tab baru).
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const a = (e.target as HTMLElement)?.closest?.("a");
      const href = a?.getAttribute("href");
      if (!href?.startsWith("#") || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const halus = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: halus ? "smooth" : "auto", block: "start" });

      // Alamat tetap diperbarui supaya tombol Kembali dan berbagi tautan
      // bekerja seperti jangkar biasa.
      history.pushState(null, "", href);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
