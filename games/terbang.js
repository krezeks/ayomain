"use strict";

/* Portal Game Semua Umur: modul game "Terbang Bareng Kiko".
   Aksi melayang bergaya arcade, dengan karakter dan rintangan orisinal. */

      registerGame({ id: "terbang", name: "Terbang Bareng Kiko", icon: "🦊", art: "#c9f2df",
          desc: "Bantu Kiko melayang melewati bambu. Ketuk layar atau tekan Spasi buat mengepakkan sayap!",
          cats: ["anak", "keluarga", "cepat"], age: "6+ tahun", mins: "1–3 menit" });

      BUILDERS.terbang = function () {
        const W = 360, H = 500, GROUND = 58, PIPE_W = 70, GAP = 168;
        const canvasStyle = "display:block;width:min(100%,360px);height:auto;aspect-ratio:360/500;border:3px solid var(--line);border-radius:20px;touch-action:none;box-shadow:var(--shadow-sm);";
        stage.innerHTML = `
          <div class="hud">
            <span class="stat">Skor: <b id="flightScore">0</b></span>
            <span class="stat">Status: <b id="flightStatus">Siap</b></span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:12px">
            <canvas id="flightCanvas" width="${W}" height="${H}" tabindex="0" role="img"
              aria-label="Permainan Terbang Bareng Kiko. Ketuk layar atau tekan Spasi untuk melayang melewati bambu."
              style="${canvasStyle}"></canvas>
            <p id="flightHint" aria-live="polite" style="max-width:36em;margin:0;text-align:center;font-weight:700;color:var(--ink-soft)">
              Tekan Mulai, lalu ketuk layar atau tekan Spasi / panah atas untuk mengepakkan sayap.
            </p>
            <button class="btn btn-coral" id="flightStart">Mulai Terbang!</button>
          </div>`;

        const canvas = document.getElementById("flightCanvas");
        const ctx = canvas.getContext("2d");
        const scoreEl = document.getElementById("flightScore");
        const statusEl = document.getElementById("flightStatus");
        const hintEl = document.getElementById("flightHint");
        const startBtn = document.getElementById("flightStart");
        let bird, pipes, score, mode = "ready", frame = 0, lastTime = 0, raf = null;

        function makePipe(x) {
          const minTop = 72, maxTop = H - GROUND - GAP - 72;
          return { x, top: minTop + Math.random() * (maxTop - minTop), scored: false };
        }
        function reset() {
          bird = { x: 92, y: 226, vy: 0 };
          pipes = [makePipe(W + 42)];
          score = 0; frame = 0;
          scoreEl.textContent = "0";
          statusEl.textContent = "Siap";
          draw();
        }
        function flap() {
          if (mode !== "playing") return;
          bird.vy = -6.35;
          sfx.pop();
        }
        function startGame() {
          if (mode === "playing") return;
          reset();
          mode = "playing";
          bird.vy = -5.2;
          lastTime = 0;
          statusEl.textContent = "Terbang!";
          hintEl.textContent = "Bagus! Terus melayang dan lewati bambu.";
          startBtn.style.display = "none";
          canvas.focus({ preventScroll: true });
          sfx.click();
          raf = requestAnimationFrame(loop);
        }
        function gameOver() {
          if (mode !== "playing") return;
          mode = "over";
          raf = null;
          statusEl.textContent = "Selesai";
          const stars = score >= 12 ? 3 : score >= 6 ? 2 : score >= 2 ? 1 : 0;
          awardStars("terbang", stars);
          mascotSay(score >= 6 ? "Kiko terbang jauh! Hebat, terus pertahankan!" : "Kiko mendarat dulu. Coba lagi, ya!");
          winScreen("🦊", "Kiko Mendarat!", `Kamu berhasil melewati ${score} bambu. Coba lagi untuk mengalahkan skormu!`, stars, () => {
            if (cleanup) { cleanup(); cleanup = null; }
            BUILDERS.terbang();
          });
        }
        function loop(now) {
          if (mode !== "playing") return;
          const delta = lastTime ? Math.min(32, now - lastTime) : 16.67;
          lastTime = now;
          const scale = delta / 16.67;
          frame += scale;
          bird.vy += 0.34 * scale;
          bird.y += bird.vy * scale;
          const speed = 2.45 + Math.min(score, 15) * 0.025;
          pipes.forEach(pipe => { pipe.x -= speed * scale; });

          const lastPipe = pipes[pipes.length - 1];
          if (lastPipe.x < W - 214) pipes.push(makePipe(lastPipe.x + 214));
          while (pipes.length && pipes[0].x + PIPE_W < -4) pipes.shift();

          for (const pipe of pipes) {
            if (!pipe.scored && pipe.x + PIPE_W < bird.x) {
              pipe.scored = true;
              score++;
              scoreEl.textContent = String(score);
              sfx.pop();
            }
            const overlapsX = bird.x + 14 > pipe.x && bird.x - 14 < pipe.x + PIPE_W;
            if (overlapsX && (bird.y - 12 < pipe.top || bird.y + 12 > pipe.top + GAP)) {
              gameOver(); return;
            }
          }
          if (bird.y - 13 < 0 || bird.y + 13 > H - GROUND) { gameOver(); return; }
          draw();
          raf = requestAnimationFrame(loop);
        }
        function roundedRect(x, y, w, h, r) {
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, r);
          ctx.fill();
        }
        function drawSky() {
          const sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, "#8cddf2"); sky.addColorStop(1, "#dcf8fb");
          ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "rgba(255,255,255,.78)";
          for (let i = 0; i < 4; i++) {
            const x = ((i * 112 + 28 - frame * (0.18 + i * 0.015)) % (W + 100) + W + 100) % (W + 100) - 48;
            const y = 72 + (i % 3) * 55;
            ctx.beginPath(); ctx.ellipse(x, y, 25, 10, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(x + 14, y - 7, 16, 13, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(x + 28, y, 22, 9, 0, 0, Math.PI * 2); ctx.fill();
          }
          ctx.fillStyle = "#ffe58f"; ctx.beginPath(); ctx.arc(304, 70, 27, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#a5e2bd";
          ctx.beginPath(); ctx.moveTo(0, H - GROUND - 32); ctx.quadraticCurveTo(92, H - GROUND - 76, 184, H - GROUND - 29); ctx.quadraticCurveTo(278, H - GROUND - 74, W, H - GROUND - 34); ctx.lineTo(W, H - GROUND); ctx.lineTo(0, H - GROUND); ctx.fill();
        }
        function drawStalk(x, top, bottom, capAtBottom) {
          const sx = x + 9, sw = PIPE_W - 18, capH = 19;
          const grad = ctx.createLinearGradient(sx, 0, sx + sw, 0);
          grad.addColorStop(0, "#28824e"); grad.addColorStop(.28, "#65c27a"); grad.addColorStop(.72, "#3ca45e"); grad.addColorStop(1, "#267548");
          ctx.fillStyle = grad;
          if (capAtBottom) roundedRect(sx, 0, sw, Math.max(0, top - capH + 4), 8);
          else roundedRect(sx, bottom + capH - 4, sw, Math.max(0, H - GROUND - bottom - capH + 4), 8);
          ctx.fillStyle = "rgba(232,255,214,.48)"; ctx.fillRect(sx + 11, capAtBottom ? 0 : bottom + capH, 5, capAtBottom ? Math.max(0, top - capH) : Math.max(0, H - GROUND - bottom - capH));
          ctx.fillStyle = "#3b9c59";
          if (capAtBottom) roundedRect(x, top - capH, PIPE_W, capH + 4, 6);
          else roundedRect(x, bottom - 4, PIPE_W, capH + 4, 6);
          ctx.fillStyle = "rgba(222,255,205,.55)";
          ctx.fillRect(x + 9, capAtBottom ? top - capH + 3 : bottom + 1, 6, 10);
          ctx.strokeStyle = "rgba(28,99,58,.42)"; ctx.lineWidth = 2;
          const base = capAtBottom ? 34 : bottom + capH + 25;
          if (base < (capAtBottom ? top - capH : H - GROUND)) {
            ctx.beginPath(); ctx.moveTo(sx + 7, base); ctx.lineTo(sx + sw - 7, base); ctx.stroke();
          }
        }
        function drawBamboo(pipe) {
          drawStalk(pipe.x, pipe.top, pipe.top + GAP, true);
          drawStalk(pipe.x, pipe.top, pipe.top + GAP, false);
          ctx.fillStyle = "rgba(26,91,53,.15)";
          ctx.fillRect(pipe.x - 2, pipe.top - 2, PIPE_W + 4, 3);
          ctx.fillRect(pipe.x - 2, pipe.top + GAP, PIPE_W + 4, 3);
        }
        function drawFox() {
          ctx.save();
          ctx.translate(bird.x, bird.y);
          ctx.rotate(Math.max(-0.48, Math.min(0.6, bird.vy * 0.055)));
          // Tail and the green leaf glider.
          ctx.fillStyle = "#ef8b3a"; ctx.beginPath(); ctx.moveTo(-10, 5); ctx.quadraticCurveTo(-28, -10, -30, 5); ctx.quadraticCurveTo(-27, 20, -10, 11); ctx.fill();
          ctx.fillStyle = "#fff2d9"; ctx.beginPath(); ctx.moveTo(-27, 2); ctx.quadraticCurveTo(-34, 5, -27, 11); ctx.quadraticCurveTo(-22, 7, -27, 2); ctx.fill();
          ctx.save(); ctx.rotate(Math.sin(frame * 0.28) * 0.22);
          ctx.fillStyle = "#73c988"; ctx.beginPath(); ctx.ellipse(-3, 11, 13, 6, -0.35, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = "#318b52"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-14, 12); ctx.quadraticCurveTo(-4, 10, 6, 8); ctx.stroke();
          ctx.restore();
          ctx.fillStyle = "#ef8b3a"; ctx.beginPath(); ctx.ellipse(-1, 4, 17, 12, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#fff2d9"; ctx.beginPath(); ctx.ellipse(1, 8, 10, 7, 0, 0, Math.PI * 2); ctx.fill();
          // Fox ears, head, eyes, and muzzle.
          ctx.fillStyle = "#df762d"; ctx.beginPath(); ctx.moveTo(1, -9); ctx.lineTo(4, -25); ctx.lineTo(14, -11); ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.moveTo(13, -9); ctx.lineTo(23, -22); ctx.lineTo(25, -5); ctx.closePath(); ctx.fill();
          ctx.fillStyle = "#ffd4ac"; ctx.beginPath(); ctx.moveTo(6, -12); ctx.lineTo(6, -20); ctx.lineTo(11, -12); ctx.closePath(); ctx.fill();
          ctx.beginPath(); ctx.moveTo(18, -10); ctx.lineTo(22, -17); ctx.lineTo(22, -8); ctx.closePath(); ctx.fill();
          ctx.fillStyle = "#f28e3c"; ctx.beginPath(); ctx.arc(14, -5, 13, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#fff7e9"; ctx.beginPath(); ctx.ellipse(22, 1, 8, 5.5, 0.1, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#263547"; ctx.beginPath(); ctx.arc(17, -7, 1.8, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(28, 1, 1.7, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        function draw() {
          drawSky();
          pipes.forEach(drawBamboo);
          ctx.fillStyle = "#dfbf78"; ctx.fillRect(0, H - GROUND, W, GROUND);
          ctx.fillStyle = "#8ccf72"; ctx.fillRect(0, H - GROUND, W, 12);
          ctx.strokeStyle = "rgba(117,145,68,.5)"; ctx.lineWidth = 2;
          for (let x = -((frame * 2) % 28); x < W; x += 28) {
            ctx.beginPath(); ctx.moveTo(x, H - GROUND + 18); ctx.lineTo(x + 12, H - GROUND + 29); ctx.stroke();
          }
          drawFox();
          if (mode === "ready") {
            ctx.fillStyle = "rgba(29,43,56,.72)"; ctx.font = "700 19px Nunito, sans-serif"; ctx.textAlign = "center";
            ctx.fillText("Kiko siap terbang!", W / 2, 190);
          }
        }
        function onKeyDown(e) {
          if (e.code !== "Space" && e.code !== "ArrowUp") return;
          if (mode !== "playing" || e.repeat) return;
          if (document.activeElement !== canvas && document.activeElement !== document.body) return;
          e.preventDefault();
          flap();
        }
        function onPointerDown(e) {
          if (mode !== "playing") return;
          e.preventDefault();
          canvas.focus({ preventScroll: true });
          flap();
        }
        startBtn.addEventListener("click", startGame);
        canvas.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        cleanup = () => {
          if (raf !== null) cancelAnimationFrame(raf);
          raf = null;
          canvas.removeEventListener("pointerdown", onPointerDown);
          document.removeEventListener("keydown", onKeyDown);
        };
        reset();
      };
