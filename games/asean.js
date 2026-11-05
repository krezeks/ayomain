"use strict";

/* Portal Game Semua Umur: modul game "SOBAT ASEAN" (asean).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "asean",   name: "SOBAT ASEAN", icon: "🌏", art: "#bfe3ff", edu: true,
          desc: "Kenalan dengan negara tetangga: tebak ibu kotanya dan tebak negaranya dari bendera. Dari Jakarta sampai Naypyidaw!",
          cats: ["anak", "keluarga"], age: "7+ tahun", mins: "±3 menit" });

      /* Belajar 8: SOBAT ASEAN */
      BUILDERS.asean = function () {
        const COUNTRIES = [
          { n: "Indonesia", cap: "Jakarta", f: "🇮🇩" },
          { n: "Malaysia", cap: "Kuala Lumpur", f: "🇲🇾" },
          { n: "Singapura", cap: "Singapura", f: "🇸🇬" },
          { n: "Thailand", cap: "Bangkok", f: "🇹🇭" },
          { n: "Vietnam", cap: "Hanoi", f: "🇻🇳" },
          { n: "Filipina", cap: "Manila", f: "🇵🇭" },
          { n: "Brunei", cap: "Bandar Seri Begawan", f: "🇧🇳" },
          { n: "Kamboja", cap: "Phnom Penh", f: "🇰🇭" },
          { n: "Laos", cap: "Vientiane", f: "🇱🇦" },
          { n: "Myanmar", cap: "Naypyidaw", f: "🇲🇲" }
        ];
        const questions = shuffle(COUNTRIES).slice(0, 6).map((c, i) => {
          const others = shuffle(COUNTRIES.filter(x => x !== c)).slice(0, 2);
          if (i % 2 === 0) {
            return {
              kiko: "Apa ibu kota negara " + c.n + "?",
              visual: bigVisual(c.f, c.n),
              options: [tOpt(c.cap, true)].concat(others.map(o => tOpt(o.cap, false))),
              fact: "Betul! Ibu kota " + c.n + " adalah " + c.cap + ".",
              hint: "Belum tepat. Ibu kota " + c.n + " yang mana, ya?"
            };
          }
          return {
            kiko: "Bendera ini milik negara apa, ya?",
            visual: bigVisual(c.f),
            options: [tOpt(c.n, true)].concat(others.map(o => tOpt(o.n, false))),
            fact: "Betul! Itu bendera " + c.n + ", ibu kotanya " + c.cap + ".",
            hint: "Belum tepat. Perhatikan warna dan lambang benderanya!"
          };
        });
        quizFlow({
          id: "asean", hud: "Soal", questions,
          optsStyle: "grid-template-columns:1fr;max-width:480px",
          emoji: "🌏", title: "Kenalan ASEAN Selesai!",
          text: m => "6 soal tentang negara tetangga selesai. Salah jawab " + m + " kali, tetap salut sudah berani keliling ASEAN!",
          mascot: "Negara tetangga sekarang terasa lebih dekat!",
          builder: BUILDERS.asean
        });
      };
