"use strict";

/* Portal Game Semua Umur: modul game "Bangun Ruang" (bangunruang).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "bangunruang", name: "Bangun Ruang", icon: "🧊", art: "#fff3b0", edu: true,
          desc: "Lab pengamatan bangun ruang: pilih kubus, balok, tabung, kerucut, bola, atau limas segiempat, buka jaring-jaringnya, lalu catat sisi, rusuk, dan titik sudutnya!",
          cats: ["anak"], age: "6+ tahun", mins: "±4 menit" });

      /* Belajar 15: Bangun Ruang. An observation lab without a camera: pick a
         solid, look at it, open its net, read its faces, edges and vertices,
         then answer one observation question. The log fills with check marks
         and a progress percentage, like a real lab notebook. */
      BUILDERS.bangunruang = function () {
        const ST = 'stroke="#263238" stroke-width="3" stroke-linejoin="round"';
        const SHAPES = {
          kubus: { name: "Kubus", sisi: 6, rusuk: 12, sudut: 8,
            svg: `<svg viewBox="0 0 200 170" role="img" aria-label="Gambar kubus"><polygon points="70,72 96,46 166,46 140,72" fill="#ffe3ae" ${ST}/><polygon points="140,72 166,46 166,116 140,142" fill="#f2a65a" ${ST}/><polygon points="70,72 140,72 140,142 70,142" fill="#ffc978" ${ST}/></svg>`,
            net: `<svg viewBox="0 0 220 170" role="img" aria-label="Jaring-jaring kubus, enam persegi membentuk salib">${[[91, 28], [53, 66], [91, 66], [129, 66], [167, 66], [91, 104]].map(p => `<rect x="${p[0]}" y="${p[1]}" width="38" height="38" fill="#ffe9c4" ${ST}/>`).join("")}</svg>`,
            quiz: { q: "Berapa jumlah sisi kubus?", opts: [6, 4, 8], a: 6, fact: "Kubus punya 6 sisi persegi yang sama besar." } },
          balok: { name: "Balok", sisi: 6, rusuk: 12, sudut: 8,
            svg: `<svg viewBox="0 0 220 170" role="img" aria-label="Gambar balok"><polygon points="45,82 70,56 190,56 165,82" fill="#cdeffd" ${ST}/><polygon points="165,82 190,56 190,106 165,132" fill="#7fc4e8" ${ST}/><polygon points="45,82 165,82 165,132 45,132" fill="#a5dcf5" ${ST}/></svg>`,
            net: `<svg viewBox="0 0 260 170" role="img" aria-label="Jaring-jaring balok dari persegi panjang"><rect x="72" y="34" width="76" height="28" fill="#d8f1fc" ${ST}/><rect x="38" y="62" width="34" height="46" fill="#d8f1fc" ${ST}/><rect x="72" y="62" width="76" height="46" fill="#a5dcf5" ${ST}/><rect x="148" y="62" width="34" height="46" fill="#d8f1fc" ${ST}/><rect x="182" y="62" width="76" height="46" fill="#a5dcf5" ${ST}/><rect x="72" y="108" width="76" height="28" fill="#d8f1fc" ${ST}/></svg>`,
            quiz: { q: "Berapa jumlah rusuk balok?", opts: [8, 12, 6], a: 12, fact: "Balok punya 12 rusuk, sama banyak dengan kubus." } },
          tabung: { name: "Tabung", sisi: 3, rusuk: 2, sudut: 0,
            svg: `<svg viewBox="0 0 200 170" role="img" aria-label="Gambar tabung"><path d="M70 45 L70 132 A30 11 0 0 0 130 132 L130 45 Z" fill="#cdbcf2" ${ST}/><ellipse cx="100" cy="45" rx="30" ry="11" fill="#efe9fc" ${ST}/></svg>`,
            net: `<svg viewBox="0 0 220 165" role="img" aria-label="Jaring-jaring tabung, satu persegi panjang dan dua lingkaran"><circle cx="110" cy="28" r="16" fill="#efe9fc" ${ST}/><rect x="60" y="46" width="100" height="64" fill="#cdbcf2" ${ST}/><circle cx="110" cy="128" r="16" fill="#efe9fc" ${ST}/></svg>`,
            quiz: { q: "Berapa jumlah titik sudut tabung?", opts: [0, 1, 2], a: 0, fact: "Tabung tidak punya titik sudut, sisinya melengkung halus." } },
          kerucut: { name: "Kerucut", sisi: 2, rusuk: 1, sudut: 1, sudutNote: "puncak",
            svg: `<svg viewBox="0 0 200 170" role="img" aria-label="Gambar kerucut"><polygon points="100,28 58,140 142,140" fill="#ffb59d" ${ST}/><ellipse cx="100" cy="140" rx="42" ry="11" fill="#ffd9cd" ${ST}/></svg>`,
            net: `<svg viewBox="0 0 210 165" role="img" aria-label="Jaring-jaring kerucut, juring lingkaran dan satu lingkaran kecil"><path d="M80 82 L33 109 A54 54 0 1 0 127 109 Z" fill="#ffb59d" ${ST}/><circle cx="168" cy="82" r="24" fill="#ffd9cd" ${ST}/></svg>`,
            quiz: { q: "Berapa jumlah titik sudut kerucut?", opts: [1, 0, 3], a: 1, fact: "Satu-satunya titik sudut kerucut adalah puncaknya yang runcing." } },
          bola: { name: "Bola", sisi: 1, rusuk: 0, sudut: 0,
            svg: `<svg viewBox="0 0 200 170" role="img" aria-label="Gambar bola"><circle cx="100" cy="86" r="56" fill="#b5ecd9" ${ST}/><ellipse cx="100" cy="86" rx="56" ry="20" fill="none" ${ST}/><ellipse cx="100" cy="86" rx="20" ry="56" fill="none" ${ST}/></svg>`,
            net: null,
            quiz: { q: "Berapa jumlah sisi bola?", opts: [1, 2, 0], a: 1, fact: "Bola hanya punya 1 sisi, yaitu permukaan lengkungnya." } },
          limas: { name: "Limas Segiempat", sisi: 5, rusuk: 8, sudut: 5,
            svg: `<svg viewBox="0 0 200 170" role="img" aria-label="Gambar limas segiempat"><polygon points="72,112 128,112 150,140 50,140" fill="#e8ddc8" ${ST}/><polygon points="100,30 72,112 50,140" fill="#ffe1a0" ${ST}/><polygon points="100,30 150,140 50,140" fill="#f7cf6b" ${ST}/><polygon points="100,30 128,112 150,140" fill="#eab54e" ${ST}/></svg>`,
            net: `<svg viewBox="0 0 205 165" role="img" aria-label="Jaring-jaring limas segiempat, satu persegi dan empat segitiga"><polygon points="78,58 124,58 101,16" fill="#ffe1a0" ${ST}/><polygon points="78,58 78,104 36,81" fill="#ffe1a0" ${ST}/><rect x="78" y="58" width="46" height="46" fill="#f7cf6b" ${ST}/><polygon points="124,58 124,104 166,81" fill="#ffe1a0" ${ST}/><polygon points="78,104 124,104 101,146" fill="#ffe1a0" ${ST}/></svg>`,
            quiz: { q: "Berapa jumlah rusuk limas segiempat?", opts: [8, 5, 10], a: 8, fact: "Limas segiempat punya 8 rusuk: 4 di alas dan 4 menuju puncak." } }
        };
        const ORDER = ["kubus", "balok", "tabung", "kerucut", "bola", "limas"];
        let current = "kubus", netOpen = false, mistakes = 0, busy = false;
        const observed = {};
        stage.innerHTML = `
          <div class="hud"><span class="stat">Sudah Diamati: <b id="brCount">0 / 6</b></span></div>
          <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" id="brKiko" aria-live="polite"></p></div>
          <div class="shape-picker" id="brPicker" role="group" aria-label="Pilih bangun ruang"></div>
          <div class="shape-stage" id="brStage"></div>
          <div class="shape-data" id="brData"></div>
          <div style="text-align:center"><button class="btn btn-sun" id="brNet">Buka Jaring-Jaring</button></div>
          <div id="brQuiz" style="margin-top:18px"></div>
          <div class="obs-log" id="brLog"></div>`;
        const kiko = document.getElementById("brKiko");
        const picker = document.getElementById("brPicker");
        const stageBox = document.getElementById("brStage");
        const dataBox = document.getElementById("brData");
        const netBtn = document.getElementById("brNet");
        const quizBox = document.getElementById("brQuiz");
        ORDER.forEach(key => {
          const b = document.createElement("button");
          b.className = "chip"; b.dataset.shape = key;
          b.setAttribute("aria-pressed", "false");
          b.textContent = SHAPES[key].name;
          b.addEventListener("click", () => { sfx.click(); select(key); });
          picker.appendChild(b);
        });
        netBtn.addEventListener("click", () => {
          netOpen = !netOpen; sfx.click();
          renderShape();
          const s = SHAPES[current];
          kiko.textContent = netOpen
            ? (s.net ? "Ini jaring-jaring " + s.name.toLowerCase() + ". Kalau dilipat mengikuti garisnya, jadilah bangun " + s.name.toLowerCase() + "!"
                     : "Ternyata bola tidak bisa dibuka menjadi jaring-jaring datar. Itu juga hasil pengamatan yang penting!")
            : "Kita lihat lagi bangun " + s.name.toLowerCase() + " utuhnya.";
        });
        function select(key) {
          current = key; netOpen = false; busy = false;
          renderAll();
          const s = SHAPES[key];
          kiko.textContent = observed[key]
            ? s.name + " sudah selesai kamu amati. Boleh dilihat lagi, atau pilih bangun lain yang belum diamati!"
            : "Kita amati " + s.name.toLowerCase() + ", yuk! Lihat gambarnya, buka jaring-jaringnya, lalu jawab kuis pengamatannya.";
        }
        function renderAll() { renderShape(); renderQuiz(); renderLog(); }
        function renderShape() {
          picker.querySelectorAll(".chip").forEach(c => {
            const on = c.dataset.shape === current;
            c.classList.toggle("active", on);
            c.setAttribute("aria-pressed", on ? "true" : "false");
          });
          const s = SHAPES[current];
          stageBox.innerHTML = netOpen
            ? (s.net || '<div class="net-note">Bola tidak mempunyai jaring-jaring. Permukaannya melengkung ke segala arah, jadi tidak bisa dibuka dan diratakan menjadi gambar datar seperti bangun lainnya.</div>')
            : s.svg;
          dataBox.innerHTML =
            '<div class="sd">Sisi<b>' + s.sisi + "</b></div>" +
            '<div class="sd">Rusuk<b>' + s.rusuk + "</b></div>" +
            '<div class="sd">Titik Sudut<b>' + s.sudut + "</b>" + (s.sudutNote ? "<small>" + s.sudutNote + "</small>" : "") + "</div>";
          netBtn.textContent = netOpen ? "Tutup Jaring-Jaring" : "Buka Jaring-Jaring";
          netBtn.setAttribute("aria-expanded", netOpen ? "true" : "false");
        }
        function renderQuiz() {
          const s = SHAPES[current];
          if (observed[current]) {
            quizBox.innerHTML = '<p class="row-label" style="margin:0">✓ ' + s.name + " sudah selesai diamati. Hebat!</p>";
            return;
          }
          quizBox.innerHTML =
            '<p class="quiz-q" style="text-align:center">' + s.quiz.q + "</p>" +
            '<div class="big-opts" id="brOpts" style="grid-template-columns:repeat(3,1fr);max-width:440px"></div>';
          const box = document.getElementById("brOpts");
          shuffle(s.quiz.opts).forEach(v => {
            const b = document.createElement("button");
            b.className = "big-opt";
            b.setAttribute("aria-label", "Jawaban " + v);
            b.innerHTML = '<span class="num">' + v + "</span>";
            b.addEventListener("click", () => {
              if (busy) return;
              if (v === s.quiz.a) {
                busy = true; sfx.good();
                b.classList.add("praise-pop");
                observed[current] = true;
                kiko.textContent = praiseWord() + " " + s.quiz.fact + " " + s.name + " dicatat di log pengamatan!";
                renderLog();
                const done = ORDER.filter(k => observed[k]).length;
                setTimeout(() => {
                  if (done >= 6) {
                    const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
                    awardStars("bangunruang", stars);
                    mascotSay("Semua bangun ruang selesai diamati. Kamu peneliti cilik!");
                    winScreen("🧊", "Lab Bangun Ruang Selesai!",
                      "Enam bangun selesai diamati dan tercatat di log: kubus, balok, tabung, kerucut, bola, dan limas segiempat. Salah jawab kuis " + mistakes + " kali, tetap teliti!", stars, BUILDERS.bangunruang);
                  } else { busy = false; renderQuiz(); }
                }, 1100);
              } else {
                mistakes++; sfx.flip();
                gentleShake(b);
                b.classList.add("used");
                kiko.textContent = "Belum tepat. Lihat lagi data pengamatan " + s.name.toLowerCase() + " di atas, lalu coba lagi!";
              }
            });
            box.appendChild(b);
          });
        }
        function renderLog() {
          const done = ORDER.filter(k => observed[k]).length;
          document.getElementById("brCount").textContent = done + " / 6";
          const pct = Math.round(done / 6 * 100);
          document.getElementById("brLog").innerHTML =
            "<h4>Log Pengamatan</h4>" +
            '<p class="obs-prog">Progres pengamatan: ' + done + " dari 6 bangun (" + pct + "%)</p>" +
            ORDER.map(k => '<div class="obs-row"><span>' + SHAPES[k].name + "</span>" +
              (observed[k] ? '<span class="obs-check">✓ Sudah diamati</span>' : '<span class="obs-check no">Belum diamati</span>') + "</div>").join("");
        }
        select("kubus");
      };
