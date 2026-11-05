"use strict";

/* Portal Game Semua Umur: modul game "Kartu Pasangan" (memory).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "memory",  name: "Kartu Pasangan", icon: "🦁", art: "#ffd9a8",
          desc: "Balik kartu dan temukan semua pasangan hewan. Latih ingatan si kecil, dan ingatan Ayah Bunda juga!",
          cats: ["anak", "keluarga", "cepat"], age: "4+ tahun", mins: "±3 menit" });

      /* Game 1: Memory */
      BUILDERS.memory = function () {
        const animals = ["🦁", "🐼", "🦊", "🐸", "🦉", "🐙", "🦄", "🐳"];
        let first = null, lock = false, matched = 0, moves = 0, seconds = 0, timer = null;
        stage.innerHTML = `
          <div class="hud">
            <span class="stat">Pasangan: <b id="mPairs">0 / 8</b></span>
            <span class="stat">Langkah: <b id="mMoves">0</b></span>
            <span class="stat">Waktu: <b id="mTime">0 dtk</b></span>
          </div>
          <div class="mem-grid" id="memGrid"></div>
          <p style="text-align:center;font-weight:700;color:var(--ink-soft)">Balik dua kartu, kalau gambarnya sama, kartunya jadi milikmu!</p>`;
        const deck = shuffle(animals.concat(animals));
        const mg = document.getElementById("memGrid");
        deck.forEach(emoji => {
          const c = document.createElement("button");
          c.className = "mem-card"; c.dataset.emoji = emoji;
          c.setAttribute("aria-label", "Kartu tertutup");
          c.innerHTML = `<span class="back-face">?</span><span class="face">${emoji}</span>`;
          c.addEventListener("click", () => flip(c));
          mg.appendChild(c);
        });
        timer = setInterval(() => {
          seconds++;
          const el = document.getElementById("mTime");
          if (el) el.textContent = seconds + " dtk";
        }, 1000);
        cleanup = () => clearInterval(timer);

        function flip(card) {
          if (lock || card.classList.contains("flipped")) return;
          card.classList.add("flipped"); sfx.flip();
          if (!first) { first = card; return; }
          moves++;
          document.getElementById("mMoves").textContent = moves;
          if (first.dataset.emoji === card.dataset.emoji) {
            first.classList.add("matched"); card.classList.add("matched");
            matched++; sfx.good();
            document.getElementById("mPairs").textContent = matched + " / 8";
            first = null;
            if (matched === 8) {
              clearInterval(timer); cleanup = null;
              const stars = moves <= 12 ? 3 : moves <= 18 ? 2 : 1;
              awardStars("memory", stars);
              mascotSay("Keren! Ingatanmu tajam sekali!");
              setTimeout(() => winScreen("🏆", "Semua Pasangan Ketemu!",
                `Selesai dalam ${moves} langkah dan ${seconds} detik.`, stars, BUILDERS.memory), 600);
            }
          } else {
            lock = true; sfx.bad();
            const a = first; first = null;
            setTimeout(() => { a.classList.remove("flipped"); card.classList.remove("flipped"); lock = false; }, 750);
          }
        }
      };
