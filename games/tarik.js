"use strict";

/* Portal Game Semua Umur: modul game "Tarik Tambang Hitung" (tarik).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "tarik",   name: "Tarik Tambang Hitung", icon: "🪢", art: "#e3dcff", edu: true,
          desc: "Lomba tarik tambang melawan Kiko! Jawaban hitungan yang benar menarik tali ke arahmu. Tarik terus sampai melewati garismu!",
          cats: ["anak"], age: "6+ tahun", mins: "±3 menit" });

      /* Belajar 10: Tarik Tambang Hitung */
      BUILDERS.tarik = function () {
        const MAXQ = 15, GOAL = 5;
        let pos = 0, qn = 0, busy = false, over = false;
        stage.innerHTML = `
          <div class="hud">
            <span class="stat">Soal: <b id="tkNum">1 / ${MAXQ}</b></span>
            <span class="stat">Posisi: <b id="tkPos">Seri</b></span>
          </div>
          <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" id="tkKiko" aria-live="polite">Tarik tambang melawan Kiko! Jawaban benar menarik tali ke arahmu, jawaban salah memberi Kiko satu langkah.</p></div>
          <div class="tug" aria-hidden="true">
            <span class="tug-label" style="left:12px">Garismu</span>
            <span class="tug-label" style="right:12px">Garis Kiko</span>
            <div class="rope"></div><div class="mid"></div>
            <div class="goal goal-l"></div><div class="goal goal-r"></div>
            <span class="actor" style="left:6%">🧒</span>
            <span class="actor" style="left:94%">🦊</span>
            <span class="marker" id="tkMarker" style="left:50%">🪢</span>
          </div>
          <div class="quiz-q" id="tkQ" style="text-align:center"></div>
          <div class="big-opts" id="tkOpts" style="grid-template-columns:repeat(3,1fr);max-width:440px"></div>`;
        const kiko = document.getElementById("tkKiko");
        const marker = document.getElementById("tkMarker");
        const qBox = document.getElementById("tkQ");
        const optsBox = document.getElementById("tkOpts");
        function genQ() {
          const kind = Math.floor(Math.random() * 3);
          let a, b, ans, sym;
          if (kind === 0) { a = 4 + Math.floor(Math.random() * 46); b = 3 + Math.floor(Math.random() * 40); ans = a + b; sym = "+"; }
          else if (kind === 1) { a = 10 + Math.floor(Math.random() * 50); b = 2 + Math.floor(Math.random() * (a - 1)); ans = a - b; sym = "−"; }
          else { a = 2 + Math.floor(Math.random() * 5); b = 2 + Math.floor(Math.random() * 4); ans = a * b; sym = "×"; }
          const ds = shuffle([ans + 1, ans - 1, ans + 2, ans - 2, ans + 5].filter(v => v >= 0 && v !== ans)).slice(0, 2);
          return { text: a + " " + sym + " " + b + " = ?", ans, opts: shuffle([ans].concat(ds)) };
        }
        function paintPos() {
          marker.style.left = (50 - pos * 8) + "%";
          document.getElementById("tkPos").textContent = pos > 0 ? "Kamu memimpin " + pos + " langkah" : pos < 0 ? "Kiko memimpin " + (-pos) + " langkah" : "Seri";
        }
        function endGame(reason) {
          over = true;
          let stars, title, text, say;
          if (pos > 0) {
            stars = reason === "garis" ? 3 : 2;
            title = "Kamu Menang Tarik Tambang!";
            text = reason === "garis"
              ? "Penanda melewati garismu dalam " + qn + " soal. Tarikanmu kuat sekali!"
              : "Soal ke-15 selesai dan kamu yang memimpin. Tarikanmu menang!";
            say = "Kiko kalah tarik tambang, tapi senang main denganmu!";
          } else if (pos === 0) {
            stars = 2; title = "Seri, Sama-Sama Kuat!";
            text = "15 soal selesai dan talinya tetap di tengah. Kamu dan Kiko sama kuatnya!";
            say = "Seri! Kita memang pasangan tarik tambang yang seimbang.";
          } else {
            stars = 1; title = "Kiko Menang Kali Ini!";
            text = reason === "garis"
              ? "Penanda melewati garis Kiko. Tidak apa-apa, kamu sudah berusaha keras dan tetap dapat bintang partisipasi!"
              : "Soal ke-15 selesai dan Kiko yang memimpin. Tetap semangat, coba lagi untuk membalasnya!";
            say = "Kiko menyemangati: kalah sekali bukan akhir, ayo main lagi!";
          }
          awardStars("tarik", stars);
          mascotSay(say);
          setTimeout(() => winScreen("🪢", title, text, stars, BUILDERS.tarik), 650);
        }
        function next() {
          busy = false;
          document.getElementById("tkNum").textContent = Math.min(qn + 1, MAXQ) + " / " + MAXQ;
          const q = genQ();
          qBox.textContent = q.text;
          optsBox.innerHTML = "";
          q.opts.forEach(v => {
            const b = document.createElement("button");
            b.className = "big-opt";
            b.setAttribute("aria-label", "Jawaban " + v);
            b.innerHTML = '<span class="num">' + v + "</span>";
            b.addEventListener("click", () => {
              if (busy || over) return;
              busy = true; qn++;
              if (v === q.ans) {
                pos++; sfx.good(); b.classList.add("praise-pop");
                kiko.textContent = praiseWord() + " Betul, tali bergerak satu langkah ke arahmu!";
              } else {
                pos--; sfx.flip(); gentleShake(b);
                kiko.textContent = "Jawaban yang benar adalah " + q.ans + ". Kiko dapat satu langkah. Ayo balas di soal berikutnya!";
              }
              paintPos();
              setTimeout(() => {
                if (pos >= GOAL) endGame("garis");
                else if (pos <= -GOAL) endGame("garis");
                else if (qn >= MAXQ) endGame("soal");
                else next();
              }, 850);
            });
            optsBox.appendChild(b);
          });
        }
        paintPos();
        next();
      };
