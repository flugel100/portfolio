import { getDict } from "@/content/i18n";
import { toLang } from "@/lib/lang";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Work } from "@/components/work";
import { Services } from "@/components/services";
import { Process } from "@/components/process";
import { About } from "@/components/about";
import { Stack } from "@/components/stack";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const lang = toLang((await params).lang);
  const t = getDict(lang);

  return (
    <>
      <Nav t={t} lang={lang} />
      <main id="main">
        <Hero t={t} />
        <Work t={t} lang={lang} />
        <Services t={t} />
        <Process t={t} />
        <About t={t} lang={lang} />
        <Stack t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
