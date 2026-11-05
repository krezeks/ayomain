"use strict";

/* Portal Game Semua Umur: modul game "Pecahan Seru" (pecahan).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "pecahan", name: "Pecahan Seru", icon: "🍕", art: "#fff3b0", edu: true,
          desc: "Lihat gambar kue dan persegi yang sebagian diarsir, lalu pilih nilai pecahannya: 1/2, 1/3, 2/3, dan lainnya. Pecahan jadi mudah!",
          cats: ["anak"], age: "6+ tahun", mins: "±3 menit" });

      /* Belajar 9: Pecahan Seru */
      BUILDERS.pecahan = function () {
        function fracCircle(k, n) {
          const cx = 60, cy = 60, r = 54;
          let paths = "";
          for (let i = 0; i < n; i++) {
            const a0 = -Math.PI / 2 + i * 2 * Math.PI / n;
            const a1 = -Math.PI / 2 + (i + 1) * 2 * Math.PI / n;
            const x0 = (cx + r * Math.cos(a0)).toFixed(1), y0 = (cy + r * Math.sin(a0)).toFixed(1);
            const x1 = (cx + r * Math.cos(a1)).toFixed(1), y1 = (cy + r * Math.sin(a1)).toFixed(1);
            const large = (a1 - a0) > Math.PI ? 1 : 0;
            paths += '<path d="M' + cx + " " + cy + " L" + x0 + " " + y0 + " A" + r + " " + r + " 0 " + large + " 1 " + x1 + " " + y1 + ' Z" fill="' + (i < k ? "#fb8c1a" : "#ffffff") + '" stroke="#263238" stroke-width="3"/>';
          }
          return '<svg viewBox="0 0 120 120" role="img" aria-label="Lingkaran dibagi ' + n + ", diarsir " + k + ' bagian">' + paths + "</svg>";
        }
        function fracRect(k, n) {
          const w = 180 / n;
          let rects = "";
          for (let i = 0; i < n; i++) {
            rects += '<rect x="' + (i * w).toFixed(1) + '" y="5" width="' + w.toFixed(1) + '" height="80" fill="' + (i < k ? "#fb8c1a" : "#ffffff") + '" stroke="#263238" stroke-width="3"/>';
          }
          return '<svg viewBox="0 0 180 90" role="img" aria-label="Persegi panjang dibagi ' + n + ", diarsir " + k + ' bagian">' + rects + "</svg>";
        }
        const POOL = [
          { k: 1, n: 2, shape: "circle", opts: ["1/2", "1/3", "2/3"] },
          { k: 1, n: 4, shape: "circle", opts: ["1/4", "1/2", "3/4"] },
          { k: 3, n: 4, shape: "circle", opts: ["3/4", "1/4", "2/4"] },
          { k: 2, n: 3, shape: "rect", opts: ["2/3", "1/3", "3/4"] },
          { k: 1, n: 3, shape: "rect", opts: ["1/3", "1/2", "2/3"] },
          { k: 2, n: 4, shape: "circle", opts: ["2/4", "1/4", "1/2"] },
          { k: 2, n: 4, shape: "rect", opts: ["2/4", "3/4", "1/3"] },
          { k: 2, n: 3, shape: "circle", opts: ["2/3", "3/4", "1/3"] }
        ];
        const questions = shuffle(POOL).slice(0, 6).map(p => {
          const val = p.k + "/" + p.n;
          return {
            kiko: "Lihat gambarnya! Berapa nilai pecahan bagian yang diarsir oranye?",
            visual: '<div class="frac-wrap">' + (p.shape === "circle" ? fracCircle(p.k, p.n) : fracRect(p.k, p.n)) + "</div>",
            options: p.opts.map(o => ({ label: "Pecahan " + o, html: '<span class="num" style="font-size:2.1rem">' + o + "</span>", correct: o === val })),
            fact: "Betul! Yang diarsir ada " + p.k + " dari " + p.n + " bagian sama besar, jadi " + val + ".",
            hint: "Coba hitung dulu: semua ada berapa bagian, yang diarsir ada berapa?"
          };
        });
        quizFlow({
          id: "pecahan", hud: "Soal", questions,
          optsStyle: "grid-template-columns:repeat(3,1fr);max-width:440px",
          emoji: "🍕", title: "Pecahan Seru Selesai!",
          text: m => "6 soal pecahan selesai. Salah pilih " + m + " kali tidak apa-apa, pecahan memang makin mudah kalau sering dilatih!",
          mascot: "Kue pecahannya habis, ilmumu bertambah!",
          builder: BUILDERS.pecahan
        });
      };
