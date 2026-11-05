"use strict";

/* Portal Game Semua Umur: modul game "Mewarnai Bebas" (mewarnai).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "mewarnai", name: "Mewarnai Bebas", icon: "🎨", art: "#d9f7d4", act: true,
          desc: "Pilih gambar ikan, rumah, atau bunga, lalu warnai sesuka hatimu. Bebas berkarya, tidak ada jawaban yang salah!",
          cats: ["anak"], age: "3+ tahun", mins: "Santai" });

      /* Aktivitas 5: Mewarnai Bebas */
      BUILDERS.mewarnai = function () {
        const PALETTE = [
          { n: "merah", c: "#e23b2e" }, { n: "oranye", c: "#fb8c1a" }, { n: "kuning", c: "#ffc21f" },
          { n: "hijau", c: "#43b04c" }, { n: "biru", c: "#2f7fe0" }, { n: "ungu", c: "#9b59c9" },
          { n: "pink", c: "#f06292" }, { n: "toska", c: "#17b8a6" }, { n: "cokelat", c: "#8d6e63" },
          { n: "hitam", c: "#263238" }
        ];
        const STROKE = 'stroke="#263238" stroke-width="4" stroke-linejoin="round"';
        const PICS = {
          ikan: {
            label: "Ikan",
            svg: `<svg viewBox="0 0 220 170" role="img" aria-label="Gambar garis ikan untuk diwarnai">
              <polygon class="fill-zone" points="148,85 198,48 198,122" fill="#ffffff" ${STROKE}/>
              <path class="fill-zone" d="M18 85 C48 38 112 34 150 85 C112 136 48 132 18 85 Z" fill="#ffffff" ${STROKE}/>
              <path class="fill-zone" d="M72 102 C82 124 104 128 114 110 C100 100 84 98 72 102 Z" fill="#ffffff" ${STROKE}/>
              <circle class="fill-zone" cx="52" cy="74" r="8" fill="#ffffff" stroke="#263238" stroke-width="3.5"/>
              <circle class="fill-zone" cx="24" cy="32" r="9" fill="#ffffff" stroke="#263238" stroke-width="3.5"/>
              <circle class="fill-zone" cx="50" cy="16" r="6" fill="#ffffff" stroke="#263238" stroke-width="3.5"/>
            </svg>`
          },
          rumah: {
            label: "Rumah",
            svg: `<svg viewBox="0 0 220 170" role="img" aria-label="Gambar garis rumah untuk diwarnai">
              <circle class="fill-zone" cx="188" cy="26" r="15" fill="#ffffff" ${STROKE}/>
              <rect class="fill-zone" x="150" y="32" width="17" height="36" fill="#ffffff" ${STROKE}/>
              <polygon class="fill-zone" points="38,82 110,24 182,82" fill="#ffffff" ${STROKE}/>
              <rect class="fill-zone" x="56" y="82" width="108" height="72" fill="#ffffff" ${STROKE}/>
              <rect class="fill-zone" x="66" y="96" width="24" height="24" fill="#ffffff" ${STROKE}/>
              <rect class="fill-zone" x="130" y="96" width="24" height="24" fill="#ffffff" ${STROKE}/>
              <rect class="fill-zone" x="97" y="112" width="27" height="42" fill="#ffffff" ${STROKE}/>
            </svg>`
          },
          bunga: {
            label: "Bunga",
            svg: `<svg viewBox="0 0 220 180" role="img" aria-label="Gambar garis bunga untuk diwarnai">
              <path class="fill-zone" d="M104 118 C78 114 64 98 66 82 C84 86 100 100 104 118 Z" fill="#ffffff" ${STROKE}/>
              <path class="fill-zone" d="M116 134 C142 130 156 114 154 98 C136 102 120 116 116 134 Z" fill="#ffffff" ${STROKE}/>
              <rect class="fill-zone" x="104" y="90" width="12" height="68" rx="6" fill="#ffffff" ${STROKE}/>
              <circle class="fill-zone" cx="110" cy="28" r="17" fill="#ffffff" ${STROKE}/>
              <circle class="fill-zone" cx="139" cy="47" r="17" fill="#ffffff" ${STROKE}/>
              <circle class="fill-zone" cx="128" cy="79" r="17" fill="#ffffff" ${STROKE}/>
              <circle class="fill-zone" cx="92" cy="79" r="17" fill="#ffffff" ${STROKE}/>
              <circle class="fill-zone" cx="81" cy="47" r="17" fill="#ffffff" ${STROKE}/>
              <circle class="fill-zone" cx="110" cy="56" r="14" fill="#ffffff" ${STROKE}/>
            </svg>`
          }
        };
        let current = "ikan", color = PALETTE[0].c;
        stage.innerHTML = `
          <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" aria-live="polite">Pilih gambar, pilih warna, lalu ketuk bagian gambarnya. Bebas, tidak ada yang salah!</p></div>
          <div class="pic-picker" id="cPics" role="group" aria-label="Pilih gambar"></div>
          <div class="palette" id="cPal" role="group" aria-label="Pilih warna"></div>
          <div class="color-stage" id="cStage"></div>
          <div class="center-msg">
            <button class="btn btn-sun" id="cReset">Mulai Lagi</button>
            <button class="btn btn-coral" id="cDone">Selesai Mewarnai</button>
          </div>`;
        const picsBox = document.getElementById("cPics");
        const palBox = document.getElementById("cPal");
        const colorStage = document.getElementById("cStage");
        Object.keys(PICS).forEach(key => {
          const b = document.createElement("button");
          b.className = "chip" + (key === current ? " active" : "");
          b.textContent = PICS[key].label;
          b.setAttribute("aria-pressed", key === current ? "true" : "false");
          b.addEventListener("click", () => {
            current = key; sfx.click();
            picsBox.querySelectorAll(".chip").forEach(x => { x.classList.remove("active"); x.setAttribute("aria-pressed", "false"); });
            b.classList.add("active"); b.setAttribute("aria-pressed", "true");
            renderPic();
          });
          picsBox.appendChild(b);
        });
        PALETTE.forEach((p, i) => {
          const b = document.createElement("button");
          b.className = "swatch" + (i === 0 ? " sel" : "");
          b.style.background = p.c;
          b.setAttribute("aria-label", "Warna " + p.n);
          b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
          b.addEventListener("click", () => {
            color = p.c; sfx.click();
            palBox.querySelectorAll(".swatch").forEach(x => { x.classList.remove("sel"); x.setAttribute("aria-pressed", "false"); });
            b.classList.add("sel"); b.setAttribute("aria-pressed", "true");
          });
          palBox.appendChild(b);
        });
        function renderPic() {
          colorStage.innerHTML = PICS[current].svg;
          colorStage.querySelectorAll(".fill-zone").forEach(zone => {
            zone.addEventListener("click", () => { zone.setAttribute("fill", color); sfx.pop(); });
          });
        }
        renderPic();
        document.getElementById("cReset").addEventListener("click", () => { sfx.click(); renderPic(); });
        document.getElementById("cDone").addEventListener("click", () => {
          awardStars("mewarnai", 1);
          mascotSay("Karyamu bagus sekali. Kiko suka!");
          winScreen("🎨", "Karyamu Sudah Jadi!",
            "Kamu sudah mewarnai dengan gembira. Mewarnai itu bebas, yang penting kamu senang berkarya!", 1, BUILDERS.mewarnai);
        });
      };
