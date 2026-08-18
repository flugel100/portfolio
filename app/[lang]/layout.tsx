import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { LANGS, site } from "@/content/site";
import { toLang } from "@/lib/lang";
import { getDict } from "@/content/i18n";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const lang = toLang((await params).lang);
  const t = getDict(lang);
  const path = `${site.url}/${lang}/`;

  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    applicationName: site.name,
    authors: [{ name: site.name }],
    creator: site.name,
    alternates: {
      canonical: path,
      // hreflang wajib menunjuk KEDUA bahasa dari tiap halaman, bukan cuma
      // ke dirinya sendiri -- kalau tidak, mesin telusur tidak tahu keduanya
      // adalah halaman yang sama dalam bahasa berbeda.
      languages: {
        id: `${site.url}/id/`,
        en: `${site.url}/en/`,
        "x-default": `${site.url}/id/`,
      },
    },
    openGraph: {
      type: "website",
      url: path,
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      locale: lang === "id" ? "id_ID" : "en_US",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: t.meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      images: ["/og.png"],
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Menerapkan tema tersimpan SEBELUM paint pertama. Kalau ditunda ke komponen
 * React, browser terlanjur melukis satu frame dengan tema yang salah dan itu
 * terlihat sebagai kedipan putih.
 */
const preScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){d.setAttribute("data-theme",t)}}catch(e){}})()`;

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const lang = toLang((await params).lang);

  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preScript }} />
      </head>
      <body className="bg-bg text-fg font-sans antialiased">{children}</body>
    </html>
  );
}
