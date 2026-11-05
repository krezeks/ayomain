"use strict";

/* Portal Game Semua Umur: modul game "Jago Akor" (jagoakor).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "jagoakor", name: "Jago Akor", icon: "🎸", art: "#d9f7d4", edu: true,
          desc: "Susun akor C, F, G, Am, Dm, dan Em di papan 8 ketuk, lalu dengarkan susunanmu dimainkan. Ada mode tantangan melengkapi pola lagu juga!",
          cats: ["anak", "keluarga"], age: "6+ tahun", mins: "Santai" });

      /* Belajar 14: Jago Akor. An 8-box board (2 bars of 4 beats) filled from a
         chord palette, played back with synthesized Web Audio triads. Challenge
         mode hands the player three song patterns with some boxes locked in as
         hints; the rest is theirs to complete. */
      BUILDERS.jagoakor = function () {
        const CHORDS = {
          C:  { notes: [261.63, 329.63, 392.00], kind: "mayor", info: "Akor C adalah akor mayor. Bunyinya cerah dan riang, pas untuk membuka lagu." },
          F:  { notes: [349.23, 440.00, 523.25], kind: "mayor", info: "Akor F adalah akor mayor. Bunyinya hangat dan tenang, seperti sore yang santai." },
          G:  { notes: [392.00, 493.88, 587.33], kind: "mayor", info: "Akor G adalah akor mayor. Bunyinya gagah dan penuh semangat." },
          Am: { notes: [220.00, 261.63, 329.63], kind: "minor", info: "Akor Am adalah akor minor. Bunyinya lembut dan sedikit sendu." },
          Dm: { notes: [293.66, 349.23, 440.00], kind: "minor", info: "Akor Dm adalah akor minor. Bunyinya teduh dan syahdu didengar pelan-pelan." },
          Em: { notes: [329.63, 392.00, 493.88], kind: "minor", info: "Akor Em adalah akor minor. Bunyinya kalem dan ringan." }
        };
        const ORDER = ["C", "F", "G", "Am", "Dm", "Em"];
        const CHALLENGES = [
          { name: "Tantangan 1: Pola Ceria", desc: "Lengkapi pola lagu ceria I-IV-V-I: C, F, G, lalu pulang ke C. Polanya berulang dua kali di 8 kotak.",
            target: ["C", "F", "G", "C", "C", "F", "G", "C"], given: [0, 3, 4] },
          { name: "Tantangan 2: Pola Tenang", desc: "Lengkapi pola lagu tenang I-vi-IV-V: C, Am, F, G. Polanya berulang dua kali di 8 kotak.",
            target: ["C", "Am", "F", "G", "C", "Am", "F", "G"], given: [1, 2] },
          { name: "Tantangan 3: Pola Sendu", desc: "Lengkapi pola yang mulai dari akor minor, vi-IV-I-V: Am, F, C, G. Polanya berulang dua kali di 8 kotak.",
            target: ["Am", "F", "C", "G", "Am", "F", "C", "G"], given: [0, 3] }
        ];
        const STEP = 0.55;
        let board = Array(8).fill(null), locked = Array(8).fill(false);
        let selected = null, mode = "bebas", chalIdx = 0, wrongChecks = 0;
        const doneChal = [false, false, false];
        let playing = false, timers = [], liveOscs = [];
        stage.innerHTML = `
          <div class="hud">
            <span class="stat">Mode: <b id="jaMode">Bebas Menyusun</b></span>
            <span class="stat">Kotak Terisi: <b id="jaFill">0 / 8</b></span>
          </div>
          <div class="chips" role="group" aria-label="Pilih mode Jago Akor" style="margin:0 0 16px">
            <button class="chip active" id="jaFree" aria-pressed="true">Bebas Menyusun</button>
            <button class="chip" id="jaChal" aria-pressed="false">Mode Tantangan</button>
          </div>
          <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" id="jaKiko" aria-live="polite"></p></div>
          <div id="jaChalBox" style="display:none">
            <div class="chips" role="group" aria-label="Pilih tantangan akor" id="jaChalChips" style="margin:0 0 10px"></div>
            <p id="jaChalDesc" style="font-weight:800;color:var(--ink-soft);text-align:center;margin:0 0 16px;line-height:1.5"></p>
          </div>
          <p class="row-label">Palet akor: ketuk satu akor, lalu ketuk kotaknya</p>
          <div class="chord-pal" id="jaPal"></div>
          <p class="chord-info" id="jaInfo" aria-live="polite"></p>
          <p class="row-label">Papan susunan: baris atas birama 1, baris bawah birama 2</p>
          <div class="chord-board" id="jaBoard" role="group" aria-label="Papan susunan akor, 2 birama kali 4 ketuk"></div>
          <div class="chord-actions">
            <button class="btn btn-coral" id="jaPlay">Mainkan</button>
            <button class="btn btn-ghost" id="jaClear">Kosongkan Papan</button>
            <button class="btn btn-ghost" id="jaHear" style="display:none">Dengar Pola Contoh</button>
            <button class="btn btn-sun" id="jaCheck" style="display:none">Periksa Susunanku</button>
          </div>
          <div class="center-msg" id="jaFreeDone" style="padding-top:4px"><button class="btn btn-ghost" id="jaDone">Selesai Bermain</button></div>`;
        const kiko = document.getElementById("jaKiko");
        const info = document.getElementById("jaInfo");
        const palBox = document.getElementById("jaPal");
        const boardBox = document.getElementById("jaBoard");
        const playBtn = document.getElementById("jaPlay");
        const boxEls = [];
        ORDER.forEach(name => {
          const b = document.createElement("button");
          b.className = "chord-btn"; b.dataset.chord = name;
          b.setAttribute("aria-pressed", "false");
          b.setAttribute("aria-label", "Pilih akor " + name + ", akor " + CHORDS[name].kind);
          b.innerHTML = name + "<small>" + CHORDS[name].kind + "</small>";
          b.addEventListener("click", () => {
            selected = name;
            palBox.querySelectorAll(".chord-btn").forEach(x => {
              const on = x.dataset.chord === name;
              x.classList.toggle("sel", on);
              x.setAttribute("aria-pressed", on ? "true" : "false");
            });
            info.textContent = CHORDS[name].info + " Sekarang ketuk kotak di papan untuk mengisinya.";
            playChord(name, 0, 0.4);
          });
          palBox.appendChild(b);
        });
        for (let i = 0; i < 8; i++) {
          const b = document.createElement("button");
          b.className = "chord-box";
          b.addEventListener("click", () => boxTap(i));
          boardBox.appendChild(b); boxEls.push(b);
        }
        function renderBoard() {
          boxEls.forEach((b, i) => {
            b.className = "chord-box" + (board[i] ? " filled" : "") + (locked[i] ? " locked" : "");
            b.innerHTML = '<span class="beat">' + (locked[i] ? "petunjuk" : "ketuk " + (i + 1)) + "</span>" + (board[i] || "+");
            b.setAttribute("aria-label", locked[i]
              ? "Kotak ketuk " + (i + 1) + ", petunjuk terkunci, akor " + board[i]
              : board[i] ? "Kotak ketuk " + (i + 1) + ", terisi akor " + board[i] + ". Ketuk untuk mengosongkan"
                          : "Kotak ketuk " + (i + 1) + ", masih kosong");
          });
          document.getElementById("jaFill").textContent = board.filter(Boolean).length + " / 8";
        }
        function boxTap(i) {
          if (playing) return;
          if (locked[i]) {
            gentleShake(boxEls[i]); sfx.flip();
            kiko.textContent = "Kotak itu petunjuk dari polanya, jadi terkunci. Lengkapi kotak yang lain, ya!";
            return;
          }
          if (board[i]) {
            board[i] = null; sfx.click();
            kiko.textContent = "Kotak " + (i + 1) + " dikosongkan. Isi lagi dengan akor lain kalau mau!";
            renderBoard(); return;
          }
          if (!selected) {
            gentleShake(boxEls[i]); sfx.flip();
            kiko.textContent = "Pilih dulu akornya dari palet di atas, lalu ketuk kotak ini untuk mengisinya!";
            return;
          }
          board[i] = selected;
          playChord(selected, 0, 0.4);
          kiko.textContent = "Akor " + selected + " masuk ke kotak " + (i + 1) + ". Lanjutkan menyusun!";
          renderBoard();
        }
        function tone(freq, when, dur) {
          if (!soundOn) return;
          try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === "suspended") audioCtx.resume();
            const t = audioCtx.currentTime + when;
            const o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.type = "triangle"; o.frequency.value = freq;
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(0.10, t + 0.03);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            o.connect(g); g.connect(audioCtx.destination);
            o.start(t); o.stop(t + dur + 0.05);
            liveOscs.push(o);
            o.onended = () => { liveOscs = liveOscs.filter(x => x !== o); };
          } catch (e) { /* audio unavailable, stay silent */ }
        }
        function playChord(name, when, dur) { CHORDS[name].notes.forEach(f => tone(f, when, dur)); }
        function playSeq(seqArr, highlight) {
          stopPlay();
          if (seqArr.every(v => !v)) {
            kiko.textContent = "Papannya masih kosong. Isi dulu beberapa kotak dengan akor, ya!";
            sfx.flip(); return;
          }
          playing = true;
          playBtn.textContent = "Berhenti";
          seqArr.forEach((name, i) => {
            if (highlight) timers.push(setTimeout(() => {
              boxEls.forEach(x => x.classList.remove("playing"));
              boxEls[i].classList.add("playing");
            }, i * STEP * 1000));
            if (name) playChord(name, i * STEP, STEP * 0.95);
          });
          timers.push(setTimeout(() => stopPlay(), seqArr.length * STEP * 1000 + 80));
        }
        function stopPlay() {
          timers.forEach(clearTimeout); timers = [];
          liveOscs.forEach(o => { try { o.stop(); } catch (e) {} });
          liveOscs = [];
          boxEls.forEach(x => x.classList.remove("playing"));
          playing = false;
          playBtn.textContent = "Mainkan";
        }
        cleanup = () => stopPlay();
        playBtn.addEventListener("click", () => { if (playing) stopPlay(); else playSeq(board, true); });
        document.getElementById("jaClear").addEventListener("click", () => {
          stopPlay(); sfx.click();
          board = board.map((v, i) => locked[i] ? v : null);
          kiko.textContent = mode === "tantangan"
            ? "Papan dibersihkan, kotak petunjuk tetap terisi. Coba lengkapi lagi!"
            : "Papan dikosongkan. Susun akor baru dari awal, yuk!";
          renderBoard();
        });
        document.getElementById("jaHear").addEventListener("click", () => playSeq(CHALLENGES[chalIdx].target, false));
        document.getElementById("jaCheck").addEventListener("click", checkChallenge);
        document.getElementById("jaDone").addEventListener("click", () => {
          stopPlay();
          const filled = board.filter(Boolean).length;
          const stars = filled >= 8 ? 2 : 1;
          awardStars("jagoakor", stars);
          mascotSay("Kamu sudah jadi penyusun akor cilik!");
          winScreen("🎸", "Susunan Akormu Jadi!",
            "Kamu mengisi " + filled + " dari 8 kotak di papan akor. Ketuk Mainkan kapan pun untuk mendengar susunanmu berbunyi!", stars, BUILDERS.jagoakor);
        });
        function renderChalChips() {
          const box = document.getElementById("jaChalChips");
          box.innerHTML = "";
          CHALLENGES.forEach((c, i) => {
            const b = document.createElement("button");
            b.className = "chip" + (i === chalIdx ? " active" : "");
            b.setAttribute("aria-pressed", i === chalIdx ? "true" : "false");
            b.textContent = "Tantangan " + (i + 1) + (doneChal[i] ? " ✓" : "");
            b.addEventListener("click", () => { sfx.click(); loadChallenge(i); });
            box.appendChild(b);
          });
        }
        function loadChallenge(i) {
          stopPlay();
          chalIdx = i;
          const c = CHALLENGES[i];
          locked = c.target.map((v, idx) => c.given.includes(idx));
          board = c.target.map((v, idx) => locked[idx] ? v : null);
          selected = null;
          palBox.querySelectorAll(".chord-btn").forEach(x => { x.classList.remove("sel"); x.setAttribute("aria-pressed", "false"); });
          info.textContent = "";
          document.getElementById("jaChalDesc").textContent = c.desc;
          renderChalChips(); renderBoard();
          kiko.textContent = doneChal[i]
            ? "Tantangan ini sudah pernah kamu selesaikan. Boleh dimainkan lagi untuk latihan!"
            : c.name + " dimulai! Kotak bertanda petunjuk sudah terisi benar. Lengkapi kotak sisanya, lalu ketuk Periksa Susunanku.";
        }
        function checkChallenge() {
          if (board.some(v => !v)) {
            const empty = board.filter(v => !v).length;
            gentleShake(boardBox); sfx.flip();
            kiko.textContent = "Masih ada " + empty + " kotak kosong. Lengkapi dulu semuanya, ya!";
            return;
          }
          const target = CHALLENGES[chalIdx].target;
          if (board.every((v, i) => v === target[i])) {
            sfx.good(); confettiBurst();
            doneChal[chalIdx] = true;
            renderChalChips();
            const doneCount = doneChal.filter(Boolean).length;
            if (doneCount >= 3) {
              const stars = wrongChecks === 0 ? 3 : 2;
              awardStars("jagoakor", stars);
              mascotSay("Tiga pola lagu berhasil kamu lengkapi. Kamu memang Jago Akor!");
              setTimeout(() => winScreen("🎸", "Semua Tantangan Akor Berhasil!",
                "Kamu melengkapi 3 pola lagu: Pola Ceria, Pola Tenang, dan Pola Sendu. Salah periksa " + wrongChecks + " kali tidak mengurangi hebatmu!", stars, BUILDERS.jagoakor), 800);
            } else {
              kiko.textContent = praiseWord() + " Susunanmu tepat sekali, persis polanya! Ketuk Mainkan untuk mendengarnya. Tantangan selesai: " + doneCount + " dari 3.";
            }
          } else {
            wrongChecks++; sfx.flip();
            kiko.textContent = "Ada kotak yang belum pas dengan polanya. Ketuk Dengar Pola Contoh untuk membandingkan, lalu ubah kotak yang keliru!";
          }
        }
        function setMode(m) {
          stopPlay();
          mode = m;
          document.getElementById("jaFree").classList.toggle("active", m === "bebas");
          document.getElementById("jaFree").setAttribute("aria-pressed", m === "bebas" ? "true" : "false");
          document.getElementById("jaChal").classList.toggle("active", m === "tantangan");
          document.getElementById("jaChal").setAttribute("aria-pressed", m === "tantangan" ? "true" : "false");
          document.getElementById("jaMode").textContent = m === "bebas" ? "Bebas Menyusun" : "Tantangan";
          document.getElementById("jaChalBox").style.display = m === "tantangan" ? "" : "none";
          document.getElementById("jaCheck").style.display = m === "tantangan" ? "" : "none";
          document.getElementById("jaHear").style.display = m === "tantangan" ? "" : "none";
          document.getElementById("jaFreeDone").style.display = m === "bebas" ? "" : "none";
          if (m === "tantangan") {
            loadChallenge(chalIdx);
          } else {
            locked = Array(8).fill(false);
            board = Array(8).fill(null);
            selected = null;
            palBox.querySelectorAll(".chord-btn").forEach(x => { x.classList.remove("sel"); x.setAttribute("aria-pressed", "false"); });
            info.textContent = "";
            renderBoard();
            kiko.textContent = "Susun lagumu sendiri! Ketuk akor di palet, lalu ketuk kotak untuk mengisinya. Ketuk kotak yang terisi untuk mengosongkannya.";
          }
        }
        document.getElementById("jaFree").addEventListener("click", () => { sfx.click(); setMode("bebas"); });
        document.getElementById("jaChal").addEventListener("click", () => { sfx.click(); setMode("tantangan"); });
        setMode("bebas");
      };
