#!/usr/bin/env bash
# Deploy portofolio ke /var/www/app.flugel.my.id.
#
# nginx di sana melayani berkas statis apa adanya (`try_files $uri $uri/ =404`)
# dan TIDAK perlu diubah -- output `next build` dengan `output: "export"` sudah
# cocok dengan pola itu.
set -euo pipefail
cd "$(dirname "$0")/.."

WEBROOT="/var/www/app.flugel.my.id"
DEMO_SRC="/root/jagoan-medis/build/web"
DEMO_DEST="$WEBROOT/demo/jagoan-medis/app"
STAMP="$(date +%Y%m%d-%H%M)"

echo "==> Gerbang mutu"
npm run lint
npm run build

echo "==> Cadangkan situs yang sedang hidup"
mkdir -p /root/backup
tar -czf "/root/backup/app.flugel.my.id-${STAMP}.tar.gz" -C /var/www app.flugel.my.id
echo "    /root/backup/app.flugel.my.id-${STAMP}.tar.gz"

echo "==> Sinkronkan halaman"
# --delete membuang sisa build lama, TAPI dua hal wajib selamat:
#   .well-known/ -> jalur tantangan ACME. Menghapusnya memutus perpanjangan
#                   otomatis sertifikat, dan itu baru ketahuan saat kedaluwarsa.
#   /demo/       -> berisi salinan aplikasi lain (±42 MB); disinkronkan
#                   terpisah di bawah supaya tidak ikut terhapus tiap deploy.
#
# Garis miring di DEPAN pada '/demo/' itu penting dan bukan gaya penulisan:
# tanpa itu, rsync mencocokkan direktori bernama `demo` di KEDALAMAN MANA PUN
# -- termasuk `id/demo/` dan `en/demo/` milik halaman demo kita sendiri, yang
# akibatnya tidak pernah ikut ter-deploy dan menghasilkan 404. Ketahuan karena
# verifikasi menembak URL hidup, bukan memeriksa berkas lokal.
rsync -a --delete \
  --exclude '/.well-known/' \
  --exclude '/demo/' \
  out/ "$WEBROOT/"

echo "==> Sinkronkan demo Jagoan Medis"
if [ -d "$DEMO_SRC" ]; then
  mkdir -p "$DEMO_DEST"
  rsync -a --delete "$DEMO_SRC/" "$DEMO_DEST/"

  # Skrip SDK CrazyGames DIBUANG dari salinan yang tayang di domain ini.
  #
  # Bundel game-nya identik dengan yang diunggah ke CrazyGames -- yang berbeda
  # hanya satu tag <script>. Di luar domain CrazyGames, SDK itu tidak
  # berfungsi apa pun (`initialize()` sudah menelan kegagalannya), jadi
  # memuatnya hanya menarik berkas pihak ketiga ke domain sendiri tanpa alasan.
  # Keputusan Tor, 20 Agustus 2026.
  #
  # Kenapa di SINI dan bukan diedit manual sekali: pernah dilakukan manual,
  # lalu deploy berikutnya menyalin build mentah dan memasangnya kembali tanpa
  # ada yang memberi tahu. Keputusan yang tidak tertulis di skrip akan selalu
  # kalah oleh otomasi.
  sed -i 's|[[:space:]]*<script src="https://sdk\.crazygames\.com/[^"]*"></script>||' \
    "$DEMO_DEST/index.html"

  echo "    $(du -sh "$DEMO_DEST" | cut -f1) ter-deploy"
else
  echo "    LEWAT: $DEMO_SRC tidak ada -- tombol demo akan 404."
fi

# Catatan kerja internal TIDAK ikut terbit. Versi lama situs ini sempat
# menyajikan docs/session-log.md ke publik (HTTP 200) berisi nama & id Cloud
# Firewall Linode serta posture port. rsync --delete di atas sudah
# membuangnya; baris ini menjaga kalau suatu saat ada yang menaruhnya lagi.
rm -rf "$WEBROOT/docs"

echo "==> Verifikasi terhadap URL HIDUP (bukan berkas lokal)"
fail=0
check() { # url  kode-harapan
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$1")
  if [ "$code" = "$2" ]; then printf '    OK    %-52s %s\n' "$1" "$code"
  else printf '    GAGAL %-52s %s (harusnya %s)\n' "$1" "$code" "$2"; fail=1; fi
}
check https://app.flugel.my.id/            200
check https://app.flugel.my.id/id/         200
check https://app.flugel.my.id/en/         200
check https://app.flugel.my.id/og.png      200
check https://app.flugel.my.id/sitemap.xml 200
check https://app.flugel.my.id/id/demo/jagoan-medis/ 200
check https://app.flugel.my.id/demo/jagoan-medis/app/index.html 200
check https://app.flugel.my.id/docs/session-log.md 404

# Kode 200 saja TIDAK cukup: sinkronisasi separuh jalan atau cache basi tetap
# menjawab 200 sambil menyajikan isi yang lama. Dua pemeriksaan di bawah
# menguji ISI-nya.
periksa_isi() { # url  pola  jumlah-harapan  keterangan
  n=$(curl -s --max-time 25 "$1" | grep -c "$2" || true)
  if [ "$n" = "$3" ]; then printf '    OK    %-52s %s\n' "$4" "$n"
  else printf '    GAGAL %-52s %s (harusnya %s)\n' "$4" "$n" "$3"; fail=1; fi
}
periksa_isi https://app.flugel.my.id/demo/jagoan-medis/app/ \
  "sdk.crazygames.com" 0 "demo bebas skrip pihak ketiga"

# Aset galeri yang tayang harus SAMA PERSIS dengan yang ada di repo.
ASET="karya/jagoan-medis/id/02.webp"
live=$(curl -s --max-time 40 "https://app.flugel.my.id/$ASET" | md5sum | cut -d' ' -f1)
repo=$(md5sum "public/$ASET" | cut -d' ' -f1)
if [ "$live" = "$repo" ]; then printf '    OK    %-52s cocok\n' "aset galeri identik dengan repo"
else printf '    GAGAL %-52s %s != %s\n' "aset galeri" "$live" "$repo"; fail=1; fi

[ "$fail" -eq 0 ] || { echo "==> ADA YANG GAGAL"; exit 1; }

# Beri tahu mesin pencari lewat IndexNow (Bing, Yandex, Seznam sekaligus).
#
# Ini satu-satunya jalur pemberitahuan yang TIDAK menuntut akun: verifikasinya
# lewat berkas kunci yang di-host di domain ini sendiri. Ping sitemap gaya lama
# sudah dihentikan Google maupun Bing, jadi jangan dipakai lagi.
#
# Kuncinya memang publik by design -- ia harus bisa dibaca siapa pun di
# https://app.flugel.my.id/<kunci>.txt supaya kepemilikan domain terbukti.
INDEXNOW_KEY="$(ls public/*.txt 2>/dev/null | grep -oE '[a-f0-9]{64}' | head -1)"
if [ -n "$INDEXNOW_KEY" ]; then
  code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "https://api.indexnow.org/indexnow" \
    -H "Content-Type: application/json; charset=utf-8" --max-time 20 \
    -d "{\"host\":\"app.flugel.my.id\",\"key\":\"$INDEXNOW_KEY\",\"keyLocation\":\"https://app.flugel.my.id/$INDEXNOW_KEY.txt\",\"urlList\":[\"https://app.flugel.my.id/id/\",\"https://app.flugel.my.id/en/\"]}" || echo "000")
  # 200/202 sama-sama berarti diterima. Kegagalan di sini TIDAK menggagalkan
  # deploy -- situsnya sudah terbit, pemberitahuan cuma bonus.
  case "$code" in
    200|202) echo "==> IndexNow: diberitahu (HTTP $code)" ;;
    *)       echo "==> IndexNow: gagal (HTTP $code) -- situs tetap terbit" ;;
  esac
fi

echo "==> Selesai."
