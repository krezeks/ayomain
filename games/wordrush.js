"use strict";

/* Portal Game Semua Umur: modul game "Word Rush" (wordrush).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "wordrush", name: "Word Rush", icon: "⌨️", art: "#bfe3ff", edu: true,
          desc: "Kata bahasa Inggris tampil besar satu per satu, kamu ketik arti Indonesianya. Satu sesi 10 kata, tiap jawaban benar bernilai 100 poin plus rangkaian beruntun!",
          cats: ["anak", "keluarga"], age: "7+ tahun", mins: "±3 menit" });

      /* Belajar 13: Word Rush. An English word appears big, the player types its
         Indonesian meaning. 100 points per correct answer, a streak counter, and
         a gentle reveal of the right meaning after a miss, with no score penalty. */
      BUILDERS.wordrush = function () {
        const LEVELS = {
          1: { label: "Benda Sehari-hari", words: [
            ["pencil", "pensil"], ["book", "buku"], ["cat", "kucing"], ["dog", "anjing"], ["water", "air"],
            ["sun", "matahari"], ["moon", "bulan"], ["star", "bintang"], ["fish", "ikan"], ["bird", "burung"],
            ["house", "rumah"], ["door", "pintu"], ["table", "meja"], ["chair", "kursi"], ["apple", "apel"]
          ] },
          2: { label: "Kata Kerja dan Sifat", words: [
            ["run", "lari"], ["eat", "makan"], ["drink", "minum"], ["read", "membaca"], ["write", "menulis"],
            ["happy", "senang"], ["big", "besar"], ["small", "kecil"], ["fast", "cepat"], ["school", "sekolah"]
          ] },
          3: { label: "Campuran Lebih Sulit", words: [
            ["library", "perpustakaan"], ["mountain", "gunung"], ["river", "sungai"], ["rainbow", "pelangi"],
            ["butterfly", "kupu-kupu"], ["elephant", "gajah"], ["window", "jendela"], ["garden", "kebun"],
            ["morning", "pagi"], ["family", "keluarga"]
          ] }
        };
        const TOTAL = 10;
        let words = [], idx = 0, score = 0, streak = 0, best = 0, correct = 0, level = 1, busy = false;
        function norm(s) { return s.toLowerCase().trim().replace(/-/g, " ").replace(/\s+/g, " "); }
        function pickLevel() {
          stage.innerHTML = `
            <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" aria-live="polite">Pilih level dulu, ya! Kata Inggrisnya tampil besar, lalu kamu ketik arti Indonesianya di kolom besar.</p></div>
            <div class="lvl-grid" role="group" aria-label="Pilih level Word Rush">
              ${[1, 2, 3].map(n => `<button class="big-opt" data-lvl="${n}"><span class="lvl-t">Level ${n}</span><span class="lvl-d">${LEVELS[n].label}. Dimainkan ${TOTAL} kata, tiap jawaban benar 100 poin.</span></button>`).join("")}
            </div>`;
          stage.querySelectorAll("[data-lvl]").forEach(b =>
            b.addEventListener("click", () => { sfx.click(); start(parseInt(b.dataset.lvl, 10)); }));
        }
        function start(n) {
          level = n;
          words = shuffle(LEVELS[n].words).slice(0, TOTAL);
          idx = 0; score = 0; streak = 0; best = 0; correct = 0;
          stage.innerHTML = `
            <div class="hud">
              <span class="stat">Level: <b>${n}</b></span>
              <span class="stat">Skor: <b id="wrScore">0</b></span>
              <span class="stat">Beruntun: <b id="wrStreak">0</b></span>
              <span class="stat">Sisa Kata: <b id="wrLeft">${TOTAL}</b></span>
            </div>
            <p class="wr-sub">Apa arti kata Inggris ini dalam bahasa Indonesia?</p>
            <div class="wr-word" id="wrWord" aria-live="polite"></div>
            <div class="wr-row">
              <input class="wr-input" id="wrInput" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="go" aria-label="Ketik arti kata dalam bahasa Indonesia" placeholder="Ketik artinya di sini" />
              <button class="btn btn-coral" id="wrBtn">Jawab</button>
            </div>
            <div class="wr-feed" id="wrFeed" aria-live="polite"></div>`;
          next();
          document.getElementById("wrBtn").addEventListener("click", submit);
          document.getElementById("wrInput").addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
        }
        function next() {
          busy = false;
          document.getElementById("wrWord").textContent = words[idx][0];
          document.getElementById("wrLeft").textContent = TOTAL - idx;
          const input = document.getElementById("wrInput");
          input.value = ""; input.disabled = false;
          document.getElementById("wrBtn").disabled = false;
          input.focus();
        }
        function submit() {
          if (busy) return;
          const input = document.getElementById("wrInput");
          const feed = document.getElementById("wrFeed");
          const en = words[idx][0], id = words[idx][1];
          if (!input.value.trim()) {
            feed.textContent = "Ketik dulu artinya, ya!";
            gentleShake(input); sfx.flip();
            input.focus();
            return;
          }
          busy = true;
          input.disabled = true;
          document.getElementById("wrBtn").disabled = true;
          const right = norm(input.value) === norm(id);
          if (right) {
            score += 100; streak++; correct++;
            if (streak > best) best = streak;
            sfx.good();
            feed.textContent = praiseWord() + " Betul, " + en + " artinya " + id + ". Skor +100!";
          } else {
            streak = 0;
            sfx.flip();
            feed.textContent = "Belum tepat. " + en + " artinya " + id + ". Tidak ada hukuman, kita lanjut ke kata berikutnya!";
          }
          document.getElementById("wrScore").textContent = score;
          document.getElementById("wrStreak").textContent = streak;
          idx++;
          setTimeout(() => {
            if (!document.getElementById("wrWord")) return; // player left the game
            if (idx >= TOTAL) {
              const stars = correct >= 9 ? 3 : correct >= 6 ? 2 : 1;
              awardStars("wordrush", stars);
              mascotSay(correct >= 6 ? "Kosakatamu makin kaya. Word Rush kamu taklukkan!" : "Sudah berani mencoba 10 kata. Latihan lagi, yuk!");
              winScreen("⌨️", "Word Rush Selesai!",
                "Level " + level + " selesai: " + correct + " dari " + TOTAL + " kata benar, skor " + score + " poin, dan rangkaian terpanjangmu " + best + " jawaban beruntun.", stars, BUILDERS.wordrush);
            } else next();
          }, right ? 1100 : 2100);
        }
        pickLevel();
      };
