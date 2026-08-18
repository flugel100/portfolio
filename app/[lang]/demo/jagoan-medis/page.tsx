import type { Metadata } from "next";
import { LANGS, site } from "@/content/site";
import { toLang } from "@/lib/lang";
import { getDict } from "@/content/i18n";
import { DemoFrame } from "./demo-frame";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/demo/jagoan-medis">): Promise<Metadata> {
  const lang = toLang((await params).lang);
  const t = getDict(lang);
  return {
    title: t.demo.title,
    description: t.demo.lead,
    alternates: { canonical: `${site.url}/${lang}/demo/jagoan-medis/` },
    // Halaman demo tidak perlu bersaing di hasil pencarian dengan halaman
    // utama; isinya cuma bingkai untuk aplikasi lain.
    robots: { index: false, follow: true },
  };
}

export default async function DemoPage({
  params,
}: PageProps<"/[lang]/demo/jagoan-medis">) {
  const lang = toLang((await params).lang);
  const t = getDict(lang);
  return <DemoFrame t={t} lang={lang} />;
}
