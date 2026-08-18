import type { Lang } from "./site";

/**
 * SATU sumber data proyek. Dipakai bersama oleh kartu, halaman demo,
 * metadata, dan command palette -- supaya tidak ada duplikasi yang bisa
 * berbeda cerita.
 *
 * ATURAN KEJUJURAN (mengikat, dari brief Tor):
 * - Tidak ada testimonial, jumlah pengguna, klien, revenue, atau penghargaan.
 * - `metrics` HANYA angka yang benar-benar terverifikasi. Nilai 139 test dan
 *   400 puzzle Jagoan Medis diukur langsung 2026-08-18; 85 test Kalkulator
 *   Nakes berasal dari suite-nya sendiri.
 * - `status` menyatakan keadaan sebenarnya. Jagoan Medis BELUM listing di
 *   Play Store, jadi tidak boleh ditulis "tersedia di Play Store".
 * - `repo` hanya diisi kalau reponya memang publik. Mayoritas repo Tor privat,
 *   jadi field ini sengaja kosong ketimbang menautkan halaman 404.
 */

type Localized = Record<Lang, string>;

export type ProjectStatus = "live" | "development" | "prerelease";

export interface Project {
  slug: string;
  name: string;
  /** Kategori pendek, tampil sebagai eyebrow di kartu. */
  kind: Localized;
  summary: Localized;
  /** Poin yang menjelaskan KEPUTUSAN teknis, bukan daftar fitur. */
  highlights: Localized[];
  stack: string[];
  status: ProjectStatus;
  metrics?: { value: string; label: Localized }[];
  /** Route demo internal yang benar-benar bisa dipakai pengunjung. */
  demo?: string;
  repo?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "jagoan-medis",
    name: "Jagoan Medis",
    featured: true,
    kind: {
      id: "Game · Studio flugel100",
      en: "Game · flugel100 studio",
    },
    summary: {
      id: "Teka-teki silang bertema medis untuk Android dan web dari satu basis kode Flutter. Dua bahasa penuh — bukan sekadar antarmuka yang diterjemahkan, tapi soal yang dibangkitkan terpisah per bahasa.",
      en: "A medical-themed crossword for Android and web from a single Flutter codebase. Fully bilingual — not just a translated interface, but puzzles generated separately for each language.",
    },
    highlights: [
      {
        id: "Teka-teki silang tidak bisa diterjemahkan. Persilangan menuntut huruf yang identik dan panjang kata mengunci petak, jadi soal tiap bahasa dibangkitkan sendiri-sendiri.",
        en: "Crosswords cannot be translated. Intersections demand identical letters and word length locks the grid, so each language gets its own generated puzzles.",
      },
      {
        id: "Ukuran bank kata ditentukan lewat pengukuran, bukan tebakan. Yang kurang ternyata kata pendek, bukan jumlah katanya. Ada 96 istilah panjang yang tidak pernah terpakai sekali pun.",
        en: "Word bank size was decided by measurement, not guesswork. What was missing were short words, not more words. 96 long terms were never used once.",
      },
    ],
    stack: ["Flutter", "Dart", "Firebase", "GitHub Actions"],
    status: "prerelease",
    metrics: [
      { value: "139", label: { id: "uji otomatis", en: "automated tests" } },
      { value: "400", label: { id: "soal", en: "puzzles" } },
      { value: "2", label: { id: "bahasa", en: "languages" } },
    ],
    demo: "/demo/jagoan-medis",
  },
  {
    slug: "hermod",
    name: "Hermod",
    kind: {
      id: "Aplikasi Android · Rust + Kotlin",
      en: "Android app · Rust + Kotlin",
    },
    summary: {
      id: "Terminal dan klien SSH untuk Android, supaya server bisa dikendalikan penuh dari HP tanpa perlu laptop. Intinya ditulis dalam Rust; antarmukanya Jetpack Compose.",
      en: "A terminal and SSH client for Android, so a server can be driven entirely from a phone without reaching for a laptop. Rust at the core; Jetpack Compose for the interface.",
    },
    highlights: [
      {
        id: "Batas antar-bahasa Rust↔Kotlin lewat JNI. Ini bagian yang paling mudah salah dan paling sulit di-debug, jadi paling ketat diuji.",
        en: "A Rust↔Kotlin boundary over JNI. This is the easiest part to get wrong and the hardest to debug, so it gets the tightest tests.",
      },
      {
        id: "Benar-benar menyambung ke server lewat internet dari HP, bukan simulasi.",
        en: "Genuinely connects to a server over the internet from a phone, not a simulation.",
      },
    ],
    stack: ["Rust", "Kotlin", "Jetpack Compose", "JNI"],
    status: "development",
  },
  {
    slug: "dex-bot",
    name: "Dex Bot",
    kind: { id: "Otomasi · Python", en: "Automation · Python" },
    summary: {
      id: "Penyaring token bursa terdesentralisasi yang berjalan 24/7. Menilai risiko teknis dan sengaja tidak pernah menjanjikan keuntungan.",
      en: "A decentralised-exchange token screener running 24/7. It assesses technical risk and deliberately never promises profit.",
    },
    highlights: [
      {
        id: "Setiap angka yang dipakai untuk menolak sebuah token wajib tercatat, supaya keputusannya bisa ditelusuri ulang.",
        en: "Every value used to reject a token must be logged, so the decision can be retraced later.",
      },
      {
        id: "Diuji dengan uji mutasi. Penyaring yang tidak pernah bisa gagal adalah penyaring yang tidak bekerja.",
        en: "Verified with mutation testing. A filter that can never fail is a filter that does nothing.",
      },
    ],
    stack: ["Python", "WebSocket", "Discord API"],
    status: "live",
  },
  {
    slug: "kalkulator-nakes",
    name: "Kalkulator Nakes",
    kind: { id: "Aplikasi medis · React Native", en: "Medical app · React Native" },
    summary: {
      id: "Kumpulan kalkulator klinis untuk rekan tenaga kesehatan di lapangan. Offline-first, karena sinyal adalah hal pertama yang hilang saat dibutuhkan.",
      en: "A set of clinical calculators for healthcare workers in the field. Offline-first, because signal is the first thing to disappear when it matters.",
    },
    highlights: [
      {
        id: "Offline-first di sini bukan fitur tambahan tapi syarat, karena dipakai justru di tempat yang tidak ada koneksinya.",
        en: "Offline-first is a requirement, not a feature: it is used exactly where there is no connection.",
      },
      {
        id: "Rumus klinis diuji satu per satu. Kalkulator medis yang salah lebih berbahaya daripada tidak ada kalkulator.",
        en: "Clinical formulas are tested individually. A wrong medical calculator is more dangerous than none.",
      },
    ],
    stack: ["TypeScript", "React Native", "Expo"],
    status: "development",
    metrics: [{ value: "85", label: { id: "uji otomatis", en: "automated tests" } }],
  },
  {
    slug: "spark",
    name: "Spark!",
    kind: { id: "Game · Studio flugel100", en: "Game · flugel100 studio" },
    summary: {
      id: "Puzzle fisika bergaya mesin Rube Goldberg: merangkai benda agar memicu gerakan berantai. Proyek kedua studio, masih dalam pengembangan.",
      en: "A Rube Goldberg-style physics puzzle: arrange objects so they trigger a chain reaction. The studio's second project, still in development.",
    },
    highlights: [
      {
        id: "Fisika 2D dan tata letak yang harus terasa adil. Bagian tersulitnya bukan kodenya, tapi menyetel rasanya.",
        en: "2D physics and layouts that must feel fair. The hardest part isn't the code, it's tuning the feel.",
      },
    ],
    stack: ["C#", "Unity 6"],
    status: "development",
  },
];

export const featuredProject = projects.find((p) => p.featured)!;
export const otherProjects = projects.filter((p) => !p.featured);
export const projectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
