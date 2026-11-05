"use strict";

/* Portal Game Semua Umur: modul game "Tebak Huruf" (huruf).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "huruf",   name: "Tebak Huruf", icon: "🔤", art: "#ffe0ec", act: true,
          desc: "Kenali huruf besar lewat kata dan gambar: A itu Apel, B itu Bola, K itu Kucing. Cocok buat yang baru belajar membaca!",
          cats: ["anak"], age: "4+ tahun", mins: "Santai" });

      /* Aktivitas 4: Tebak Huruf */
      BUILDERS.huruf = function () {
        const BANK = [
          { L: "A", w: "Apel", e: "🍎" }, { L: "B", w: "Bola", e: "⚽" }, { L: "C", w: "Ceri", e: "🍒" },
          { L: "D", w: "Domba", e: "🐑" }, { L: "E", w: "Elang", e: "🦅" }, { L: "G", w: "Gajah", e: "🐘" },
          { L: "I", w: "Ikan", e: "🐟" }, { L: "K", w: "Kucing", e: "🐱" }, { L: "M", w: "Mobil", e: "🚗" },
          { L: "P", w: "Pisang", e: "🍌" }, { L: "S", w: "Sapi", e: "🐄" }, { L: "U", w: "Ular", e: "🐍" }
        ];
        const TOTAL = 6;
        const qs = shuffle(BANK).slice(0, TOTAL);
        let idx = 0, mistakes = 0, busy = false;
        stage.innerHTML = `
          <div class="hud"><span class="stat">Soal: <b id="LNum">1 / ${TOTAL}</b></span></div>
          <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" id="LKiko" aria-live="polite"></p></div>
          <div id="LMain"></div>`;
        const kiko = document.getElementById("LKiko");
        const main = document.getElementById("LMain");
        function teach() {
          busy = false;
          const item = qs[idx];
          document.getElementById("LNum").textContent = (idx + 1) + " / " + TOTAL;
          kiko.textContent = "Kita belajar huruf, yuk! Perhatikan baik-baik.";
          main.innerHTML = `
            <div class="teach-card">
              <div class="teach-letter">${item.L}</div>
              <div class="teach-emoji" aria-hidden="true">${item.e}</div>
              <div class="teach-word">${item.L} itu ${item.w}</div>
              <button class="btn btn-coral" id="LGo">Ayo Tebak!</button>
            </div>`;
          document.getElementById("LGo").addEventListener("click", () => { sfx.click(); ask(); });
        }
        function ask() {
          const item = qs[idx];
          kiko.textContent = "Huruf apa ini? Huruf pertama kata " + item.w + ".";
          const others = shuffle(BANK.filter(x => x.L !== item.L)).slice(0, 2).map(x => x.L);
          main.innerHTML = `
            <div class="teach-card">
              <div class="teach-emoji" aria-hidden="true">${item.e}</div>
              <div class="teach-word">_ ${item.w.slice(1)}</div>
            </div>
            <div class="big-opts" id="LOpts" style="grid-template-columns:repeat(3,1fr);max-width:440px"></div>`;
          const box = document.getElementById("LOpts");
          shuffle([item.L].concat(others)).forEach(L => {
            const b = document.createElement("button");
            b.className = "big-opt";
            b.setAttribute("aria-label", "Huruf " + L);
            b.innerHTML = '<span class="letter">' + L + "</span>";
            b.addEventListener("click", () => {
              if (busy) return;
              if (L === item.L) {
                busy = true; sfx.good();
                b.classList.add("praise-pop");
                kiko.textContent = praiseWord() + " " + item.L + " itu " + item.w + "!";
                idx++;
                setTimeout(() => {
                  if (idx >= TOTAL) {
                    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
                    awardStars("huruf", stars);
                    mascotSay("Huruf-huruf sudah mulai kamu hafal!");
                    winScreen("🔤", "Belajar Huruf Selesai!",
                      `Kamu menebak ${TOTAL} huruf dengan berani. Salah ketuk ${mistakes} kali, tetap hebat!`, stars, BUILDERS.huruf);
                  } else teach();
                }, 950);
              } else {
                mistakes++; sfx.flip();
                gentleShake(b);
                kiko.textContent = "Belum tepat. Ingat gambar " + item.w + " tadi, hurufnya yang mana?";
              }
            });
            box.appendChild(b);
          });
        }
        teach();
      };
