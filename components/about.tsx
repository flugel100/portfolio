import type { Dict } from "@/content/i18n";
import type { Lang } from "@/content/site";
import { site } from "@/content/site";
import { Container, Eyebrow } from "./section";
import { Reveal } from "./reveal";

export function About({ t, lang }: { t: Dict; lang: Lang }) {
  const facts = [
    { k: t.about.facts.studio, v: site.studio },
    { k: t.about.facts.focus, v: t.about.facts.focusValue },
    { k: t.about.facts.base, v: site.location[lang] },
  ];

  return (
    <section
      id="about"
      className="border-t border-line bg-bg-subtle py-(--spacing-section)"
      aria-labelledby="about-title"
    >
      <Container>
        <div className="grid items-start gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
          <div>
            <Reveal>
              <Eyebrow>{t.about.eyebrow}</Eyebrow>
              <h2 id="about-title" className="mt-5 text-title font-semibold text-balance">
                {t.about.title}
              </h2>
            </Reveal>

            <div className="mt-8 space-y-6">
              {t.about.body.map((p, i) => (
                <Reveal key={i} delay={0.05 + i * 0.05}>
                  <p className="text-lead text-fg-muted text-pretty">{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <blockquote className="mt-12 border-l-2 border-accent pl-6">
                <p className="text-xl font-medium tracking-tight text-balance sm:text-2xl">
                  {t.about.quote}
                </p>
              </blockquote>
            </Reveal>
          </div>

          {/* Sticky di layar lebar: kolom kanan jauh lebih pendek daripada
              kolom teks, jadi tanpa ini ada ~600px ruang kosong yang terbaca
              sebagai halaman belum selesai, bukan sebagai kelegaan. */}
          <Reveal delay={0.1} className="lg:sticky lg:top-24 lg:self-start">
            <dl className="divide-y divide-line rounded-xl border border-line bg-bg">
              {facts.map((f) => (
                <div key={f.k} className="flex items-baseline justify-between gap-6 px-6 py-5">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
                    {f.k}
                  </dt>
                  <dd className="text-right text-sm font-medium">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
