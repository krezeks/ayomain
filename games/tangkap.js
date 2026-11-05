"use strict";

/* Portal Game Semua Umur: modul game "Tangkap Bintang" (tangkap).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "tangkap", name: "Tangkap Bintang", icon: "⭐", art: "#ffe9a8",
          desc: "Bintang-bintang nakal muncul dan kabur dengan cepat. Tangkap sebanyak-banyaknya dalam 30 detik!",
          cats: ["anak", "cepat"], age: "4+ tahun", mins: "30 detik" });

      /* Game 4: Tangkap Bintang */
      BUILDERS.tangkap = function () {
        let score = 0, timeLeft = 30, running = false, upTimer = null, countTimer = null;
        stage.innerHTML = `
          <div class="hud">
            <span class="stat">Skor: <b id="tScore">0</b></span>
            <span class="stat">Waktu: <b id="tTime">30</b></span>
          </div>
          <div class="mole-grid" id="moleGrid"></div>
          <div class="center-msg" id="tStart">
            <p>Bintang ⭐ = 10 poin. Hati-hati, bom 💣 mengurangi 15 poin! Siap?</p>
            <button class="btn btn-coral" id="tStartBtn">Mulai!</button>
          </div>`;
        const mg = document.getElementById("moleGrid");
        const holes = [];
        for (let i = 0; i < 9; i++) {
          const h = document.createElement("button");
          h.className = "hole"; h.setAttribute("aria-label", "Lubang " + (i + 1));
          h.innerHTML = `<span class="critter"></span>`;
          h.addEventListener("click", () => bonk(h));
          mg.appendChild(h); holes.push(h);
        }
        cleanup = () => { clearInterval(upTimer); clearInterval(countTimer); };
        function bonk(h) {
          if (!running || !h.classList.contains("up")) return;
          const kind = h.dataset.kind;
          h.classList.remove("up"); h.classList.add("bonked");
          setTimeout(() => h.classList.remove("bonked"), 200);
          if (kind === "star") { score += 10; sfx.pop(); }
          else { score = Math.max(0, score - 15); sfx.bad(); }
          document.getElementById("tScore").textContent = score;
        }
        function pop() {
          holes.forEach(h => h.classList.remove("up"));
          const n = Math.random() < 0.3 ? 2 : 1;
          for (let k = 0; k < n; k++) {
            const h = holes[Math.floor(Math.random() * holes.length)];
            const isBomb = Math.random() < 0.18;
            h.dataset.kind = isBomb ? "bomb" : "star";
            h.querySelector(".critter").textContent = isBomb ? "💣" : (Math.random() < 0.5 ? "⭐" : "🌟");
            h.classList.add("up");
          }
        }
        document.getElementById("tStartBtn").addEventListener("click", () => {
          document.getElementById("tStart").style.display = "none";
          running = true; sfx.click();
          pop();
          upTimer = setInterval(pop, 780);
          countTimer = setInterval(() => {
            timeLeft--;
            const el = document.getElementById("tTime");
            if (el) el.textContent = Math.max(0, timeLeft);
            if (timeLeft <= 0) {
              clearInterval(upTimer); clearInterval(countTimer); cleanup = null;
              running = false;
              holes.forEach(h => h.classList.remove("up"));
              const stars = score >= 220 ? 3 : score >= 140 ? 2 : score >= 60 ? 1 : 0;
              awardStars("tangkap", Math.max(stars, 1));
              mascotSay(score >= 140 ? "Refleksmu cepat banget, kayak kilat!" : "Seru kan? Latihan lagi biar makin cepat!");
              winScreen("⭐", "Waktu Habis!", `Kamu menangkap bintang senilai ${score} poin.`, Math.max(stars, 1), BUILDERS.tangkap);
            }
          }, 1000);
        });
      };
