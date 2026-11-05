"use strict";

/* Portal Game Semua Umur: modul game "Urutkan Angka" (urut).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "urut",    name: "Urutkan Angka", icon: "🔟", art: "#fff3b0", act: true,
          desc: "Tiga angka sembunyi dari urutan 1 sampai 10. Temukan angka yang hilang dan lengkapi urutannya satu per satu!",
          cats: ["anak"], age: "4+ tahun", mins: "Santai" });

      /* Aktivitas 6: Urutkan Angka */
      BUILDERS.urut = function () {
        const TOTAL = 5;
        let q = 0, mistakes = 0, busy = false;
        let seq = [], missing = [], filled = {}, selectedSlot = null;
        stage.innerHTML = `
          <div class="hud"><span class="stat">Soal: <b id="nNum">1 / ${TOTAL}</b></span></div>
          <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" id="nKiko" aria-live="polite"></p></div>
          <div class="seq-row" id="nSeq"></div>
          <div class="big-opts" id="nOpts" style="grid-template-columns:repeat(4,1fr);max-width:480px"></div>`;
        const kiko = document.getElementById("nKiko");
        const seqBox = document.getElementById("nSeq");
        const optsBox = document.getElementById("nOpts");
        function renderSeq() {
          seqBox.innerHTML = "";
          seq.forEach((v, i) => {
            if (missing.includes(i) && !(i in filled)) {
              const b = document.createElement("button");
              b.className = "seq-box missing" + (i === selectedSlot ? " sel" : "");
              b.textContent = "?";
              b.setAttribute("aria-label", "Kotak kosong nomor " + (i + 1));
              b.addEventListener("click", () => { selectedSlot = i; sfx.click(); renderSeq(); });
              seqBox.appendChild(b);
            } else {
              const d = document.createElement("div");
              d.className = "seq-box" + (missing.includes(i) ? " filled" : "");
              d.textContent = v;
              seqBox.appendChild(d);
            }
          });
        }
        function renderChoices() {
          const need = missing.map(i => seq[i]);
          let distractor = 1 + Math.floor(Math.random() * 10);
          while (need.includes(distractor)) distractor = 1 + Math.floor(Math.random() * 10);
          optsBox.innerHTML = "";
          shuffle(need.concat([distractor])).forEach(v => {
            const b = document.createElement("button");
            b.className = "big-opt"; b.style.minHeight = "72px";
            b.setAttribute("aria-label", "Angka " + v);
            b.innerHTML = '<span class="num" style="font-size:2rem">' + v + "</span>";
            b.addEventListener("click", () => choose(b, v));
            optsBox.appendChild(b);
          });
        }
        function choose(btn, v) {
          if (busy || selectedSlot === null) return;
          if (seq[selectedSlot] === v) {
            filled[selectedSlot] = v; sfx.good();
            btn.classList.add("used");
            const rest = missing.filter(i => !(i in filled));
            if (!rest.length) {
              busy = true;
              kiko.textContent = praiseWord() + " Urutannya lengkap: " + seq.join(", ") + "!";
              q++;
              setTimeout(() => {
                if (q >= TOTAL) {
                  const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
                  awardStars("urut", stars);
                  mascotSay("Kamu sudah bisa mengurutkan angka!");
                  winScreen("🔟", "Urutan Angka Lengkap!",
                    `Kamu melengkapi ${TOTAL} urutan angka. Salah ketuk ${mistakes} kali, tetap luar biasa!`, stars, BUILDERS.urut);
                } else next();
              }, 1200);
            } else {
              selectedSlot = rest[0];
              kiko.textContent = "Betul! Masih ada angka yang sembunyi. Ketuk angkanya!";
              renderSeq();
            }
          } else {
            mistakes++; sfx.flip();
            gentleShake(btn);
            kiko.textContent = "Bukan angka itu. Lihat urutannya pelan-pelan, ya!";
          }
        }
        function next() {
          busy = false; filled = {};
          document.getElementById("nNum").textContent = (q + 1) + " / " + TOTAL;
          const start = 1 + Math.floor(Math.random() * 3);
          seq = [];
          for (let i = 0; i < 8; i++) seq.push(start + i);
          missing = shuffle([1, 2, 3, 4, 5, 6, 7]).slice(0, 3).sort((a, b2) => a - b2);
          selectedSlot = missing[0];
          kiko.textContent = "Tiga angka sembunyi! Ketuk kotak kosong, lalu ketuk angkanya.";
          renderSeq(); renderChoices();
        }
        next();
      };
