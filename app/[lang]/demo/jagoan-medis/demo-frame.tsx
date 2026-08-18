"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ExternalLink, Play } from "lucide-react";
import type { Dict } from "@/content/i18n";
import type { Lang } from "@/content/site";

/**
 * Build web Jagoan Medis berukuran ±42 MB. Menyematkannya secara eager akan
 * merusak Core Web Vitals seluruh situs demi sesuatu yang belum tentu dibuka
 * pengunjung. Karena itu iframe baru dipasang SETELAH ditekan -- sebelum itu
 * nol byte diunduh.
 */
const DEMO_SRC = "/demo/jagoan-medis/app/index.html";

export function DemoFrame({ t, lang }: { t: Dict; lang: Lang }) {
  const [started, setStarted] = useState(false);

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6 sm:px-8 lg:px-12">
          <Link
            href={`/${lang}/`}
            className="inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowLeft size={16} strokeWidth={1.75} />
            {t.demo.back}
          </Link>

          {started && (
            <a
              href={DEMO_SRC}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {t.demo.openNewTab}
              <ExternalLink size={14} strokeWidth={1.75} />
            </a>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-12 sm:px-8 lg:px-12">
        <h1 className="text-title font-semibold text-balance">{t.demo.title}</h1>
        <p className="mt-4 max-w-2xl text-lead text-fg-muted text-pretty">{t.demo.lead}</p>

        {!started ? (
          <div className="mt-10 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-line bg-bg-subtle p-10">
            <div className="max-w-sm text-center">
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-fg px-6 text-sm font-medium text-bg transition-opacity hover:opacity-88"
              >
                <Play size={16} strokeWidth={2} className="fill-current" />
                {t.demo.load}
              </button>
              <p className="mt-5 text-sm text-fg-faint text-pretty">{t.demo.loadNote}</p>
            </div>
          </div>
        ) : (
          <div className="mt-10 flex-1 overflow-hidden rounded-2xl border border-line bg-black">
            <iframe
              src={DEMO_SRC}
              title={t.demo.title}
              loading="lazy"
              className="h-[min(78svh,900px)] w-full"
              allow="autoplay; fullscreen"
            />
          </div>
        )}
      </main>
    </div>
  );
}
