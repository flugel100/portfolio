import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import type { Dict } from "@/content/i18n";
import { site, waLink } from "@/content/site";
import { Container, Eyebrow } from "./section";
import { Reveal } from "./reveal";

export function Contact({ t }: { t: Dict }) {
  const channels = [
    {
      href: waLink(t.contact.waMessage),
      external: true,
      icon: MessageCircle,
      label: t.contact.whatsapp,
      value: site.whatsappDisplay,
      note: t.contact.whatsappNote,
      primary: true,
    },
    {
      href: `mailto:${site.email}`,
      external: false,
      icon: Mail,
      label: t.contact.email,
      value: site.email,
      note: t.contact.emailNote,
      primary: false,
    },
  ];

  return (
    <section
      id="contact"
      className="border-t border-line py-(--spacing-section)"
      aria-labelledby="contact-title"
    >
      <Container>
        <Reveal className="max-w-3xl">
          <Eyebrow>{t.contact.eyebrow}</Eyebrow>
          <h2 id="contact-title" className="mt-5 text-title font-semibold text-balance">
            {t.contact.title}
          </h2>
          <p className="mt-6 text-lead text-fg-muted text-pretty">{t.contact.lead}</p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {channels.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.06}>
              <a
                href={c.href}
                {...(c.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={`group flex h-full flex-col gap-6 rounded-xl border p-7 transition-colors sm:p-8 ${
                  c.primary
                    ? "border-accent/40 bg-accent-soft hover:border-accent"
                    : "border-line hover:border-line-strong hover:bg-bg-subtle"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`grid size-10 place-items-center rounded-lg ${
                      c.primary ? "bg-accent text-accent-fg" : "border border-line text-fg-muted"
                    }`}
                  >
                    <c.icon size={18} strokeWidth={1.75} />
                  </span>
                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.75}
                    className="text-fg-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>

                <div>
                  <p className="text-lg font-semibold tracking-tight">{c.label}</p>
                  <p className="mt-1.5 font-mono text-sm break-all text-fg-muted">{c.value}</p>
                  <p className="mt-3 text-xs text-fg-faint">{c.note}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
