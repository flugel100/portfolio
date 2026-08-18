import type { Lang } from "@/content/site";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { getDict } from "@/content/i18n";

/**
 * Data terstruktur schema.org (JSON-LD).
 *
 * Gunanya bukan menaikkan peringkat secara langsung, melainkan membuat mesin
 * pencari MEMAHAMI halaman ini: bahwa "Ali Torihin" adalah seorang ORANG yang
 * bekerja sebagai pengembang, bukan sekadar rangkaian kata di sebuah halaman.
 * Itu yang memungkinkan hasil pencarian atas namanya menampilkan identitas
 * yang benar.
 *
 * ATURAN KEJUJURAN tetap berlaku di sini -- justru lebih ketat, karena isinya
 * dibaca mesin dan bisa dipakai membentuk klaim di hasil pencarian. Tidak ada
 * rating, tidak ada jumlah ulasan, tidak ada penghargaan. Hanya yang benar.
 */
export function StructuredData({ lang }: { lang: Lang }) {
  const t = getDict(lang);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.name,
        url: `${site.url}/${lang}/`,
        email: `mailto:${site.email}`,
        jobTitle:
          lang === "id"
            ? "Pengembang aplikasi Android & web"
            : "Android & web application developer",
        description: t.meta.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Yogyakarta",
          addressCountry: "ID",
        },
        sameAs: [site.github],
        knowsAbout: [...new Set(projects.flatMap((p) => p.stack))],
        worksFor: {
          "@type": "Organization",
          name: site.studio,
          url: site.url,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: `${site.url}/${lang}/`,
        name: site.name,
        description: t.meta.description,
        inLanguage: lang === "id" ? "id-ID" : "en-US",
        publisher: { "@id": `${site.url}/#person` },
      },
      // Tiap proyek didaftarkan sebagai karya, bukan sebagai produk yang
      // dijual -- tidak ada harga, stok, atau rating yang dikarang.
      {
        "@type": "ItemList",
        name: t.work.title,
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: p.name,
            description: p.summary[lang],
            author: { "@id": `${site.url}/#person` },
            keywords: p.stack.join(", "),
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
