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

export function applyTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* localStorage bisa diblokir (mode privat) -- tema tetap berganti untuk sesi ini. */
  }
  window.dispatchEvent(new Event(EVENT));
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
      onClick={() => applyTheme(read() === "dark" ? "light" : "dark")}
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
