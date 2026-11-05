"use strict";

/* Portal Game Semua Umur: modul game "Tebak Angka" (tebak).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "tebak",   name: "Tebak Angka", icon: "🔮", art: "#bfe3ff",
          desc: "Kiko menyembunyikan angka 1 sampai 100. Bisakah kamu menebaknya dengan petunjuk \"lebih besar / lebih kecil\"?",
          cats: ["anak", "keluarga", "cepat"], age: "6+ tahun", mins: "±2 menit" });

      /* Game 2: Tebak Angka */
      BUILDERS.tebak = function () {
        const secret = Math.floor(Math.random() * 100) + 1;
        let tries = 0; const guessed = [];
        stage.innerHTML = `
          <div class="guess-box">
            <p style="font-weight:800;color:var(--ink-soft)">Kiko menyembunyikan angka antara <b>1 dan 100</b>.<br>Tebak dengan sesedikit mungkin percobaan!</p>
            <div style="display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap">
              <input id="gInput" type="number" min="1" max="100" inputmode="numeric" placeholder="?" aria-label="Tebakanmu" />
              <button class="btn btn-coral" id="gBtn">Tebak!</button>
            </div>
            <div class="guess-feedback" id="gFeed">Silakan tebak angka pertamamu…</div>
            <div class="guess-history" id="gHist"></div>
          </div>`;
        const input = document.getElementById("gInput");
        const feed = document.getElementById("gFeed");
        input.focus();
        function doGuess() {
          const v = parseInt(input.value, 10);
          if (isNaN(v) || v < 1 || v > 100) { feed.textContent = "Masukkan angka 1 sampai 100 dulu, ya."; sfx.bad(); return; }
          tries++; guessed.push(v);
          document.getElementById("gHist").innerHTML = guessed.map(x => `<span>${x}</span>`).join("");
          input.value = ""; input.focus();
          if (v === secret) {
            const stars = tries <= 5 ? 3 : tries <= 8 ? 2 : 1;
            awardStars("tebak", stars);
            mascotSay("Tebakanmu jitu! Angka itu memang favoritku.");
            winScreen("🎉", "Ketebak! Angkanya " + secret + "!",
              `Kamu menemukannya dalam ${tries} kali tebakan.`, stars, BUILDERS.tebak);
          } else if (v < secret) {
            feed.textContent = "Terlalu kecil, angkanya LEBIH BESAR dari " + v + "."; sfx.flip();
          } else {
            feed.textContent = "Terlalu besar, angkanya LEBIH KECIL dari " + v + "."; sfx.flip();
          }
        }
        document.getElementById("gBtn").addEventListener("click", doGuess);
        input.addEventListener("keydown", e => { if (e.key === "Enter") doGuess(); });
      };
