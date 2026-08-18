import { Smartphone, Globe, Server, Rocket } from "lucide-react";
import type { Dict } from "@/content/i18n";
import { Section } from "./section";
import { Reveal } from "./reveal";

const icons = [Smartphone, Globe, Server, Rocket];

export function Services({ t }: { t: Dict }) {
  return (
    <Section
      id="services"
      eyebrow={t.services.eyebrow}
      title={t.services.title}
      lead={t.services.lead}
      className="border-t border-line bg-bg-subtle"
    >
      <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2">
        {t.services.items.map((s, i) => {
          const Icon = icons[i];
          return (
            <Reveal key={s.title} delay={i * 0.05}>
              <div className="flex gap-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-bg text-accent">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-fg-muted text-pretty">{s.body}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
