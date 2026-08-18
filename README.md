# Portofolio — app.flugel.my.id

Situs portofolio [Ali Torihin](https://app.flugel.my.id) · studio **flugel100**.
Next.js dengan static export penuh, dua bahasa (Indonesia & Inggris).

**Live:** https://app.flugel.my.id

---

## Kenapa dibangun seperti ini

Beberapa keputusan di repo ini diambil karena pengukuran, bukan preferensi.
Ringkasnya di bawah; penalarannya lengkap ada di komentar kode dan
[`docs/session-log.md`](docs/session-log.md).

### Static export, bukan server

`output: "export"` menghasilkan berkas statis murni yang dilayani nginx apa
adanya. Tidak ada proses Node yang harus dijaga hidup, nol biaya operasional,
dan praktis tidak bisa *down*. Untuk situs yang isinya jarang berubah, server
hanya menambah hal yang bisa rusak.

### Scroll reveal murni CSS

Dua pendekatan sebelumnya gagal, dan cara gagalnya layak dicatat:

1. **`initial={{opacity:0}}` milik Motion ikut tertulis ke HTML hasil export.**
   Pengunjung tanpa JavaScript melihat halaman kosong di bawah hero. Teksnya
   ada di DOM — mesin telusur aman, manusia tidak.
2. **IntersectionObserver rapuh terhadap gulir cepat.** Diukur langsung:
   menggulir cepat menyisakan **25 dari 32** elemen tetap tersembunyi;
   dengan gulir pelan semuanya muncul. Observer hanya dipanggil saat status
   perpotongan *berubah*, sehingga elemen yang melintasi viewport di antara
   dua frame tidak pernah tercatat. Di HP, satu *flick* cukup meninggalkan
   section kosong.

`animation-timeline: view()` tidak punya keduanya — posisinya dihitung dari
posisi gulir, bukan dari kejadian yang bisa terlewat. Dibungkus `@supports`,
jadi peramban yang belum mendukung cukup menampilkan isinya tanpa animasi.
Diuji pada kasus terburuk (lompat langsung ke dasar halaman): **0 dari 32
tersembunyi**.

### Tanpa pustaka animasi

Setelah reveal pindah ke CSS, tidak ada lagi yang membutuhkannya. Dependensi
runtime tinggal empat: `next`, `react`, `react-dom`, `lucide-react`.

### i18n tanpa dependensi

Route `/[lang]` + `generateStaticParams` + kamus TypeScript biasa
([`content/i18n/`](content/i18n)). Versi Inggris **ditulis ulang**, bukan
diterjemahkan kata per kata. Tipe kamus diturunkan dari versi Indonesia
sebagai kontrak bentuk — kunci yang tertinggal ketahuan saat *build*.

### Isi yang tidak dikarang

Tidak ada testimonial, jumlah pengguna, klien, atau penghargaan. Angka yang
tampil diverifikasi ke sumbernya. Proyek yang repositorinya privat ditulis apa
adanya sebagai "Repositori privat" ketimbang menautkan halaman 404.

---

## Menjalankan

```bash
npm install
npm run dev            # http://localhost:3000 -> dialihkan ke /id/
npm run lint
npm run build          # menghasilkan out/
```

## QA

```bash
node tools/qa/tangkap.mjs <base> <keluar> <path> <skema> <lebar> <tinggi>
node tools/qa/periksa.mjs https://app.flugel.my.id
```

`tangkap.mjs` menangkap **per-viewport pada posisi gulir nyata**, bukan
`fullPage` — `animation-timeline: view()` dihitung dari tinggi viewport,
sehingga tangkapan `fullPage` memaksa viewport setinggi halaman dan membuat
seluruh reveal terbaca "belum masuk rentang". Hasilnya halaman tampak kosong:
artefak alat, bukan keadaan yang dilihat pengguna.

`periksa.mjs` mengukur kontras di kedua tema dan memastikan
`prefers-reduced-motion` benar-benar mematikan animasi.

## Deploy

```bash
./tools/deploy.sh
```

Lint → build → cadangkan situs hidup → sinkronkan → verifikasi **8 URL hidup**
(bukan berkas lokal). Dua hal dijaga khusus: `.well-known/` tidak pernah
dihapus (jalur ACME; menghapusnya memutus perpanjangan sertifikat dan baru
ketahuan saat kedaluwarsa), dan `docs/` tidak pernah ikut terbit.

## Struktur

```
app/[lang]/          halaman & metadata per bahasa
components/          section + primitif UI
content/projects.ts  SATU sumber data proyek
content/i18n/        kamus id & en
tools/deploy.sh      deploy + verifikasi
tools/qa/            tangkapan layar & pemeriksaan kontras
```
