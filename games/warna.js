"use strict";

/* Portal Game Semua Umur: modul game "Kenali Warna & Bentuk" (warna).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "warna",   name: "Kenali Warna & Bentuk", icon: "🟣", art: "#ffe3c2", act: true,
          desc: "Kiko menyebut satu warna dan bentuk, misalnya lingkaran merah, lalu kamu ketuk yang benar. Cara seru belajar warna dan bentuk pertama!",
          cats: ["anak"], age: "3+ tahun", mins: "Santai" });

      /* Aktivitas 1: Kenali Warna & Bentuk */
      BUILDERS.warna = function () {
        const SHAPES = ["lingkaran", "persegi", "segitiga", "bintang", "hati"];
        const COLORS = [
          { n: "merah", c: "#e23b2e" }, { n: "biru", c: "#2f7fe0" }, { n: "kuning", c: "#ffc21f" },
          { n: "hijau", c: "#43b04c" }, { n: "oranye", c: "#fb8c1a" }, { n: "ungu", c: "#9b59c9" },
          { n: "pink", c: "#f06292" }
        ];
        const TOTAL = 8;
        let q = 0, mistakes = 0, busy = false;
        stage.innerHTML = `
          <div class="hud"><span class="stat">Soal: <b id="wNum">1 / ${TOTAL}</b></span></div>
          <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" id="wKiko" aria-live="polite"></p></div>
          <div class="big-opts" id="wOpts" style="grid-template-columns:1fr 1fr;max-width:440px"></div>`;
        const kiko = document.getElementById("wKiko");
        const optsBox = document.getElementById("wOpts");
        function next() {
          busy = false;
          document.getElementById("wNum").textContent = (q + 1) + " / " + TOTAL;
          const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
          const color = COLORS[Math.floor(Math.random() * COLORS.length)];
          kiko.textContent = "Ketuk " + shape + " " + color.n + "!";
          const combos = [{ s: shape, c: color }];
          while (combos.length < 4) {
            const cs = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            const cc = COLORS[Math.floor(Math.random() * COLORS.length)];
            if (!combos.some(x => x.s === cs && x.c.n === cc.n)) combos.push({ s: cs, c: cc });
          }
          optsBox.innerHTML = "";
          shuffle(combos).forEach(combo => {
            const b = document.createElement("button");
            b.className = "big-opt";
            b.setAttribute("aria-label", combo.s + " " + combo.c.n);
            b.innerHTML = shapeSVG(combo.s, combo.c.c);
            b.addEventListener("click", () => {
              if (busy) return;
              if (combo.s === shape && combo.c.n === color.n) {
                busy = true; sfx.good();
                b.classList.add("praise-pop");
                kiko.textContent = praiseWord() + " Itu memang " + shape + " " + color.n + ".";
                q++;
                setTimeout(() => {
                  if (q >= TOTAL) {
                    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
                    awardStars("warna", stars);
                    mascotSay("Warna dan bentuk sudah kamu kuasai. Hebat!");
                    winScreen("🎉", "Kamu Kenal Warna & Bentuk!",
                      `Selesai ${TOTAL} soal. Salah ketuk ${mistakes} kali tidak apa-apa, yang penting berani mencoba!`, stars, BUILDERS.warna);
                  } else next();
                }, 900);
              } else {
                mistakes++; sfx.flip();
                gentleShake(b);
                kiko.textContent = "Itu " + combo.s + " " + combo.c.n + ". Coba cari " + shape + " " + color.n + ", yuk!";
              }
            });
            optsBox.appendChild(b);
          });
        }
        next();
      };
