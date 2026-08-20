"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const EVENT = "themechange";

function read(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

type Asal = { x: number; y: number };

function gantiSekarang(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* localStorage bisa diblokir (mode privat) -- tema tetap berganti untuk sesi ini. */
  }
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Ganti tema dengan lingkaran yang menyapu keluar dari titik [asal].
 *
 * Sebelumnya pergantian tema MENYENTAK: pengukuran 2026-08-20 menemukan nol
 * warna antara pada `body` selama satu detik penuh -- latar melompat dalam
 * satu frame -- sementara `header` justru punya transisi 0,3 detik. Jadi satu
 * bagian memudar halus dan sisanya menyentak, dan ketidakserasian itu yang
 * membuatnya terasa murah.
 *
 * Memberi transisi pada warna SETIAP elemen bukan jawabannya: tiap elemen
 * akan beranimasi sendiri-sendiri dengan waktu yang sedikit berbeda, dan
 * hasilnya riak, bukan satu gerakan.
 *
 * View Transitions API memotret seluruh halaman lalu menyilangkan kedua
 * potret itu sebagai SATU gerakan. Titik asalnya diambil dari tombol yang
 * ditekan supaya sapuannya terasa berasal dari jari pengguna, bukan dari
 * tempat acak.
 *
 * Browser tanpa dukungan (dan pengguna yang meminta gerak dikurangi) tetap
 * berganti tema seketika -- tanpa galat, tanpa jeda.
 */
export function applyTheme(next: Theme, asal?: Asal) {
  const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const didukung = typeof document.startViewTransition === "function";

  if (!didukung || kurangiGerak) {
    gantiSekarang(next);
    return;
  }

  const x = asal?.x ?? window.innerWidth / 2;
  const y = asal?.y ?? 0;
  // Radius sampai sudut terjauh, supaya lingkarannya benar-benar menutup layar.
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const akar = document.documentElement;
  akar.style.setProperty("--tema-x", `${x}px`);
  akar.style.setProperty("--tema-y", `${y}px`);
  akar.style.setProperty("--tema-r", `${r}px`);
  akar.dataset.gantiTema = "";

  const transisi = document.startViewTransition(() => gantiSekarang(next));
  transisi.finished.finally(() => {
    delete akar.dataset.gantiTema;
  });
}

/**
 * Tema hidup di DOM dan di preferensi sistem -- keduanya di LUAR React.
 * `useSyncExternalStore` adalah primitif yang tepat untuk itu: tidak ada
 * setState di dalam efek (yang memicu render berantai), dan snapshot server
 * dikembalikan secara eksplisit sehingga hidrasi tidak pernah tidak cocok.
 */
function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener(EVENT, onChange);
  media.addEventListener("change", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    media.removeEventListener("change", onChange);
  };
}

export function ThemeToggle({ label }: { label: string }) {
  // Snapshot server sengaja null: di server tema pengguna tidak diketahui,
  // dan menebaknya menghasilkan ikon yang salah selama sekejap.
  const theme = useSyncExternalStore<Theme | null>(subscribe, read, () => null);

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        // Titik asal = tengah tombol, jadi sapuannya berawal dari yang ditekan.
        const r = e.currentTarget.getBoundingClientRect();
        applyTheme(read() === "dark" ? "light" : "dark", {
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
        });
      }}
      className="grid size-9 place-items-center rounded-md text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
    >
      {theme === "dark" ? (
        <Sun size={17} strokeWidth={1.75} />
      ) : (
        <Moon size={17} strokeWidth={1.75} />
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}
