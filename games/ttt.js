"use strict";

/* Portal Game Semua Umur: modul game "Tic Tac Toe vs Kiko" (ttt).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "ttt",     name: "Tic Tac Toe vs Kiko", icon: "⭕", art: "#d8ccff",
          desc: "Klasik tiga-sebaris melawan Kiko. Setiap kali kamu menang, Kiko belajar dari kekalahannya dan makin pintar. Jangan sampai kena jebakannya!",
          cats: ["keluarga", "cepat"], age: "6+ tahun", mins: "±1 menit" });

      /* Game 6: Tic Tac Toe */
      BUILDERS.ttt = function () {
        let board = Array(9).fill(""), over = false, wins = 0, losses = 0, draws = 0;
        stage.innerHTML = `
          <div class="hud">
            <span class="stat">Kamu (X): <b id="ttW">0</b></span>
            <span class="stat">Kiko (O): <b id="ttL">0</b></span>
            <span class="stat">Seri: <b id="ttD">0</b></span>
          </div>
          <p id="ttMsg" style="text-align:center;font-weight:900;font-size:1.05rem">Giliranmu! Kamu X, Kiko O.</p>
          <div class="ttt-grid" id="ttGrid"></div>
          <div class="center-msg"><button class="btn btn-sun" id="ttReset">Ronde Baru</button></div>`;
        const tg = document.getElementById("ttGrid");
        const cells = [];
        for (let i = 0; i < 9; i++) {
          const c = document.createElement("button");
          c.className = "ttt-cell"; c.setAttribute("aria-label", "Kotak " + (i + 1));
          c.addEventListener("click", () => playerMove(i));
          tg.appendChild(c); cells.push(c);
        }
        const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        function winner(b) {
          for (const L of LINES) if (b[L[0]] && b[L[0]] === b[L[1]] && b[L[1]] === b[L[2]]) return { who: b[L[0]], line: L };
          return null;
        }
        function draw() {
          board.forEach((v, i) => {
            cells[i].textContent = v;
            cells[i].className = "ttt-cell" + (v ? " " + v.toLowerCase() : "");
          });
        }
        function finish(w) {
          over = true;
          if (w) w.line.forEach(i => cells[i].classList.add("win"));
          const msg = document.getElementById("ttMsg");
          if (w && w.who === "X") {
            wins++; msg.textContent = "Kamu menang! Kiko sampai melongo. 🎉"; sfx.win(); confettiBurst();
            awardStars("ttt", wins >= 3 ? 3 : wins >= 2 ? 2 : 1);
          } else if (w) {
            losses++; msg.textContent = "Kiko menang ronde ini. Balas di ronde berikutnya!"; sfx.bad();
          } else {
            draws++; msg.textContent = "Seri! Sama-sama kuat."; sfx.good();
          }
          document.getElementById("ttW").textContent = wins;
          document.getElementById("ttL").textContent = losses;
          document.getElementById("ttD").textContent = draws;
        }
        function aiMove() {
          const empty = board.map((v, i) => v ? null : i).filter(v => v !== null);
          if (!empty.length) return;
          const smartness = Math.min(0.45 + wins * 0.15, 0.9); // Kiko learns from your wins
          let pick;
          if (Math.random() < smartness) {
            pick = findLine("O") ?? findLine("X") ?? (board[4] === "" ? 4 : empty[Math.floor(Math.random() * empty.length)]);
          } else {
            pick = empty[Math.floor(Math.random() * empty.length)];
          }
          board[pick] = "O"; draw(); sfx.flip();
          const w = winner(board);
          if (w) finish(w); else if (!board.includes("")) finish(null);
        }
        function findLine(mark) {
          for (const L of LINES) {
            const vals = L.map(i => board[i]);
            if (vals.filter(v => v === mark).length === 2 && vals.includes("")) return L[vals.indexOf("")];
          }
          return undefined;
        }
        function playerMove(i) {
          if (over || board[i]) return;
          board[i] = "X"; draw(); sfx.click();
          const w = winner(board);
          if (w) return finish(w);
          if (!board.includes("")) return finish(null);
          setTimeout(aiMove, 380);
        }
        document.getElementById("ttReset").addEventListener("click", () => {
          board = Array(9).fill(""); over = false; draw(); sfx.click();
          document.getElementById("ttMsg").textContent = "Giliranmu! Kamu X, Kiko O.";
        });
        draw();
      };
