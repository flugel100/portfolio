export const LANGS = ["id", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "id";

export const site = {
  name: "Ali Torihin",
  studio: "flugel100",
  domain: "app.flugel.my.id",
  url: "https://app.flugel.my.id",
  email: "ali.torihin100@gmail.com",
  /** Nomor dalam format internasional tanpa "+" -- dipakai untuk tautan wa.me. */
  whatsapp: "6285290035740",
  whatsappDisplay: "+62 852-9003-5740",
  github: "https://github.com/flugel100",
  location: { id: "Yogyakarta, Indonesia", en: "Yogyakarta, Indonesia" },
} as const;

export const waLink = (message?: string) =>
  `https://wa.me/${site.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
