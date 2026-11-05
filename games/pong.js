"use strict";

/* Portal Game Semua Umur: modul game "Pong Kiko" (pong).
   Mekanik arcade klasik (duel papan & bola) — kode & tampilan original.
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "pong",    name: "Pong Kiko", icon: "🏓", art: "#d3f8e3",
          desc: "Duel pong lawan Kiko! Gerakkan papanmu, pantulkan bola melewati Kiko. Siapa duluan sampai 7 poin, dia pemenangnya.",
          cats: ["keluarga", "dewasa", "cepat"], age: "7+ tahun", mins: "±2 menit" });

      /* Game: Pong Kiko */
      BUILDERS.pong = function () {
        const W = 340, H = 300, WIN_SCORE = 7;
        stage.innerHTML = `
          <div class="hud">
            <span class="stat">Kamu: <b id="pYou">0</b></span>
            <span class="stat">Kiko: <b id="pKiko">0</b></span>
            <span class="stat">Target: <b>${WIN_SCORE} poin</b></span>
          </div>
          <div class="snake-wrap">
            <canvas id="pongCanvas" width="${W}" height="${H}"></canvas>
            <button class="btn btn-coral" id="pStart">Mulai</button>
            <p style="margin:0;font-weight:700;color:var(--ink-soft);text-align:center">Papanmu yang kiri (oranye). Gerakkan dengan mouse / sentuhan, atau tombol ▲ ▼. Kiko makin pintar tiap kamu mencetak poin!</p>
          </div>`;
        const cv = document.getElementById("pongCanvas");
        const ctx = cv.getContext("2d");
        const PH = 54, PW = 9;
        let you, kiko, ball, scoreYou, scoreKiko, running = false, raf = null, last = 0, keys = {}, serveAt = 0;

        function serve(dir) {
          ball = { x: W / 2, y: H / 2, r: 6, vx: 175 * dir, vy: (Math.random() * 120 - 60) };
          serveAt = performance.now() + 650;
        }
        function reset(full) {
          you = { y: H / 2 - PH / 2 };
          kiko = { y: H / 2 - PH / 2 };
          if (full) { scoreYou = 0; scoreKiko = 0; }
          serve(Math.random() < 0.5 ? 1 : -1);
          updateHud(); paint();
        }
        function updateHud() {
          document.getElementById("pYou").textContent = scoreYou;
          document.getElementById("pKiko").textContent = scoreKiko;
        }
        function paint() {
          ctx.fillStyle = "#12241a"; ctx.fillRect(0, 0, W, H);
          ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.setLineDash([5, 7]); ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = "#ffb454";
          ctx.beginPath(); ctx.roundRect(8, you.y, PW, PH, 4); ctx.fill();
          ctx.fillStyle = "#7ee787";
          ctx.beginPath(); ctx.roundRect(W - 8 - PW, kiko.y, PW, PH, 4); ctx.fill();
          ctx.font = "15px serif"; ctx.textAlign = "center";
          ctx.fillText("🦊", W - 26, kiko.y - 8);
          ctx.fillStyle = "#fff3d6";
          ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, 7); ctx.fill();
        }
        function end(won) {
          running = false; cancelAnimationFrame(raf); raf = null;
          const stars = won ? 3 : scoreYou >= 5 ? 2 : scoreYou >= 2 ? 1 : 0;
          awardStars("pong", Math.max(stars, scoreYou > 0 ? 1 : 0));
          if (won) { sfx.win(); mascotSay("Kamu menang lawan Kiko! " + scoreYou + "–" + scoreKiko + ". Refleks juara!"); }
          else mascotSay("Kiko menang " + scoreKiko + "–" + scoreYou + ". Rematch? Kiko nungguin tuh.");
          winScreen("🏓", won ? "Kamu Menang!" : "Kiko Menang!", `Skor akhir: Kamu ${scoreYou} — ${scoreKiko} Kiko. Target ${WIN_SCORE} poin tercapai.`, Math.max(stars, 1), BUILDERS.pong);
        }
        function step(t) {
          if (!running) return;
          const dt = Math.min((t - last) / 1000, 0.033); last = t;
          if (keys.up) you.y = Math.max(0, you.y - 330 * dt);
          if (keys.down) you.y = Math.min(H - PH, you.y + 330 * dt);
          const aiSpeed = 150 + scoreYou * 16;
          const target = ball.y - PH / 2;
          if (ball.vx > 0) {
            if (kiko.y + 3 < target) kiko.y = Math.min(H - PH, kiko.y + aiSpeed * dt);
            else if (kiko.y - 3 > target) kiko.y = Math.max(0, kiko.y - aiSpeed * dt);
          }
          if (t >= serveAt) {
            ball.x += ball.vx * dt; ball.y += ball.vy * dt;
            if (ball.y < ball.r) { ball.y = ball.r; ball.vy = Math.abs(ball.vy); sfx.flip(); }
            if (ball.y > H - ball.r) { ball.y = H - ball.r; ball.vy = -Math.abs(ball.vy); sfx.flip(); }
            if (ball.vx < 0 && ball.x - ball.r <= 8 + PW && ball.x - ball.r >= 8 && ball.y >= you.y - ball.r && ball.y <= you.y + PH + ball.r) {
              const rel = (ball.y - (you.y + PH / 2)) / (PH / 2);
              const sp = Math.min(Math.hypot(ball.vx, ball.vy) * 1.05, 400);
              ball.vx = Math.abs(sp * Math.cos(rel * 1.0)); ball.vy = sp * Math.sin(rel * 1.0);
              ball.x = 8 + PW + ball.r + 1; sfx.pop();
            }
            if (ball.vx > 0 && ball.x + ball.r >= W - 8 - PW && ball.x + ball.r <= W - 8 && ball.y >= kiko.y - ball.r && ball.y <= kiko.y + PH + ball.r) {
              const rel = (ball.y - (kiko.y + PH / 2)) / (PH / 2);
              const sp = Math.min(Math.hypot(ball.vx, ball.vy) * 1.05, 400);
              ball.vx = -Math.abs(sp * Math.cos(rel * 1.0)); ball.vy = sp * Math.sin(rel * 1.0);
              ball.x = W - 8 - PW - ball.r - 1; sfx.pop();
            }
            if (ball.x < -12) {
              scoreKiko++; sfx.bad(); updateHud();
              if (scoreKiko >= WIN_SCORE) { paint(); end(false); return; }
              serve(1);
            }
            if (ball.x > W + 12) {
              scoreYou++; sfx.good(); updateHud();
              if (scoreYou >= WIN_SCORE) { paint(); end(true); return; }
              serve(-1);
            }
          }
          paint();
          raf = requestAnimationFrame(step);
        }
        function moveYou(clientY) {
          const rect = cv.getBoundingClientRect();
          const y = (clientY - rect.top) * (H / rect.height);
          you.y = Math.max(0, Math.min(H - PH, y - PH / 2));
          if (!running) paint();
        }
        function onPointer(e) { moveYou(e.clientY); }
        function onKey(e) {
          const k = e.key.toLowerCase();
          if (k === "arrowup" || k === "w") { keys.up = true; e.preventDefault(); }
          if (k === "arrowdown" || k === "s") { keys.down = true; e.preventDefault(); }
        }
        function onKeyUp(e) {
          const k = e.key.toLowerCase();
          if (k === "arrowup" || k === "w") keys.up = false;
          if (k === "arrowdown" || k === "s") keys.down = false;
        }
        cv.addEventListener("pointermove", onPointer);
        cv.addEventListener("pointerdown", onPointer);
        document.addEventListener("keydown", onKey);
        document.addEventListener("keyup", onKeyUp);
        cleanup = () => { running = false; cancelAnimationFrame(raf); document.removeEventListener("keydown", onKey); document.removeEventListener("keyup", onKeyUp); };
        document.getElementById("pStart").addEventListener("click", e => {
          if (running) return;
          reset(true);
          running = true; last = performance.now();
          e.target.style.display = "none";
          raf = requestAnimationFrame(step); sfx.click();
        });
        reset(true);
      };
