"use strict";

/* Portal Game Semua Umur: modul game "Kuis Kilat" (kuis).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "kuis",    name: "Kuis Kilat", icon: "🧠", art: "#c9f2e4",
          desc: "8 soal campur: hitungan, pengetahuan umum, dan logika ringan. Jawab cepat sebelum waktunya habis!",
          cats: ["keluarga", "dewasa", "cepat"], age: "9+ tahun", mins: "±2 menit" });

      /* Game 3: Kuis Kilat */
      const QUIZ_BANK = [
        { q: "Berapa hasil 7 × 8?", opts: ["54", "56", "48", "64"], a: 1 },
        { q: "Ibu kota provinsi Jawa Barat adalah…", opts: ["Semarang", "Surabaya", "Bandung", "Bogor"], a: 2 },
        { q: "Planet terdekat dari Matahari adalah…", opts: ["Venus", "Merkurius", "Mars", "Bumi"], a: 1 },
        { q: "Berapa hasil 45 + 38?", opts: ["73", "83", "93", "78"], a: 1 },
        { q: "Hewan tercepat di darat adalah…", opts: ["Kuda", "Singa", "Cheetah", "Rusa"], a: 2 },
        { q: "Air membeku pada suhu…", opts: ["10°C", "0°C", "-10°C", "5°C"], a: 1 },
        { q: "Berapa jumlah sisi pada sebuah segitiga?", opts: ["2", "4", "3", "5"], a: 2 },
        { q: "Gunung tertinggi di Indonesia adalah…", opts: ["Semeru", "Kerinci", "Rinjani", "Puncak Jaya"], a: 3 },
        { q: "Berapa hasil 100 − 37?", opts: ["63", "67", "73", "57"], a: 0 },
        { q: "Bahasa resmi negara Brasil adalah…", opts: ["Spanyol", "Portugis", "Italia", "Prancis"], a: 1 },
        { q: "Lambang kimia untuk emas adalah…", opts: ["Ag", "Fe", "Au", "Gd"], a: 2 },
        { q: "Berapa menit dalam 2,5 jam?", opts: ["120", "150", "180", "90"], a: 1 },
        { q: "Siapa penulis novel \"Laskar Pelangi\"?", opts: ["Andrea Hirata", "Tere Liye", "Pramoedya A. Toer", "Dee Lestari"], a: 0 },
        { q: "Organ tubuh yang memompa darah adalah…", opts: ["Paru-paru", "Hati", "Ginjal", "Jantung"], a: 3 }
      ];
      BUILDERS.kuis = function () {
        const qs = shuffle(QUIZ_BANK).slice(0, 8);
        let idx = 0, score = 0, timeLeft = 15, tick = null, locked = false;
        stage.innerHTML = `
          <div class="hud">
            <span class="stat">Soal: <b id="qNum">1 / 8</b></span>
            <span class="stat">Skor: <b id="qScore">0</b></span>
          </div>
          <div class="timerbar"><div id="qBar" style="width:100%"></div></div>
          <div class="quiz-q" id="qText"></div>
          <div class="quiz-opts" id="qOpts"></div>`;
        cleanup = () => clearInterval(tick);
        function showQ() {
          locked = false;
          const item = qs[idx];
          document.getElementById("qNum").textContent = (idx + 1) + " / 8";
          document.getElementById("qText").textContent = item.q;
          const order = shuffle(item.opts.map((t, i) => ({ t, right: i === item.a })));
          const box = document.getElementById("qOpts");
          box.innerHTML = "";
          order.forEach(o => {
            const b = document.createElement("button");
            b.className = "quiz-opt"; b.textContent = o.t;
            b.addEventListener("click", () => answer(b, o.right));
            box.appendChild(b);
          });
          timeLeft = 15; updateBar();
          clearInterval(tick);
          tick = setInterval(() => {
            timeLeft -= 0.2; updateBar();
            if (timeLeft <= 0) { clearInterval(tick); answer(null, false); }
          }, 200);
        }
        function updateBar() {
          const bar = document.getElementById("qBar");
          if (bar) bar.style.width = Math.max(0, timeLeft / 15 * 100) + "%";
        }
        function answer(btn, right) {
          if (locked) return; locked = true;
          clearInterval(tick);
          const item = qs[idx];
          document.querySelectorAll(".quiz-opt").forEach(b => {
            if (b.textContent === item.opts[item.a]) b.classList.add("right");
          });
          if (right) {
            score += 100 + Math.round(timeLeft * 4);
            if (btn) btn.classList.add("right");
            sfx.good();
          } else {
            if (btn) btn.classList.add("wrong");
            sfx.bad();
          }
          document.getElementById("qScore").textContent = score;
          idx++;
          setTimeout(() => {
            if (idx < qs.length) showQ();
            else {
              cleanup = null;
              const stars = score >= 900 ? 3 : score >= 550 ? 2 : score >= 250 ? 1 : 0;
              awardStars("kuis", Math.max(stars, 1));
              mascotSay(stars >= 2 ? "Otakmu encer! Kuis Kilat mah kecil." : "Sudah bagus! Coba lagi buat skor lebih tinggi.");
              winScreen("🧠", "Kuis Selesai!", `Skor akhirmu: ${score} poin dari 8 soal.`, Math.max(stars, 1), BUILDERS.kuis);
            }
          }, 1050);
        }
        showQ();
      };
