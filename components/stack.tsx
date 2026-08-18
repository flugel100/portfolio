import type { Dict } from "@/content/i18n";
import { projects } from "@/content/projects";
import { Section } from "./section";
import { Reveal } from "./reveal";

/**
 * Bagian ini bicara ke CALON KLIEN, bukan ke sesama developer.
 *
 * Versi pertama menampilkan seluruh teknologi yang diturunkan dari data
 * proyek -- 16 chip, termasuk `JNI`, `Discord API`, `WebSocket`, dan `Expo`.
 * Itu akurat, tapi bertentangan dengan kalimat di sebelahnya sendiri: bagian
 * ini menjanjikan "daftar panjang tidak membuat siapa pun lebih mampu", lalu
 * memamerkan daftar panjang. Dan JNI tidak berarti apa-apa bagi orang yang
 * sedang menimbang mau menyewa siapa.
 *
 * Yang ditampilkan sekarang dikurasi -- TAPI tetap disaring terhadap data
 * proyek yang sebenarnya. Kalau sebuah nama di SOROTAN tidak dipakai di
 * proyek mana pun, ia hilang dengan sendirinya. Jadi kurasi ini tidak bisa
 * dipakai untuk memamerkan sesuatu yang tidak pernah dikerjakan.
 *
 * Yang granular tidak disembunyikan: semuanya tetap tampil sebagai chip di
 * kartu proyek masing-masing, tempat konteksnya memang berarti.
 */
const SOROTAN = [
  "Flutter",
  "Dart",
  "Kotlin",
  "Rust",
  "TypeScript",
  "Python",
  "C#",
  "Firebase",
];

const dipakaiNyata = new Set(projects.flatMap((p) => p.stack));
const stackFromProjects = SOROTAN.filter((s) => dipakaiNyata.has(s));

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
