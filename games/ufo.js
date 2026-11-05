"use strict";

/* Portal Game Semua Umur: modul game "Tembak UFO" (ufo).
   Mekanik arcade klasik (pesawat penembak vs armada UFO) — kode & tampilan original.
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "ufo",    name: "Tembak UFO", icon: "🛸", art: "#cfd8ff",
          desc: "Jaga langit bareng Kiko! Geser pesawatmu, tembak UFO yang turun bergelombang sebelum mereka mendarat di Bumi.",
          cats: ["keluarga", "cepat"], age: "7+ tahun", mins: "±3 menit" });

      /* Game: Tembak UFO */
      BUILDERS.ufo = function () {
        const W = 340, H = 420;
        stage.innerHTML = `
          <div class="hud">
            <span class="stat">Skor: <b id="fScore">0</b></span>
            <span class="stat">Nyawa: <b id="fLives">❤❤❤</b></span>
            <span class="stat">Gelombang: <b id="fWave">1</b></span>
          </div>
          <div class="snake-wrap">
            <canvas id="ufoCanvas" width="${W}" height="${H}"></canvas>
            <button class="btn btn-coral" id="fStart">Mulai</button>
            <p style="margin:0;font-weight:700;color:var(--ink-soft);text-align:center">Geser pesawat dengan sentuhan / mouse atau tombol ◀ ▶. Tembakan otomatis — tugasmu cuma menghindar dan membidik!</p>
          </div>`;
        const cv = document.getElementById("ufoCanvas");
        const ctx = cv.getContext("2d");
        let ship, shots, bolts, fleet, dirX, score, lives, wave, running = false, raf = null, last = 0, keys = {}, fireAt = 0, starsBg = [];

        for (let i = 0; i < 40; i++) starsBg.push({ x: (i * 53) % W, y: (i * 97) % H, s: (i % 3) * 0.5 + 0.8 });

        function buildFleet() {
          fleet = [];
          const rows = 4, cols = 6;
          for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
              fleet.push({ x: 28 + c * 48, y: 44 + r * 36, alive: true, ph: (r * 6 + c) * 0.6 });
          dirX = 1;
        }
        function reset(full) {
          ship = { x: W / 2, y: H - 30, w: 30 };
          shots = []; bolts = [];
          if (full) { score = 0; lives = 3; wave = 1; }
          buildFleet(); updateHud(); paint(0);
        }
        function updateHud() {
          document.getElementById("fScore").textContent = score;
          document.getElementById("fLives").textContent = "❤".repeat(Math.max(lives, 0)) || "—";
          document.getElementById("fWave").textContent = wave;
        }
        function drawUfo(x, y, ph, t) {
          const bob = Math.sin(t / 300 + ph) * 2;
          ctx.font = "24px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText("🛸", x, y + bob);
        }
        function paint(t) {
          ctx.fillStyle = "#0d1230"; ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "rgba(255,255,255,.8)";
          starsBg.forEach(s => ctx.fillRect(s.x, s.y, s.s, s.s));
          ctx.strokeStyle = "rgba(126,231,135,.35)"; ctx.setLineDash([6, 5]);
          ctx.beginPath(); ctx.moveTo(0, H - 56); ctx.lineTo(W, H - 56); ctx.stroke(); ctx.setLineDash([]);
          fleet.forEach(u => { if (u.alive) drawUfo(u.x, u.y, u.ph, t); });
          ctx.fillStyle = "#ffd166";
          shots.forEach(s => ctx.fillRect(s.x - 1.5, s.y - 7, 3, 9));
          ctx.fillStyle = "#ef6461";
          bolts.forEach(b => { ctx.beginPath(); ctx.arc(b.x, b.y, 3.4, 0, 7); ctx.fill(); });
          ctx.font = "27px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText("🚀", ship.x, ship.y);
        }
        function end(won) {
          running = false; cancelAnimationFrame(raf); raf = null;
          const stars = won ? 3 : score >= 700 ? 2 : score >= 250 ? 1 : 0;
          awardStars("ufo", Math.max(stars, score > 0 ? 1 : 0));
          if (won) { sfx.win(); mascotSay("Langit bersih! Tiga gelombang UFO berhasil diusir."); }
          else mascotSay("Pesawat Kiko kena! Skor " + score + " di gelombang " + wave + ".");
          winScreen("🛸", won ? "Langit Bersih!" : "Pesawat Kena!", `Skor akhir: ${score} poin, sampai gelombang ${wave}. Bintang 3 buat yang menamatkan 3 gelombang!`, Math.max(stars, 1), BUILDERS.ufo);
        }
        function step(t) {
          if (!running) return;
          const dt = Math.min((t - last) / 1000, 0.033); last = t;
          if (keys.left) ship.x = Math.max(16, ship.x - 300 * dt);
          if (keys.right) ship.x = Math.min(W - 16, ship.x + 300 * dt);
          if (t >= fireAt) { shots.push({ x: ship.x, y: ship.y - 18 }); fireAt = t + 240; }
          const speed = 26 + wave * 6, drop = 13;
          let edge = false;
          fleet.forEach(u => { if (!u.alive) return; u.x += dirX * speed * dt; if (u.x > W - 18 || u.x < 18) edge = true; });
          if (edge) { dirX *= -1; fleet.forEach(u => { u.y += drop; }); }
          fleet.forEach(u => { if (u.alive && Math.random() < dt * 0.14) bolts.push({ x: u.x, y: u.y + 12 }); });
          shots = shots.filter(s => s.y > -10);
          shots.forEach(s => { s.y -= 430 * dt; });
          bolts = bolts.filter(b => b.y < H + 8);
          bolts.forEach(b => { b.y += 150 * dt; });
          for (const s of shots) {
            for (const u of fleet) {
              if (u.alive && Math.abs(s.x - u.x) < 17 && Math.abs(s.y - u.y) < 13) {
                u.alive = false; s.y = -99; score += 50; sfx.good(); updateHud(); break;
              }
            }
          }
          for (const b of bolts) {
            if (Math.abs(b.x - ship.x) < 16 && Math.abs(b.y - ship.y) < 14) {
              b.y = H + 99; lives--; sfx.bad(); updateHud();
              if (lives <= 0) { paint(t); end(false); return; }
            }
          }
          if (fleet.some(u => u.alive && u.y > H - 56)) { paint(t); end(false); return; }
          if (fleet.every(u => !u.alive)) {
            if (wave >= 3) { paint(t); end(true); return; }
            wave++; sfx.win(); buildFleet(); bolts = []; updateHud();
            mascotSay("Gelombang " + wave + " datang! Lebih cepat, hati-hati.");
          }
          paint(t);
          raf = requestAnimationFrame(step);
        }
        function moveShip(clientX) {
          const rect = cv.getBoundingClientRect();
          ship.x = Math.max(16, Math.min(W - 16, (clientX - rect.left) * (W / rect.width)));
          if (!running) paint(0);
        }
        function onPointer(e) { moveShip(e.clientX); }
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
        document.getElementById("fStart").addEventListener("click", e => {
          if (running) return;
          reset(true);
          running = true; last = performance.now(); fireAt = 0;
          e.target.style.display = "none";
          raf = requestAnimationFrame(step); sfx.click();
        });
        reset(true);
      };
