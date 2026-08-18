import type { Dict } from "@/content/i18n";
import { site } from "@/content/site";
import { Container } from "./section";

/**
 * Ikon GitHub digambar sendiri: lucide-react v1 membuang seluruh ikon merek
 * (alasan trademark), dan menarik paket ikon kedua hanya demi satu logo
 * melanggar aturan "jangan tambah dependency untuk fitur kecil".
 */
function GithubMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function Footer({ t }: { t: Dict }) {
  return (
    <footer className="border-t border-line py-12">
      <Container>
        <div className="flex flex-col-reverse items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-1.5">
            <p className="text-sm text-fg-muted">
              © {new Date().getFullYear()} {t.footer.rights} — {site.studio}
            </p>
            <p className="text-xs text-fg-faint">{t.footer.built}</p>
          </div>

          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid size-10 place-items-center rounded-lg border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            <GithubMark size={18} />
          </a>
        </div>
      </Container>
    </footer>
  );
}
