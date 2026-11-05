"use strict";

/* Portal Game Semua Umur: modul game "Ikuti Warna Kiko" (simon).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "simon",   name: "Ikuti Warna Kiko", icon: "🌈", art: "#ffc7dd",
          desc: "Kiko menyalakan warna berurutan, hafalkan dan ulangi. Seberapa panjang urutan yang bisa kamu ingat?",
          cats: ["anak", "keluarga"], age: "5+ tahun", mins: "±3 menit" });

      /* Game 5: Simon, Ikuti Warna Kiko */
      BUILDERS.simon = function () {
        const pads = [
          { cls: "pad-green", freq: 329.63, name: "hijau", shape: "●", pos: "kiri atas" },
          { cls: "pad-red", freq: 261.63, name: "merah", shape: "▲", pos: "kanan atas" },
          { cls: "pad-yellow", freq: 392.0, name: "kuning", shape: "■", pos: "kiri bawah" },
          { cls: "pad-blue", freq: 440.0, name: "biru", shape: "◆", pos: "kanan bawah" }
        ];
        let seq = [], playerIdx = 0, accepting = false, round = 0;
        stage.innerHTML = `
          <div class="hud">
            <span class="stat">Ronde: <b id="sRound">0</b></span>
            <span class="stat">Status: <b id="sStatus" aria-live="polite">Tekan Mulai</b></span>
          </div>
          <div class="simon-board" id="simonBoard">
            ${pads.map((p, i) => `<button class="simon-pad ${p.cls}" data-i="${i}" aria-label="Tombol warna ${p.name}, bentuk ${p.shape}, ${p.pos}"><span aria-hidden="true">${p.shape}</span></button>`).join("")}
          </div>
          <div class="center-msg"><button class="btn btn-coral" id="sStart">Mulai</button></div>`;
        const padEls = stage.querySelectorAll(".simon-pad");
        const status = () => document.getElementById("sStatus");
        function light(i, dur) {
          padEls[i].classList.add("lit");
          beep(pads[i].freq, 0.28, "sine", 0.14);
          setTimeout(() => padEls[i].classList.remove("lit"), dur || 320);
        }
        function playSeq() {
          accepting = false; playerIdx = 0;
          status().textContent = "Perhatikan…";
          seq.forEach((v, k) => setTimeout(() => light(v), 550 * (k + 1)));
          setTimeout(() => { accepting = true; status().textContent = "Giliranmu!"; }, 550 * seq.length + 350);
        }
        function nextRound() {
          round++;
          document.getElementById("sRound").textContent = round;
          seq.push(Math.floor(Math.random() * 4));
          setTimeout(playSeq, 500);
        }
        padEls.forEach(el => el.addEventListener("click", () => {
          if (!accepting) return;
          const i = parseInt(el.dataset.i, 10);
          light(i, 220);
          if (i === seq[playerIdx]) {
            playerIdx++;
            if (playerIdx === seq.length) { accepting = false; status().textContent = "Betul! Lanjut…"; sfx.good(); nextRound(); }
          } else {
            accepting = false; sfx.bad();
            const stars = round >= 8 ? 3 : round >= 5 ? 2 : round >= 3 ? 1 : 0;
            awardStars("simon", Math.max(stars, round > 0 ? 1 : 0));
            mascotSay("Urutan warna memang tricky. Coba lagi, ya!");
            winScreen("🌈", "Urutan Terputus!", `Kamu bertahan sampai ronde ${round}. Rekor bagus dimulai dari ronde 8!`, Math.max(stars, 1), BUILDERS.simon);
          }
        }));
        document.getElementById("sStart").addEventListener("click", e => {
          e.target.style.display = "none"; sfx.click();
          seq = []; round = 0; nextRound();
        });
      };
