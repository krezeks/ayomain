"use strict";

/* Portal Game Semua Umur: modul game "Kawan Satwa" (satwa).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "satwa",   name: "Kawan Satwa", icon: "🐾", art: "#ffe9a8", edu: true,
          desc: "Tebak makanan hewan dan hewan dari makanannya: sapi makan rumput, panda makan bambu. Kenali kawan satwa satu per satu!",
          cats: ["anak"], age: "4+ tahun", mins: "±3 menit" });

      /* Belajar 4: Kawan Satwa */
      BUILDERS.satwa = function () {
        const ANIMALS = [
          { cap: "Sapi", e: "🐄", food: "rumput", fe: "🌿" },
          { cap: "Singa", e: "🦁", food: "daging", fe: "🍖" },
          { cap: "Monyet", e: "🐒", food: "pisang", fe: "🍌" },
          { cap: "Kelinci", e: "🐰", food: "wortel", fe: "🥕" },
          { cap: "Ayam", e: "🐔", food: "biji-bijian", fe: "🌾" },
          { cap: "Kucing", e: "🐱", food: "ikan", fe: "🐟" },
          { cap: "Panda", e: "🐼", food: "bambu", fe: "🎋" },
          { cap: "Koala", e: "🐨", food: "daun eukaliptus", fe: "🍃" },
          { cap: "Lebah", e: "🐝", food: "nektar bunga", fe: "🌸" },
          { cap: "Ulat", e: "🐛", food: "daun", fe: "🍃" }
        ];
        const questions = shuffle(ANIMALS).slice(0, 8).map((an, i) => {
          const others = shuffle(ANIMALS.filter(x => x !== an)).slice(0, 2);
          if (i % 2 === 0) {
            return {
              kiko: an.cap + " makan apa, ya?",
              visual: bigVisual(an.e, an.cap),
              options: [eOpt(an.fe, an.food, true)].concat(others.map(o => eOpt(o.fe, o.food, false))),
              fact: "Betul! " + an.cap + " makan " + an.food + ".",
              hint: "Bukan itu makanannya. Ingat-ingat lagi, " + an.cap + " suka makan apa?"
            };
          }
          return {
            kiko: "Hewan apa yang makan " + an.food + "?",
            visual: bigVisual(an.fe, an.food),
            options: [eOpt(an.e, an.cap, true)].concat(others.map(o => eOpt(o.e, o.cap, false))),
            fact: "Betul! Yang makan " + an.food + " adalah " + an.cap.toLowerCase() + ".",
            hint: "Bukan hewan itu. Hewan apa yang paling suka " + an.food + "?"
          };
        });
        quizFlow({
          id: "satwa", hud: "Soal", questions,
          optsStyle: "grid-template-columns:repeat(3,1fr);max-width:560px",
          emoji: "🐾", title: "Kamu Kenal Kawan Satwa!",
          text: m => "8 soal tentang hewan dan makanannya selesai. Salah tebak " + m + " kali, tetap semangat belajar!",
          mascot: "Semua satwa senang dikenal olehmu!",
          builder: BUILDERS.satwa
        });
      };
