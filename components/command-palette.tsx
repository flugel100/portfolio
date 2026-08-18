"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CornerDownLeft,
  Languages,
  Mail,
  MessageCircle,
  Moon,
  Search,
} from "lucide-react";
import type { Dict } from "@/content/i18n";
import { projects } from "@/content/projects";
import { site, waLink, type Lang } from "@/content/site";
import { navItems } from "@/lib/nav";
import { applyTheme } from "./theme-toggle";

interface Item {
  id: string;
  label: string;
  group: string;
  icon?: React.ReactNode;
  run: () => void;
}

export function CommandPalette({ t, lang }: { t: Dict; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  /** Fokus dikembalikan ke pemicu saat ditutup -- syarat dasar dialog yang benar. */
  const restoreTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    // Saat dibuka lewat pintasan papan ketik, elemen yang tadinya fokus bisa
    // saja <body> -- mengembalikan fokus ke sana berarti pengguna papan ketik
    // terlempar ke awal dokumen. Tombol pemicu jadi tujuan cadangan.
    const prev = restoreTo.current;
    const target = prev && prev !== document.body ? prev : triggerRef.current;
    target?.focus();
  }, []);

  const openPalette = useCallback(() => {
    restoreTo.current = document.activeElement as HTMLElement;
    setOpen(true);
  }, []);

  /**
   * Daftar perintah sengaja TIDAK memanggil `close()` sendiri. Kalau ia
   * melakukannya, memo ini bergantung pada `close` -- yang membaca ref --
   * dan React menganggapnya sebagai akses ref saat render. Penutupan
   * dikerjakan terpusat di `select()` di bawah.
   */
  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      if (href.startsWith("#")) {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(href);
      }
    };

    return [
      ...navItems(t).map((n) => ({
        id: `nav-${n.href}`,
        label: n.label,
        group: t.palette.groupNav,
        icon: <ArrowRight size={15} strokeWidth={1.75} />,
        run: go(n.href),
      })),
      ...projects.map((p) => ({
        id: `proj-${p.slug}`,
        label: p.name,
        group: t.palette.groupProjects,
        icon: <ArrowRight size={15} strokeWidth={1.75} />,
        run: p.demo ? go(`/${lang}${p.demo}/`) : go("#work"),
      })),
      {
        id: "act-theme",
        label: t.palette.toggleTheme,
        group: t.palette.groupActions,
        icon: <Moon size={15} strokeWidth={1.75} />,
        run: () => {
          const now = document.documentElement.getAttribute("data-theme");
          const isDark =
            now === "dark" ||
            (now !== "light" &&
              window.matchMedia("(prefers-color-scheme: dark)").matches);
          applyTheme(isDark ? "light" : "dark");
        },
      },
      {
        id: "act-lang",
        label: t.palette.switchLang,
        group: t.palette.groupActions,
        icon: <Languages size={15} strokeWidth={1.75} />,
        run: go(`/${lang === "id" ? "en" : "id"}/`),
      },
      {
        id: "act-wa",
        label: t.palette.openWa,
        group: t.palette.groupActions,
        icon: <MessageCircle size={15} strokeWidth={1.75} />,
        run: () =>
          window.open(waLink(t.contact.waMessage), "_blank", "noopener,noreferrer"),
      },
      {
        id: "act-mail",
        label: t.palette.openEmail,
        group: t.palette.groupActions,
        icon: <Mail size={15} strokeWidth={1.75} />,
        run: () => {
          window.location.href = `mailto:${site.email}`;
        },
      },
    ];
  }, [t, lang, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query]);

  const select = useCallback(
    (item: Item) => {
      close();
      item.run();
    },
    [close],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else openPalette();
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, openPalette]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Kunci scroll latar saat dialog terbuka.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[active];
      if (item) select(item);
    }
  };

  let lastGroup = "";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openPalette}
        aria-label={t.nav.commandHint}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-line px-2.5 text-sm text-fg-faint transition-colors hover:border-line-strong hover:text-fg-muted sm:pr-1.5"
      >
        <Search size={15} strokeWidth={1.75} />
        <span className="hidden sm:inline">{t.nav.commandHint}</span>
        <kbd className="ml-1 hidden rounded border border-line bg-bg-subtle px-1.5 py-0.5 font-mono text-[10px] text-fg-faint sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]"
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.commandHint}
        >
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={close}
            className="palette-overlay absolute inset-0 cursor-default bg-black/45 backdrop-blur-[2px]"
          />
          <div
            className="palette-panel relative w-full max-w-lg overflow-hidden rounded-xl border border-line bg-bg-raised shadow-2xl"
            onKeyDown={onListKey}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={16} strokeWidth={1.75} className="shrink-0 text-fg-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  // Hasil menyempit saat mengetik; tanpa ini Enter bisa
                  // menembak item yang sudah tidak ada di daftar.
                  setActive(0);
                }}
                placeholder={t.palette.placeholder}
                aria-label={t.palette.placeholder}
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-fg-faint"
              />
            </div>

            <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-1.5" role="listbox">
              {filtered.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-fg-faint">{t.palette.empty}</p>
              )}
              {filtered.map((item, i) => {
                const header = item.group !== lastGroup ? item.group : null;
                lastGroup = item.group;
                return (
                  <div key={item.id}>
                    {header && (
                      <p className="px-3 pt-3 pb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
                        {header}
                      </p>
                    )}
                    <button
                      type="button"
                      data-idx={i}
                      role="option"
                      aria-selected={i === active}
                      onMouseMove={() => setActive(i)}
                      onClick={() => select(item)}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        i === active ? "bg-accent-soft text-fg" : "text-fg-muted"
                      }`}
                    >
                      <span className="text-fg-faint">{item.icon}</span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {i === active && (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-fg-faint">
                          <CornerDownLeft size={11} /> {t.palette.hint}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
