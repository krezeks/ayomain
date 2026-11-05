"use strict";

/* Portal Game Semua Umur: modul game "Negeri Gundu" (gundu).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "gundu",   name: "Negeri Gundu", icon: "🔴", art: "#ffe0ec", edu: true,
          desc: "Soal tambah dan kurang sampai 100, dibantu gundu warna-warni yang disusun per sepuluh. Berhitung terasa seperti bermain kelereng!",
          cats: ["anak"], age: "6+ tahun", mins: "±3 menit" });

      /* Belajar 3: Negeri Gundu */
      BUILDERS.gundu = function () {
        function marbles(a, b, op) {
          function grp(n, cls, label, goneFrom) {
            let cells = "";
            for (let i = 0; i < n; i++) {
              cells += '<span class="marble ' + cls + (goneFrom !== undefined && i >= goneFrom ? " gone" : "") + '"></span>';
            }
            return '<div class="marble-group"><div class="marbles">' + cells + '</div><div class="mg-label">' + label + "</div></div>";
          }
          if (op === "+") {
            return '<div class="marble-zone">' + grp(a, "a", a + " gundu") + '<div class="mg-op">+</div>' + grp(b, "b", b + " gundu") + "</div>";
          }
          return '<div class="marble-zone">' + grp(a, "a", "Ambil " + b + " dari " + a + " gundu", a - b) + "</div>";
        }
        const questions = [];
        for (let i = 0; i < 8; i++) {
          const op = Math.random() < 0.5 ? "+" : "−";
          let a, b;
          if (i < 4) {
            a = 3 + Math.floor(Math.random() * 15);
            b = 2 + Math.floor(Math.random() * 15);
            if (op === "−" && b > a) { const t = a; a = b; b = t; }
          } else if (op === "+") {
            a = 15 + Math.floor(Math.random() * 65);
            b = 5 + Math.floor(Math.random() * (96 - a));
          } else {
            a = 30 + Math.floor(Math.random() * 70);
            b = 5 + Math.floor(Math.random() * (a - 4));
          }
          const ans = op === "+" ? a + b : a - b;
          const ds = shuffle([ans + 1, ans - 1, ans + 2, ans + 10, ans - 10].filter(v => v >= 0 && v !== ans)).slice(0, 2);
          questions.push({
            kiko: "Berapa " + a + " " + op + " " + b + "? Kalau perlu, hitung gundu-nya pelan-pelan!",
            visual: (a <= 20 && b <= 20) ? marbles(a, b, op) : "",
            options: [ans].concat(ds).map(v => ({ label: "Angka " + v, html: '<span class="num">' + v + "</span>", correct: v === ans })),
            fact: "Betul! " + a + " " + op + " " + b + " = " + ans + ".",
            hint: "Belum tepat. Coba hitung lagi pelan-pelan, pakai gundu-nya kalau ada!"
          });
        }
        quizFlow({
          id: "gundu", hud: "Soal", questions,
          optsStyle: "grid-template-columns:repeat(3,1fr);max-width:440px",
          emoji: "🔴", title: "Berhitung di Negeri Gundu Selesai!",
          text: m => "8 soal tambah dan kurang selesai. Salah hitung " + m + " kali tidak apa-apa, berhitung memang butuh latihan!",
          mascot: "Gundu-gundu itu bangga punya teman sepintar kamu!",
          builder: BUILDERS.gundu
        });
      };
