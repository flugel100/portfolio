import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { Dict } from "@/content/i18n";
import { waLink } from "@/content/site";
import { Container } from "./section";
import { Reveal } from "./reveal";

export function Hero({ t }: { t: Dict }) {
  return (
    <section className="relative flex min-h-[78svh] items-center pt-8 pb-16">
      <Container>
        <div className="max-w-4xl">
          <Reveal>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-line px-3.5 py-1.5 text-xs text-fg-muted">
              <span className="relative grid size-2 place-items-center">
                <span className="absolute size-2 animate-ping rounded-full bg-accent/60" />
                <span className="size-1.5 rounded-full bg-accent" />
              </span>
              {t.hero.status}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-8 text-display font-semibold text-balance">
              {t.hero.headline[0]}
              <br />
              <span className="text-fg-muted">{t.hero.headline[1]}</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-8 max-w-2xl text-lead text-fg-muted text-pretty">
              {t.hero.lead}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#work"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-fg px-6 text-sm font-medium text-bg transition-opacity hover:opacity-88"
              >
                {t.hero.ctaPrimary}
                <ArrowDown
                  size={16}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </a>
              <a
                href={waLink(t.contact.waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-line px-6 text-sm font-medium transition-colors hover:border-line-strong hover:bg-bg-subtle"
              >
                {t.hero.ctaSecondary}
                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  className="text-fg-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
