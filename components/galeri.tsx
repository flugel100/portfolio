"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dict } from "@/content/i18n";
import type { Lang } from "@/content/site";

const GAMBAR = ["01", "02", "03", "04"] as const;

/**
 * Galeri tangkapan layar yang bisa digeser.
 *
 * TANPA pustaka carousel. Gesernya memakai `overflow-x` + `scroll-snap`
 * bawaan peramban, jadi tiga hal berlaku gratis: sentuhan di HP terasa
 * native, roda mouse dan trackpad bekerja, dan galeri tetap BISA DIGESER
 * meski JavaScript mati total. Tombol panah cuma peningkatan untuk pengguna
 * desktop yang tidak punya layar sentuh.
 *
 * Isinya tangkapan layar ASLI dari demo yang benar-benar tayang, diambil
 * pada 390x844 -- ukuran ponsel sungguhan, bukan mockup.
 */
/**
 * Tangkapan layar disediakan PER BAHASA. Versi pertama memakai satu set saja,
 * hasilnya halaman Indonesia memamerkan aplikasi berbahasa Inggris ("CHOOSE A
 * CATEGORY") -- justru merusak klaim "dua bahasa penuh" yang tertulis tepat
 * di atasnya. Aplikasi memilih bahasa dari peramban, jadi locale harus
 * dipaksa saat menangkap, bukan diserahkan ke kebetulan.
 */
export function Galeri({ t, lang }: { t: Dict; lang: Lang }) {
  const trek = useRef<HTMLDivElement>(null);

  const geser = (arah: 1 | -1) => {
    const el = trek.current;
    if (!el) return;
    // Digeser selebar satu kartu + jarak antar-kartu, bukan sejauh viewport --
    // supaya selalu berhenti tepat di kartu berikutnya.
    const kartu = el.querySelector<HTMLElement>("[data-kartu]");
    const langkah = kartu ? kartu.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: arah * langkah, behavior: "smooth" });
  };

  return (
    <section aria-label={t.galeri.judul} className="mt-12">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold tracking-tight">{t.galeri.judul}</h4>
          <p className="mt-0.5 text-xs text-fg-faint">{t.galeri.petunjuk}</p>
        </div>

        {/* Disembunyikan dari pembaca layar: menggulir daftar sudah bisa
            dilakukan lewat papan ketik pada wadahnya sendiri. */}
        <div className="hidden gap-1.5 sm:flex" aria-hidden="true">
          {([-1, 1] as const).map((arah) => (
            <button
              key={arah}
              type="button"
              tabIndex={-1}
              onClick={() => geser(arah)}
              className="grid size-9 place-items-center rounded-lg border border-line text-fg-muted transition-colors hover:border-line-strong hover:bg-bg hover:text-fg"
            >
              {arah === -1 ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={trek}
        tabIndex={0}
        role="group"
        aria-label={t.galeri.judul}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:thin]"
      >
        {GAMBAR.map((nama, i) => (
          <figure
            key={nama}
            data-kartu=""
            className="w-[168px] shrink-0 snap-center sm:w-[196px]"
          >
            <div className="overflow-hidden rounded-xl border border-line bg-bg">
              <Image
                src={`/karya/jagoan-medis/${lang}/${nama}.webp`}
                alt={t.galeri.gambar[i]}
                width={390}
                height={844}
                sizes="(max-width: 640px) 168px, 196px"
                loading="lazy"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-2.5 text-xs leading-snug text-fg-faint text-pretty">
              {t.galeri.gambar[i]}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
