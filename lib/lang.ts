import { DEFAULT_LANG, LANGS, type Lang } from "@/content/site";

/**
 * Next.js 16 meng-generate tipe route dengan `params.lang: string`, bukan
 * union `"id" | "en"` milik kita. Menyempitkannya di satu tempat jauh lebih
 * aman daripada menaburkan `as Lang` -- kalau suatu saat ada segmen bahasa
 * yang tidak dikenal, ia jatuh ke bahasa bawaan alih-alih meledak saat runtime.
 */
export function toLang(value: string): Lang {
  return (LANGS as readonly string[]).includes(value)
    ? (value as Lang)
    : DEFAULT_LANG;
}
