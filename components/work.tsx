import Link from "next/link";
import { Lock, Play } from "lucide-react";
import type { Dict } from "@/content/i18n";
import type { Lang } from "@/content/site";
import { featuredProject, otherProjects, type Project } from "@/content/projects";
import { Container, Eyebrow } from "./section";
import { Reveal } from "./reveal";

function StatusDot({ status, t }: { status: Project["status"]; t: Dict }) {
  const tone =
    status === "live"
      ? "bg-accent"
      : status === "prerelease"
        ? "bg-amber-500"
        : "bg-fg-faint";
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-faint">
      <span className={`size-1.5 rounded-full ${tone}`} />
      {t.work.status[status]}
    </span>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li
          key={s}
          className="rounded-md border border-line px-2.5 py-1 font-mono text-[11px] text-fg-muted"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

export function Work({ t, lang }: { t: Dict; lang: Lang }) {
  const f = featuredProject;

  return (
    <section id="work" className="py-(--spacing-section)" aria-labelledby="work-title">
      <Container>
        <Reveal className="max-w-3xl">
          <Eyebrow>{t.work.eyebrow}</Eyebrow>
          <h2 id="work-title" className="mt-5 text-title font-semibold text-balance">
            {t.work.title}
          </h2>
          <p className="mt-6 text-lead text-fg-muted text-pretty">{t.work.lead}</p>
        </Reveal>

        {/* ── Sorotan ─────────────────────────────────────────────────────
            Diberi perlakuan berbeda dari yang lain, bukan sekadar kartu
            yang dibesarkan: ia satu-satunya yang bisa langsung DICOBA. */}
        <Reveal className="mt-16">
          <article className="overflow-hidden rounded-2xl border border-line bg-bg-subtle">
            <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:p-14">
              <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-fg">
                    {t.work.featuredLabel}
                  </span>
                  <StatusDot status={f.status} t={t} />
                </div>

                <h3 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {f.name}
                </h3>
                <p className="mt-2 font-mono text-xs text-fg-faint">{f.kind[lang]}</p>
                <p className="mt-6 text-fg-muted text-pretty">{f.summary[lang]}</p>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/${lang}${f.demo}/`}
                    className="group inline-flex h-11 items-center gap-2 rounded-lg bg-fg px-5 text-sm font-medium text-bg transition-opacity hover:opacity-88"
                  >
                    <Play size={15} strokeWidth={2} className="fill-current" />
                    {t.work.tryDemo}
                  </Link>
                  <span className="text-xs text-fg-faint">{t.work.demoNote}</span>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                {f.metrics && (
                  <dl className="grid grid-cols-3 gap-4 border-b border-line pb-8">
                    {f.metrics.map((m) => (
                      <div key={m.label[lang]}>
                        <dt className="sr-only">{m.label[lang]}</dt>
                        <dd>
                          <span className="tabular block text-3xl font-semibold tracking-tight">
                            {m.value}
                          </span>
                          <span className="mt-1 block text-xs text-fg-faint">
                            {m.label[lang]}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                <ul className="space-y-4">
                  {f.highlights.map((h) => (
                    <li key={h[lang]} className="flex gap-3 text-sm text-fg-muted">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                      <span className="text-pretty">{h[lang]}</span>
                    </li>
                  ))}
                </ul>

                <Stack items={f.stack} />
              </div>
            </div>
          </article>
        </Reveal>

        {/* ── Sisanya ────────────────────────────────────────────────────
            Baris editorial, bukan grid kartu. Tidak ada yang dibuat
            tampak bisa diklik kalau reponya memang privat. */}
        <div className="mt-6 divide-y divide-line border-t border-line">
          {otherProjects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <article className="group grid gap-6 py-10 md:grid-cols-[auto_1fr_auto] md:gap-10">
                <span className="tabular font-mono text-xs text-fg-faint md:pt-1.5">
                  {String(i + 2).padStart(2, "0")}
                </span>

                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="text-xl font-semibold tracking-tight">{p.name}</h3>
                    <p className="font-mono text-xs text-fg-faint">{p.kind[lang]}</p>
                  </div>

                  <p className="mt-3 text-fg-muted text-pretty">{p.summary[lang]}</p>

                  <ul className="mt-4 space-y-2">
                    {p.highlights.map((h) => (
                      <li key={h[lang]} className="flex gap-3 text-sm text-fg-muted">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-line-strong" />
                        <span className="text-pretty">{h[lang]}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5">
                    <Stack items={p.stack} />
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <StatusDot status={p.status} t={t} />
                  {p.metrics?.map((m) => (
                    <p key={m.label[lang]} className="text-sm text-fg-muted">
                      <span className="tabular font-semibold text-fg">{m.value}</span>{" "}
                      {m.label[lang]}
                    </p>
                  ))}
                  {p.repo ? (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent underline-offset-4 hover:underline"
                    >
                      {t.work.viewSource}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-fg-faint">
                      <Lock size={12} strokeWidth={1.75} />
                      {t.work.sourcePrivate}
                    </span>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
