import type { Dict } from "@/content/i18n";
import { projects } from "@/content/projects";
import { Section } from "./section";
import { Reveal } from "./reveal";

/**
 * Daftar teknologi DITURUNKAN dari data proyek, tidak ditulis manual.
 * Konsekuensinya tidak mungkin muncul teknologi yang tidak dipakai di
 * proyek mana pun -- persis aturan "jangan daftar panjang biar terlihat hebat".
 */
const stackFromProjects = [...new Set(projects.flatMap((p) => p.stack))];

export function Stack({ t }: { t: Dict }) {
  return (
    <Section eyebrow={t.stack.eyebrow} title={t.stack.title} lead={t.stack.lead}>
      <Reveal className="mt-12">
        <ul className="flex flex-wrap gap-2.5">
          {stackFromProjects.map((s) => (
            <li
              key={s}
              className="rounded-lg border border-line px-4 py-2.5 text-sm text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              {s}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
