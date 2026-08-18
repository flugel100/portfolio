import type { ReactNode } from "react";
import { Reveal } from "./reveal";

/** Lebar baca konsisten di seluruh halaman -- satu tempat, bukan diulang. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

/** Label kecil di atas judul section. Mono + tracking lebar = terbaca sebagai penanda, bukan judul kedua. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
      {children}
    </p>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-(--spacing-section) ${className}`} aria-labelledby={id ? `${id}-title` : undefined}>
      <Container>
        {(eyebrow || title || lead) && (
          <Reveal className="max-w-3xl">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && (
              <h2 id={id ? `${id}-title` : undefined} className="mt-5 text-title font-semibold text-balance">
                {title}
              </h2>
            )}
            {lead && <p className="mt-6 text-lead text-fg-muted text-pretty">{lead}</p>}
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  );
}
