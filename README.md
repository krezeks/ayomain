# Portal Game Semua Umur — ayomain

Portal game web berbahasa Indonesia untuk semua umur: **32 game ringan** dalam satu halaman, ditemani maskot rubah **Kiko**. Tanpa build step, tanpa framework — vanilla HTML/CSS/JavaScript murni, jalan langsung dari berkas statis.

**Live:** https://ayomain.cloud

## Daftar Game

| Modul | Game |
| --- | --- |
| `memory.js` | Kartu Pasangan |
| `tebak.js` | Tebak Angka |
| `tangkap.js` | Tangkap Bintang |
| `simon.js` | Ikuti Warna Kiko |
| `kuis.js` | Kuis Kilat |
| `ttt.js` | Tic Tac Toe vs Kiko |
| `ular.js` | Ular Klasik |
| `warna.js` | Kenali Warna & Bentuk |
| `hitung.js` | Hitung Yuk |
| `bayangan.js` | Pasang Bayangan |
| `huruf.js` | Tebak Huruf |
| `mewarnai.js` | Mewarnai Bebas |
| `urut.js` | Urutkan Angka |
| `pilah.js` | Pilah Sampah |
| `campur.js` | Campur Warna |
| `gundu.js` | Negeri Gundu |
| `satwa.js` | Kawan Satwa |
| `jamawan.js` | JAMAWAN |
| `nusantara.js` | Nusantara |
| `pahlawan.js` | Pahlawan |
| `asean.js` | ASEAN |
| `pecahan.js` | Pecahan |
| `tarik.js` | Tarik Tambang |
| `warung.js` | Warung |
| `asmaul.js` | Asmaul Husna |
| `wordrush.js` | Word Rush |
| `jagoakor.js` | Jago Akor |
| `bangunruang.js` | Bangun Ruang |
| `petualanganaman.js` | Petualangan Aman |
| `bata.js` | Pecah Bata |
| `ufo.js` | Tembak UFO |
| `pong.js` | Pong Kiko |

## Cara Menjalankan

Cukup sajikan folder ini sebagai situs statis:

```bash
# contoh paling sederhana
npx serve .
# atau
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000`. Membuka `index.html` langsung dari berkas juga umumnya berfungsi.

## Struktur

```
.
├── index.html        # halaman portal + pemuat katalog
└── games/
    ├── catalog.js    # daftar modul game yang dimuat portal
    └── *.js          # satu berkas per game (modul mandiri)
```

Setiap game adalah modul JavaScript mandiri yang didaftarkan lewat `games/catalog.js` — menambah game baru cukup dengan menambah satu berkas dan satu baris katalog.

## Catatan

Seluruh kode, teks soal, dan aset di repo ini adalah karya original, dibuat untuk portal ayomain.cloud.

© 2026 taz
