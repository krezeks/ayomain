"use strict";

/* Portal Game Semua Umur: modul game "Pilah Sampah" (pilah).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "pilah",   name: "Pilah Sampah", icon: "🗑️", art: "#d9f7d4", edu: true,
          desc: "Satu sampah muncul, kamu pilih tongnya: hijau Organik, kuning Anorganik, atau merah B3. Belajar menjaga bumi sejak kecil!",
          cats: ["anak"], age: "4+ tahun", mins: "±3 menit" });

      /* Belajar 1: Pilah Sampah */
      BUILDERS.pilah = function () {
        const ITEMS = [
          { e: "🍌", n: "kulit pisang", cap: "Kulit Pisang", bin: "organik", why: "sisa buah yang bisa membusuk" },
          { e: "🍚", n: "sisa nasi", cap: "Sisa Nasi", bin: "organik", why: "sisa makanan yang bisa membusuk" },
          { e: "🍂", n: "daun kering", cap: "Daun Kering", bin: "organik", why: "sisa tanaman yang bisa membusuk" },
          { e: "🥬", n: "sisa sayur", cap: "Sisa Sayur", bin: "organik", why: "sisa sayuran yang bisa membusuk" },
          { e: "🧴", n: "botol plastik", cap: "Botol Plastik", bin: "anorganik", why: "plastik buatan pabrik yang bisa didaur ulang" },
          { e: "🥫", n: "kaleng bekas", cap: "Kaleng Bekas", bin: "anorganik", why: "logam bekas yang bisa didaur ulang" },
          { e: "📰", n: "kertas koran", cap: "Kertas Koran", bin: "anorganik", why: "kertas bekas yang bisa didaur ulang" },
          { e: "📦", n: "kardus bekas", cap: "Kardus Bekas", bin: "anorganik", why: "kardus bekas yang bisa didaur ulang" },
          { e: "🔋", n: "baterai bekas", cap: "Baterai Bekas", bin: "b3", why: "mengandung bahan kimia berbahaya" },
          { e: "💡", n: "lampu neon", cap: "Lampu Neon", bin: "b3", why: "mengandung bahan berbahaya di dalamnya" },
          { e: "💊", n: "botol obat", cap: "Botol Obat", bin: "b3", why: "bekas obat yang bisa berbahaya" }
        ];
        const BINS = [
          { key: "organik", label: "Tong Hijau: Organik", emoji: "🟢", style: "background:#d9f5e3;color:#1d2b38;border-color:#43b04c" },
          { key: "anorganik", label: "Tong Kuning: Anorganik", emoji: "🟡", style: "background:#fff3b0;color:#1d2b38;border-color:#e89b00" },
          { key: "b3", label: "Tong Merah: B3", emoji: "🔴", style: "background:#ffe0dc;color:#1d2b38;border-color:#c93325" }
        ];
        const binName = k => BINS.find(b => b.key === k).label.replace("Tong ", "tong ");
        const questions = shuffle(ITEMS).slice(0, 10).map(it => ({
          kiko: "Sampah ini masuk tong yang mana, ya?",
          visual: bigVisual(it.e, it.cap),
          options: BINS.map(bn => ({
            label: bn.label,
            html: '<span class="opt-emoji" aria-hidden="true">' + bn.emoji + '</span><span class="opt-text">' + bn.label.replace("Tong ", "") + "</span>",
            style: bn.style,
            correct: bn.key === it.bin
          })),
          fact: "Betul! " + it.cap + " masuk " + binName(it.bin) + ".",
          hint: "Belum tepat. " + it.cap + " itu " + it.why + ", jadi masuk " + binName(it.bin) + ", ya!"
        }));
        quizFlow({
          id: "pilah", hud: "Benda", questions,
          optsStyle: "grid-template-columns:repeat(3,1fr);max-width:620px",
          emoji: "🗑️", title: "Kamu Jago Pilah Sampah!",
          text: m => "10 benda selesai dipilah. Salah tong " + m + " kali tidak apa-apa, bumi tetap berterima kasih!",
          mascot: "Bumi senang punya penjaga sepertimu!",
          builder: BUILDERS.pilah
        });
      };
