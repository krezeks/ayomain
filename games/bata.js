"use strict";

/* Portal Game Semua Umur: modul game "Pecah Bata" (bata).
   Mekanik arcade klasik (pantulkan bola, hancurkan bata) — kode & tampilan original.
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "bata",    name: "Pecah Bata", icon: "🧱", art: "#ffe3b3",
          desc: "Arcade klasik! Pantulkan bola pakai papanmu, hancurkan semua bata, dan jangan biarkan bolanya lolos ke bawah.",
          cats: ["keluarga", "dewasa", "cepat"], age: "7+ tahun", mins: "±2 menit" });

      /* Game: Pecah Bata */
      BUILDERS.bata = function () {
        const W = 340, H = 420;
        stage.innerHTML = `
          <div class="hud">
            <span class="stat">Skor: <b id="bScore">0</b></span>
            <span class="stat">Nyawa: <b id="bLives">❤❤❤</b></span>
            <span class="stat">Sisa bata: <b id="bLeft">0</b></span>
          </div>
          <div class="snake-wrap">
            <canvas id="bataCanvas" width="${W}" height="${H}"></canvas>
            <button class="btn btn-coral" id="bStart">Mulai</button>
            <p style="margin:0;font-weight:700;color:var(--ink-soft);text-align:center">Geser papan dengan mouse / sentuhan, atau tombol ◀ ▶ di komputer. Hancurkan semua bata buat menang!</p>
          </div>`;
        const cv = document.getElementById("bataCanvas");
        const ctx = cv.getContext("2d");
        const ROWS = 6, COLS = 8, BW = 38, BH = 16, GAP = 4, TOP = 46, LEFT = (W - (COLS * BW + (COLS - 1) * GAP)) / 2;
        const ROW_COLORS = ["#ef6461", "#f2a541", "#f5d547", "#7ee787", "#58a6ff", "#bc8cff"];
        let paddle, ball, bricks, score, lives, running = false, raf = null, last = 0, keys = {};

        function buildBricks() {
          bricks = [];
          for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++)
              bricks.push({ x: LEFT + c * (BW + GAP), y: TOP + r * (BH + GAP), alive: true, color: ROW_COLORS[r] });
        }
        function reset(full) {
          paddle = { w: 64, h: 10, x: W / 2 - 32, y: H - 26 };
          ball = { x: W / 2, y: H - 40, r: 6, vx: 150, vy: -210 };
          if (full) { score = 0; lives = 3; buildBricks(); }
          updateHud(); paint();
        }
        function updateHud() {
          document.getElementById("bScore").textContent = score;
          document.getElementById("bLives").textContent = "❤".repeat(Math.max(lives, 0)) || "—";
          document.getElementById("bLeft").textContent = bricks.filter(b => b.alive).length;
        }
        function paint() {
          ctx.fillStyle = "#1b1030"; ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.font = "10px serif";
          for (let i = 0; i < 26; i++) { const sx = (i * 67) % W, sy = (i * 41) % 120; ctx.fillRect(sx, sy, 1.6, 1.6); }
          bricks.forEach(b => {
            if (!b.alive) return;
            ctx.fillStyle = b.color;
            ctx.beginPath(); ctx.roundRect(b.x, b.y, BW, BH, 4); ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,.28)";
            ctx.fillRect(b.x + 3, b.y + 2.5, BW - 6, 3);
          });
          ctx.fillStyle = "#ffb454";
          ctx.beginPath(); ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 5); ctx.fill();
          ctx.fillStyle = "#fff3d6";
          ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, 7); ctx.fill();
        }
        function end(win) {
          running = false; cancelAnimationFrame(raf); raf = null;
          const total = ROWS * COLS, gone = total - bricks.filter(b => b.alive).length;
          const stars = win ? 3 : gone >= total * 0.6 ? 2 : gone > 6 ? 1 : 0;
          awardStars("bata", Math.max(stars, score > 0 ? 1 : 0));
          if (win) { sfx.win(); mascotSay("Semua bata hancur! Refleksmu mantap."); }
          else mascotSay("Bolanya lolos terus! Skor " + score + " — coba lagi, batanya kurang " + (total - gone) + ".");
          winScreen("🧱", win ? "Semua Bata Hancur!" : "Bola Lolos!", `Skor akhir: ${score} poin. Bata hancur: ${gone} dari ${total}.`, Math.max(stars, 1), BUILDERS.bata);
        }
        function step(t) {
          if (!running) return;
          const dt = Math.min((t - last) / 1000, 0.033); last = t;
          if (keys.left) paddle.x = Math.max(0, paddle.x - 340 * dt);
          if (keys.right) paddle.x = Math.min(W - paddle.w, paddle.x + 340 * dt);
          ball.x += ball.vx * dt; ball.y += ball.vy * dt;
          if (ball.x < ball.r) { ball.x = ball.r; ball.vx = Math.abs(ball.vx); sfx.flip(); }
          if (ball.x > W - ball.r) { ball.x = W - ball.r; ball.vx = -Math.abs(ball.vx); sfx.flip(); }
          if (ball.y < ball.r) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); sfx.flip(); }
          if (ball.vy > 0 && ball.y + ball.r >= paddle.y && ball.y + ball.r <= paddle.y + paddle.h + 6 && ball.x >= paddle.x - ball.r && ball.x <= paddle.x + paddle.w + ball.r) {
            const rel = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
            const sp = Math.min(Math.hypot(ball.vx, ball.vy) * 1.015, 380);
            const ang = rel * 1.05;
            ball.vx = sp * Math.sin(ang); ball.vy = -Math.abs(sp * Math.cos(ang));
            ball.y = paddle.y - ball.r - 1; sfx.pop();
          }
          for (const b of bricks) {
            if (!b.alive) continue;
            if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + BW && ball.y + ball.r > b.y && ball.y - ball.r < b.y + BH) {
              b.alive = false; score += 10; ball.vy = -ball.vy; sfx.good(); updateHud(); break;
            }
          }
          if (bricks.every(b => !b.alive)) { paint(); end(true); return; }
          if (ball.y - ball.r > H) {
            lives--; sfx.bad(); updateHud();
            if (lives <= 0) { paint(); end(false); return; }
            ball = { x: paddle.x + paddle.w / 2, y: H - 40, r: 6, vx: 150, vy: -210 };
          }
          paint();
          raf = requestAnimationFrame(step);
        }
        function movePaddle(clientX) {
          const rect = cv.getBoundingClientRect();
          const x = (clientX - rect.left) * (W / rect.width);
          paddle.x = Math.max(0, Math.min(W - paddle.w, x - paddle.w / 2));
          if (!running) { ball.x = paddle.x + paddle.w / 2; paint(); }
        }
        function onPointer(e) { movePaddle(e.clientX); }
        function onKey(e) {
          const k = e.key.toLowerCase();
          if (k === "arrowleft" || k === "a") { keys.left = true; e.preventDefault(); }
          if (k === "arrowright" || k === "d") { keys.right = true; e.preventDefault(); }
        }
        function onKeyUp(e) {
          const k = e.key.toLowerCase();
          if (k === "arrowleft" || k === "a") keys.left = false;
          if (k === "arrowright" || k === "d") keys.right = false;
        }
        cv.addEventListener("pointermove", onPointer);
        cv.addEventListener("pointerdown", onPointer);
        document.addEventListener("keydown", onKey);
        document.addEventListener("keyup", onKeyUp);
        cleanup = () => { running = false; cancelAnimationFrame(raf); document.removeEventListener("keydown", onKey); document.removeEventListener("keyup", onKeyUp); };
        document.getElementById("bStart").addEventListener("click", e => {
          if (running) return;
          reset(true);
          running = true; last = performance.now();
          e.target.style.display = "none";
          raf = requestAnimationFrame(step); sfx.click();
        });
        reset(true);
      };
