import type { Dict } from "@/content/i18n";
import { Section } from "./section";
import { Reveal } from "./reveal";

export function Process({ t }: { t: Dict }) {
  return (
    <Section
      id="process"
      eyebrow={t.process.eyebrow}
      title={t.process.title}
      lead={t.process.lead}
    >
      <ol className="mt-16 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {t.process.steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.05} className="bg-bg">
            <li className="flex h-full flex-col p-8">
              <span className="tabular font-mono text-xs text-accent">{s.n}</span>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-sm text-fg-muted text-pretty">{s.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
