import type { Dict } from "@/content/i18n";

/** Satu definisi navigasi, dipakai bersama nav atas, menu mobile, dan command palette. */
export const navItems = (t: Dict) => [
  { href: "#work", label: t.nav.work },
  { href: "#services", label: t.nav.services },
  { href: "#process", label: t.nav.process },
  { href: "#about", label: t.nav.about },
  { href: "#contact", label: t.nav.contact },
];
