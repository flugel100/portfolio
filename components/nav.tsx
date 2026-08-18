"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Dict } from "@/content/i18n";
import type { Lang } from "@/content/site";
import { navItems } from "@/lib/nav";
import { ThemeToggle } from "./theme-toggle";
import { CommandPalette } from "./command-palette";

export function Nav({ t, lang }: { t: Dict; lang: Lang }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const items = navItems(t);
  const other: Lang = lang === "id" ? "en" : "id";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled
          ? "border-line bg-bg/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6 sm:px-8 lg:px-12">
        <Link
          href={`/${lang}/`}
          className="group flex items-baseline gap-2 font-semibold tracking-tight"
        >
          <span>Ali Torihin</span>
          <span className="font-mono text-xs text-fg-faint transition-colors group-hover:text-accent">
            flugel100
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <CommandPalette t={t} lang={lang} />

          {/* Ganti bahasa sebagai tautan biasa, bukan tombol JS: tetap bekerja
              tanpa JavaScript dan bisa dirayapi mesin telusur. */}
          <Link
            href={`/${other}/`}
            hrefLang={other}
            aria-label={t.nav.language}
            className="grid h-9 min-w-9 place-items-center rounded-md px-2 font-mono text-xs uppercase text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
          >
            {other}
          </Link>

          <ThemeToggle label={t.nav.theme} />

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? t.nav.close : t.nav.menu}
            aria-expanded={menuOpen}
            className="grid size-9 place-items-center rounded-md text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg md:hidden"
          >
            {menuOpen ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-line bg-bg md:hidden">
          <div className="mx-auto max-w-6xl px-6 py-3 sm:px-8">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-3 text-base text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
