"use strict";

/* Portal Game Semua Umur: modul game "Asmaul Husna" (asmaul).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "asmaul",  name: "Asmaul Husna", icon: "🌙", art: "#d8ccff", edu: true,
          desc: "Belajar nama-nama indah Allah beserta artinya lewat kartu belajar, lalu pasangkan nama dengan artinya. Pelan-pelan dan penuh hormat.",
          cats: ["anak"], age: "6+ tahun", mins: "±3 menit" });

      /* Belajar 12: Asmaul Husna */
      BUILDERS.asmaul = function () {
        const BANK = [
          { n: "Ar-Rahman", m: "Maha Pengasih" },
          { n: "Ar-Rahim", m: "Maha Penyayang" },
          { n: "Al-Malik", m: "Maha Merajai" },
          { n: "Al-Quddus", m: "Maha Suci" },
          { n: "As-Salam", m: "Maha Pemberi Kesejahteraan" },
          { n: "Al-Alim", m: "Maha Mengetahui" },
          { n: "Al-Khaliq", m: "Maha Pencipta" },
          { n: "Ar-Razzaq", m: "Maha Pemberi Rezeki" },
          { n: "As-Sami", m: "Maha Mendengar" },
          { n: "Al-Basir", m: "Maha Melihat" },
          { n: "Al-Ghaffar", m: "Maha Pengampun" },
          { n: "Al-Hakim", m: "Maha Bijaksana" }
        ];
        const chosen = shuffle(BANK).slice(0, 6);
        let ti = 0;
        function teach() {
          const it = chosen[ti];
          stage.innerHTML = `
            <div class="hud"><span class="stat">Kartu Belajar: <b>${ti + 1} / ${chosen.length}</b></span></div>
            <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" aria-live="polite">Kita belajar satu nama indah Allah dan artinya, pelan-pelan ya.</p></div>
            <div class="teach-card">
              <div class="teach-name">${it.n}</div>
              <div class="teach-word">artinya: ${it.m}</div>
              <button class="btn btn-coral" id="aNext">${ti + 1 >= chosen.length ? "Mulai Memasangkan!" : "Lanjut"}</button>
            </div>`;
          document.getElementById("aNext").addEventListener("click", () => {
            sfx.click(); ti++;
            if (ti < chosen.length) teach(); else startQuiz();
          });
        }
        function startQuiz() {
          const questions = chosen.map(it => {
            const others = shuffle(BANK.filter(x => x.n !== it.n)).slice(0, 2).map(x => x.m);
            return {
              kiko: "Apa arti nama " + it.n + "?",
              visual: '<div class="teach-card"><div class="teach-name">' + it.n + "</div></div>",
              options: [tOpt(it.m, true)].concat(others.map(m => tOpt(m, false))),
              fact: "Betul! " + it.n + " artinya " + it.m + ".",
              hint: "Belum tepat. Ingat kartu belajarnya tadi, ya!"
            };
          });
          quizFlow({
            id: "asmaul", hud: "Soal", questions,
            optsStyle: "grid-template-columns:1fr;max-width:520px",
            emoji: "🌙", title: "Asmaul Husna Selesai Dipelajari!",
            text: m => "Kamu memasangkan 6 nama dengan artinya. Salah pasang " + m + " kali tidak apa-apa, belajar memang bertahap.",
            mascot: "Nama-nama indah itu sekarang mulai kamu hafal.",
            builder: BUILDERS.asmaul
          });
        }
        teach();
      };
