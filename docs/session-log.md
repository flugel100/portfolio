# Session Log — Portofolio (app.flugel.my.id)

> Kronologi terbalik. Terbaru di atas.
>
> **Berkas ini TIDAK ikut ter-deploy.** `next build` hanya mengekspor route dan
> isi `public/`, dan `tools/deploy.sh` membuang `docs/` dari webroot secara
> eksplisit. Versi situs sebelumnya sempat menyajikan catatan seperti ini ke
> publik (HTTP 200) berisi nama & id Cloud Firewall Linode — jangan diulang.

---

## 2026-08-18 — Bangun ulang dengan Next.js

**Task:** Versi lama (HTML tulisan tangan, dibangun hari yang sama) dinilai Tor
"terlalu AI dan generik, tidak interaktif, tidak multifungsi". Dibangun ulang
sebagai Next.js static export, dua bahasa, target audiens klien freelance.

**Keputusan desain — diturunkan dari riset, bukan daftar tren:**
Empat prinsip yang dipakai bersama Stripe/Linear/Vercel: kontras tinggi,
whitespace berlebih, monokrom + SATU aksen yang dipakai hemat, tipografi
geometris ketat. Riset yang sama menyebut kesan premium datang dari
**kerapatan interaksi**, bukan animasi besar — itu yang menjawab keluhan
"tidak interaktif". Untuk "tidak multifungsi": Jagoan Medis bisa
**benar-benar dimainkan** di halaman demo.

**Menyimpang dari brief, disengaja:**
1. **Motion/Framer Motion dihapus** — tidak dipakai sama sekali. Scroll reveal
   CSS lebih andal sekaligus lebih ringan (lihat bug di bawah), dan menyisakan
   pustaka animasi yang tidak terpakai melanggar aturan brief sendiri soal
   dependency.
2. "Skills" digabung ke "Tech Stack" — memisahkannya redundan.
3. Daftar teknologi **diturunkan dari data proyek**, bukan ditulis manual.

**Bug yang ditemukan lewat pengukuran, bukan lewat membaca kode:**

1. **`opacity:0` milik Motion ikut tertulis ke HTML statis** — terverifikasi di
   `out/id/index.html`. Tanpa JavaScript, seluruh halaman di bawah hero tidak
   terlihat. Teks tetap ada di DOM (crawler aman), tapi manusia melihat kosong.
2. **IntersectionObserver rapuh terhadap gulir cepat.** Diukur: gulir cepat
   menyisakan **25 dari 32** elemen tetap tersembunyi; gulir pelan memunculkan
   semuanya. Observer hanya dipanggil saat status perpotongan BERUBAH — elemen
   yang melintasi viewport di antara dua frame tidak pernah tercatat. Di HP,
   satu flick cukup meninggalkan section kosong. Menambal dengan
   `boundingClientRect.top < 0` TIDAK menolong: callback-nya memang tidak
   pernah dipanggil.
   → `animation-timeline: view()` menyelesaikan keduanya (dihitung dari posisi
   gulir, bukan kejadian), dibungkus `@supports` sehingga peramban tanpa
   dukungan cukup menampilkan isinya. Diuji pada kasus terburuk — lompat
   langsung ke dasar halaman — **0 dari 32 tersembunyi**.
3. **`--fg-faint` gagal kontras**: 3,27 (terang) & 3,78 (gelap), padahal dipakai
   untuk teks sungguhan. Dinaikkan sampai lolos 4,5 di permukaan tergelap
   sekalipun: `#6f6f78` / `#828290`.
4. **`og:image` menunjuk 404.** Karena WhatsApp jadi jalur kontak utama Tor,
   pratinjau rusak justru muncul di tempat paling penting. Dibuatkan.
5. **`rsync --exclude 'demo/'` membuang `id/demo/` dan `en/demo/`.** Tanpa
   garis miring di depan, pola itu cocok di kedalaman mana pun, jadi halaman
   demo 404 di produksi. Ketahuan karena verifikasi menembak **URL hidup**,
   bukan memeriksa berkas lokal.

**Refinement (2 putaran, sesuai brief):**
- Putaran 1: `--spacing-section` 12rem → 7rem. Nilai itu dipakai untuk padding
  atas DAN bawah, jadi jarak terlihat adalah dua kalinya — 384px rongga membuat
  halaman 7.664px dan terasa seperti menggulir ruang kosong. Turun ke 6.662px.
- Putaran 2: tombol hero seragam di mobile; kartu kontak dirapatkan (dulu
  `justify-between` menyisakan rongga mati di tengah).

**Batas kejujuran yang mengikat isi:** hampir semua repo privat → mayoritas
proyek ditulis "Repositori privat", bukan ditautkan ke 404. Jagoan Medis belum
listing di Play Store. Spark! terblokir lisensi Unity. Nol testimonial, klien,
atau statistik karangan.

**Status:** `npm run lint` bersih, `npm run build` sukses, 7 halaman statis.
Nol console error & nol overflow horizontal di 375/768/1280/1920 px, dua tema.
`prefers-reduced-motion` diuji benar-benar mematikan animasi. Command palette
(⌘K) bisa dioperasikan penuh lewat papan ketik & mengembalikan fokus. Demo
terverifikasi di situs hidup: **0 iframe sebelum klik**, 42 MB tidak diunduh
sampai diminta.

**Temuan dari HP Tor (setelah deploy) — rongga raksasa di hero:**
Tangkapan layar Tor memperlihatkan hero nyaris kosong: konten terdorong ke
tengah dengan ruang hampa besar di atas dan bawahnya. Chrome-nya dalam mode
"Situs desktop", yang melaporkan viewport ~980x2178.

Direproduksi persis sebelum diperbaiki: pada 980x2178 hero menjadi **1699px**
dengan **634px kosong di atas** dan **666px di bawah**. Sebabnya
`min-h-[78svh]` bertemu `items-center` — pada viewport tinggi, 78% tinggi
layar jadi raksasa dan konten yang dipusatkan meninggalkan rongga di kedua
sisi. Tablet potret (820x1180) kena hal yang sama.

Diperbaiki dengan MEMBATASI, bukan mengecilkan: `min-h-[min(78svh,42rem)]`.
Hasil setelah perbaikan — 980x2178: 1699 → **672px**; 1280x800: **624px
(tidak berubah)**; 375x812: **658px (tidak berubah)**. Batasnya hanya
memotong kasus ekstrem.

**Pelajarannya sama dengan Jagoan Medis:** empat breakpoint standar, dua tema,
dan nol console error semuanya hijau — bug ini tetap lolos, dan baru muncul
dari satu tangkapan layar perangkat nyata. Ukuran viewport yang diuji tidak
pernah cukup mewakili yang dipakai orang.

**Menunggu Tor:**
- Repo masih **privat**. Untuk audiens klien, repo publik adalah bukti kualitas
  kode — tinggal `gh repo edit flugel100/portfolio --visibility public`.
- Belum ada foto diri. Layout dirancang tanpa foto sejak awal, bukan ditambal.
