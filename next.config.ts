import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: nginx di app.flugel.my.id sudah melayani file statis
  // (`try_files $uri $uri/ =404`), jadi tidak ada proses Node yang harus
  // dijaga hidup. Nol biaya operasional, praktis tidak bisa down.
  output: "export",

  // Konsekuensi wajib dari `output: export` -- Image Optimization butuh
  // server. Karena itu aset disiapkan dalam ukuran & format yang benar
  // sejak awal, bukan diandalkan ke optimizer runtime.
  images: { unoptimized: true },

  // nginx melayani direktori: /id -> /id/index.html. Tanpa ini, export
  // menghasilkan /id.html yang tidak akan ketemu oleh try_files.
  trailingSlash: true,
};

export default nextConfig;
