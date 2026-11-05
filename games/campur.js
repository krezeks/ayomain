"use strict";

/* Portal Game Semua Umur: modul game "Campur Warna" (campur).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "campur",  name: "Campur Warna", icon: "🧪", art: "#ffe3c2", edu: true,
          desc: "Campur dua warna dasar di gelas besar dan lihat hasilnya jadi warna apa. Ada mode bebas bereksperimen dan mode tantangan dari Kiko!",
          cats: ["anak"], age: "4+ tahun", mins: "Santai" });

      /* Belajar 2: Campur Warna */
      BUILDERS.campur = function () {
        const BASE = [
          { k: "merah", c: "#e23b2e" }, { k: "kuning", c: "#ffc21f" }, { k: "biru", c: "#2f7fe0" }
        ];
        const MIX = { "biru+kuning": "hijau", "biru+merah": "ungu", "kuning+merah": "jingga" };
        const COLOROF = { merah: "#e23b2e", kuning: "#ffc21f", biru: "#2f7fe0", jingga: "#fb8c1a", hijau: "#43b04c", ungu: "#9b59c9" };
        let mode = "bebas", picks = [], mixes = 0, targets = [], tIdx = 0, wrongMix = 0, busy = false;
        stage.innerHTML = `
          <div class="hud"><span class="stat" id="cmStat">Campuran: <b>0</b></span></div>
          <div class="chips" role="group" aria-label="Pilih mode campur warna" style="margin:0 0 16px">
            <button class="chip active" id="cmFree" aria-pressed="true">Bebas Bereksperimen</button>
            <button class="chip" id="cmChal" aria-pressed="false">Tantangan Kiko</button>
          </div>
          <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" id="cmKiko" aria-live="polite"></p></div>
          <div id="cmTarget" style="text-align:center;margin-bottom:14px"></div>
          <div class="mix-wrap">
            <div class="mix-glass" aria-hidden="true"><div class="mix-liquid" id="cmLiquid"></div></div>
            <div class="mix-result" id="cmResult" aria-live="polite">Gelasnya masih kosong.</div>
          </div>
          <div class="drop-row" id="cmDrops"></div>
          <div class="center-msg" style="padding-top:4px">
            <button class="btn btn-ghost" id="cmReset">Ulangi Campuran</button>
            <button class="btn btn-coral" id="cmDone">Selesai</button>
          </div>`;
        const kiko = document.getElementById("cmKiko");
        const liquid = document.getElementById("cmLiquid");
        const result = document.getElementById("cmResult");
        const stat = document.getElementById("cmStat");
        const targetBox = document.getElementById("cmTarget");
        const drops = document.getElementById("cmDrops");
        BASE.forEach(col => {
          const b = document.createElement("button");
          b.className = "drop-btn";
          b.style.background = col.c;
          if (col.k === "kuning") b.style.background = "#ffd94d";
          b.innerHTML = '<span class="dot" style="background:' + col.c + '"></span> Tambah ' + col.k;
          b.setAttribute("aria-label", "Tambah warna " + col.k);
          b.addEventListener("click", () => addColor(col.k));
          drops.appendChild(b);
        });
        function mixName() {
          if (!picks.length) return "";
          if (picks.length === 1 || picks[0] === picks[1]) return picks[0];
          return MIX[picks.slice().sort().join("+")];
        }
        function paint() {
          if (!picks.length) { liquid.style.height = "0"; result.textContent = "Gelasnya masih kosong."; return; }
          liquid.style.height = picks.length === 1 ? "45%" : "85%";
          liquid.style.background = COLOROF[mixName()];
          result.textContent = picks.length === 1
            ? "Baru warna " + picks[0] + ". Tambah satu warna lagi!"
            : "Hasilnya: warna " + mixName() + "!";
        }
        function resetPicks() { picks = []; busy = false; paint(); }
        function showTarget() {
          if (mode !== "tantangan") { targetBox.innerHTML = ""; return; }
          const t = targets[tIdx];
          targetBox.innerHTML = '<span class="target-pill">Target ' + (tIdx + 1) + ' dari 5: bikin warna <span class="dot" style="background:' + COLOROF[t] + '"></span> ' + t + "</span>";
          stat.innerHTML = "Target: <b>" + (tIdx + 1) + " / 5</b>";
        }
        function setMode(m) {
          mode = m; mixes = 0; wrongMix = 0; tIdx = 0;
          document.getElementById("cmFree").classList.toggle("active", m === "bebas");
          document.getElementById("cmFree").setAttribute("aria-pressed", m === "bebas" ? "true" : "false");
          document.getElementById("cmChal").classList.toggle("active", m === "tantangan");
          document.getElementById("cmChal").setAttribute("aria-pressed", m === "tantangan" ? "true" : "false");
          document.getElementById("cmDone").style.display = m === "bebas" ? "" : "none";
          resetPicks();
          if (m === "tantangan") {
            targets = shuffle(["jingga", "hijau", "ungu", "merah", "kuning", "biru"]).slice(0, 5);
            showTarget();
            kiko.textContent = "Tantangan dimulai! Campur dua warna sampai gelasnya jadi warna target.";
          } else {
            targetBox.innerHTML = "";
            stat.innerHTML = "Campuran: <b>0</b>";
            kiko.textContent = "Ayo bereksperimen! Ketuk dua warna dasar untuk dicampur di gelas.";
          }
        }
        function addColor(k) {
          if (busy) return;
          if (picks.length >= 2) {
            gentleShake(liquid.parentElement); sfx.flip();
            kiko.textContent = "Gelasnya sudah berisi dua warna. Ketuk Ulangi Campuran untuk mencoba lagi!";
            return;
          }
          picks.push(k); sfx.pop(); paint();
          if (picks.length < 2) return;
          const name = mixName();
          if (mode === "bebas") {
            mixes++;
            stat.innerHTML = "Campuran: <b>" + mixes + "</b>";
            kiko.textContent = praiseWord() + " " + picks[0] + " dicampur " + picks[1] + " jadi warna " + name + "!";
            sfx.good();
          } else {
            busy = true;
            if (name === targets[tIdx]) {
              sfx.good();
              kiko.textContent = praiseWord() + " Kamu berhasil bikin warna " + name + "!";
              tIdx++;
              setTimeout(() => {
                if (tIdx >= targets.length) {
                  const stars = wrongMix === 0 ? 3 : wrongMix <= 2 ? 2 : 1;
                  awardStars("campur", stars);
                  mascotSay("Kamu sudah hafal campuran warna dasar!");
                  winScreen("🧪", "Tantangan Warna Berhasil!",
                    "Lima warna target selesai dibuat. Campuran yang belum pas " + wrongMix + " kali, tetap hebat!", stars, BUILDERS.campur);
                } else { resetPicks(); showTarget(); }
              }, 1300);
            } else {
              wrongMix++; sfx.flip();
              kiko.textContent = "Itu warna " + name + ". Target kita warna " + targets[tIdx] + ". Aduk lagi, yuk!";
              setTimeout(resetPicks, 1300);
            }
          }
        }
        document.getElementById("cmFree").addEventListener("click", () => { sfx.click(); setMode("bebas"); });
        document.getElementById("cmChal").addEventListener("click", () => { sfx.click(); setMode("tantangan"); });
        document.getElementById("cmReset").addEventListener("click", () => { sfx.click(); resetPicks(); kiko.textContent = mode === "tantangan" ? "Gelas dikosongkan. Coba campur lagi untuk warna " + targets[tIdx] + "!" : "Gelas dikosongkan. Mau campur warna apa lagi?"; });
        document.getElementById("cmDone").addEventListener("click", () => {
          awardStars("campur", 1);
          mascotSay("Bereksperimen itu awal jadi ilmuwan!");
          winScreen("🧪", "Bereksperimen itu Seru!",
            "Kamu sudah mencoba " + mixes + " campuran warna. Merah campur kuning jadi jingga, kuning campur biru jadi hijau, biru campur merah jadi ungu!", 1, BUILDERS.campur);
        });
        setMode("bebas");
      };
