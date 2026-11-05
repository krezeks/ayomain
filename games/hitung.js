"use strict";

/* Portal Game Semua Umur: modul game "Hitung Yuk" (hitung).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "hitung",  name: "Hitung Yuk", icon: "🔢", art: "#d2f0ff", act: true,
          desc: "Hitung apel, ikan, bintang, dan permen yang muncul, lalu ketuk angka yang tepat. Belajar angka 1 sampai 10 sambil bermain!",
          cats: ["anak"], age: "3+ tahun", mins: "Santai" });

      /* Aktivitas 2: Hitung Yuk */
      BUILDERS.hitung = function () {
        const ITEMS = [
          { e: "🍎", n: "apel" }, { e: "⭐", n: "bintang" }, { e: "🐟", n: "ikan" }, { e: "🍬", n: "permen" },
          { e: "🍓", n: "stroberi" }, { e: "🦋", n: "kupu-kupu" }, { e: "🍊", n: "jeruk" }, { e: "🐤", n: "anak ayam" }
        ];
        const TOTAL = 6;
        let q = 0, mistakes = 0, busy = false;
        stage.innerHTML = `
          <div class="hud"><span class="stat">Soal: <b id="hNum">1 / ${TOTAL}</b></span></div>
          <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" id="hKiko" aria-live="polite"></p></div>
          <div class="count-items" id="hItems" aria-hidden="true"></div>
          <div class="big-opts" id="hOpts" style="grid-template-columns:repeat(3,1fr);max-width:440px"></div>`;
        const kiko = document.getElementById("hKiko");
        const itemsBox = document.getElementById("hItems");
        const optsBox = document.getElementById("hOpts");
        function next() {
          busy = false;
          document.getElementById("hNum").textContent = (q + 1) + " / " + TOTAL;
          const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
          const count = 1 + Math.floor(Math.random() * 10);
          kiko.textContent = "Ada berapa " + item.n + "? Hitung pelan-pelan, ya!";
          itemsBox.innerHTML = "";
          for (let i = 0; i < count; i++) {
            const s = document.createElement("span");
            s.textContent = item.e;
            itemsBox.appendChild(s);
          }
          const opts = new Set([count]);
          [count - 2, count - 1, count + 1, count + 2, count + 3].forEach(v => {
            if (opts.size < 3 && v >= 1 && v <= 10) opts.add(v);
          });
          let extra = 1;
          while (opts.size < 3) { if (!opts.has(extra)) opts.add(extra); extra++; }
          optsBox.innerHTML = "";
          shuffle(Array.from(opts)).forEach(v => {
            const b = document.createElement("button");
            b.className = "big-opt";
            b.setAttribute("aria-label", "Angka " + v);
            b.innerHTML = '<span class="num">' + v + "</span>";
            b.addEventListener("click", () => {
              if (busy) return;
              if (v === count) {
                busy = true; sfx.good();
                b.classList.add("praise-pop");
                kiko.textContent = praiseWord() + " Betul, ada " + count + " " + item.n + "!";
                q++;
                setTimeout(() => {
                  if (q >= TOTAL) {
                    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
                    awardStars("hitung", stars);
                    mascotSay("Kamu makin jago berhitung!");
                    winScreen("🔢", "Berhitung Selesai!",
                      `Kamu menjawab ${TOTAL} soal hitungan. Salah ketuk ${mistakes} kali, tetap semangat!`, stars, BUILDERS.hitung);
                  } else next();
                }, 950);
              } else {
                mistakes++; sfx.flip();
                gentleShake(b);
                kiko.textContent = "Belum tepat. Coba hitung lagi pelan-pelan, satu-satu!";
              }
            });
            optsBox.appendChild(b);
          });
        }
        next();
      };
