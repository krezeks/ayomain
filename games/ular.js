"use strict";

/* Portal Game Semua Umur: modul game "Ular Klasik" (ular).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "ular",    name: "Ular Klasik", icon: "🐍", art: "#bdefc0",
          desc: "Game legendaris! Makan apel, tumbuh panjang, jangan menabrak. Buat yang kangen era HP jadul.",
          cats: ["dewasa", "keluarga"], age: "8+ tahun", mins: "Santai" });

      /* Game 7: Ular Klasik */
      BUILDERS.ular = function () {
        const N = 17, CELL = 20;
        stage.innerHTML = `
          <div class="hud">
            <span class="stat">Skor: <b id="uScore">0</b></span>
            <span class="stat">Panjang: <b id="uLen">3</b></span>
            <span class="stat">Status: <b id="uStatus">Tekan Mulai</b></span>
          </div>
          <div class="snake-wrap">
            <canvas id="snakeCanvas" width="340" height="340"></canvas>
            <button class="btn btn-coral" id="uStart">Mulai</button>
            <div class="dpad" aria-label="Tombol arah">
              <span class="sp"></span><button data-dir="up" aria-label="Atas">▲</button><span class="sp"></span>
              <button data-dir="left" aria-label="Kiri">◀</button><span class="sp"></span><button data-dir="right" aria-label="Kanan">▶</button>
              <span class="sp"></span><button data-dir="down" aria-label="Bawah">▼</button><span class="sp"></span>
            </div>
            <p style="margin:0;font-weight:700;color:var(--ink-soft);text-align:center">Di komputer bisa pakai tombol panah / WASD. Jangan tabrak dinding dan ekormu sendiri!</p>
          </div>`;
        const cv = document.getElementById("snakeCanvas");
        const ctx = cv.getContext("2d");
        let snake, dir, nextDir, food, score, alive = false, loop = null, started = false;

        function reset() {
          snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
          dir = { x: 1, y: 0 }; nextDir = dir; score = 0;
          placeFood(); updateHud("Siap…"); paint();
        }
        function placeFood() {
          do { food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; }
          while (snake.some(s => s.x === food.x && s.y === food.y));
        }
        function updateHud(st) {
          document.getElementById("uScore").textContent = score;
          document.getElementById("uLen").textContent = snake.length;
          if (st) document.getElementById("uStatus").textContent = st;
        }
        function paint() {
          ctx.fillStyle = "#17301f"; ctx.fillRect(0, 0, 340, 340);
          ctx.strokeStyle = "rgba(255,255,255,.05)"; ctx.lineWidth = 1;
          for (let i = 1; i < N; i++) {
            ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, 340); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(340, i * CELL); ctx.stroke();
          }
          ctx.font = "17px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText("🍎", food.x * CELL + CELL / 2, food.y * CELL + CELL / 2 + 1);
          snake.forEach((s, i) => {
            ctx.fillStyle = i === 0 ? "#7ee787" : "#3fb950";
            const pad = i === 0 ? 1.5 : 2.5;
            ctx.beginPath();
            ctx.roundRect(s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 6);
            ctx.fill();
            if (i === 0) {
              ctx.fillStyle = "#17301f";
              ctx.beginPath(); ctx.arc(s.x * CELL + 7, s.y * CELL + 8, 1.8, 0, 7); ctx.fill();
              ctx.beginPath(); ctx.arc(s.x * CELL + 13, s.y * CELL + 8, 1.8, 0, 7); ctx.fill();
            }
          });
        }
        function step() {
          dir = nextDir;
          const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
          if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || snake.some(s => s.x === head.x && s.y === head.y)) {
            gameOver(); return;
          }
          snake.unshift(head);
          if (head.x === food.x && head.y === food.y) {
            score += 10; sfx.pop(); placeFood();
          } else snake.pop();
          updateHud("Berjalan…"); paint();
        }
        function gameOver() {
          alive = false; clearInterval(loop); loop = null;
          updateHud("Game over!");
          const stars = score >= 120 ? 3 : score >= 70 ? 2 : score >= 30 ? 1 : 0;
          awardStars("ular", Math.max(stars, score > 0 ? 1 : 0));
          mascotSay("Ularnya nabrak! Skor " + score + ", lumayan buat pemanasan.");
          winScreen("🐍", "Ularnya Nabrak!", `Skor akhir: ${score} poin, panjang ${snake.length}. Rekor bintang 3 mulai dari 120 poin!`, Math.max(stars, 1), BUILDERS.ular);
        }
        function setDir(x, y) {
          if (dir.x === -x && dir.y === -y) return; // no instant reverse
          nextDir = { x, y };
        }
        function onKey(e) {
          const k = e.key.toLowerCase();
          const map = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] };
          if (map[k]) { e.preventDefault(); setDir(map[k][0], map[k][1]); }
        }
        document.addEventListener("keydown", onKey);
        cleanup = () => { clearInterval(loop); document.removeEventListener("keydown", onKey); };
        stage.querySelectorAll(".dpad button").forEach(b => {
          b.addEventListener("click", () => {
            const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[b.dataset.dir];
            setDir(d[0], d[1]); sfx.click();
          });
        });
        // swipe on canvas
        let tx = 0, ty = 0;
        cv.addEventListener("touchstart", e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
        cv.addEventListener("touchend", e => {
          const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
          if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
          if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0); else setDir(0, dy > 0 ? 1 : -1);
        }, { passive: true });

        document.getElementById("uStart").addEventListener("click", e => {
          if (alive) return;
          if (!started || !snake) reset();
          started = true; alive = true;
          e.target.style.display = "none";
          updateHud("Berjalan…");
          loop = setInterval(step, 135);
          sfx.click();
        });
        reset();
      };
