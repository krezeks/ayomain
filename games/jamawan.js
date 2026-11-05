"use strict";

/* Portal Game Semua Umur: modul game "JAMAWAN" (jamawan).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "jamawan", name: "JAMAWAN", icon: "🔡", art: "#d2f0ff", edu: true,
          desc: "Belajar abjad sambil mengenal hewan: B itu Bebek, G itu Gajah. Lengkapi huruf pertama nama hewan yang hilang!",
          cats: ["anak"], age: "4+ tahun", mins: "±3 menit" });

      /* Belajar 5: JAMAWAN */
      BUILDERS.jamawan = function () {
        const BANK = [
          { L: "B", w: "Bebek", e: "🦆" }, { L: "K", w: "Kucing", e: "🐱" }, { L: "S", w: "Sapi", e: "🐄" },
          { L: "G", w: "Gajah", e: "🐘" }, { L: "J", w: "Jerapah", e: "🦒" }, { L: "Z", w: "Zebra", e: "🦓" },
          { L: "M", w: "Monyet", e: "🐒" }, { L: "U", w: "Ular", e: "🐍" }, { L: "I", w: "Ikan", e: "🐟" },
          { L: "A", w: "Ayam", e: "🐔" }
        ];
        const chosen = shuffle(BANK).slice(0, 6);
        let ti = 0;
        function teach() {
          const it = chosen[ti];
          stage.innerHTML = `
            <div class="hud"><span class="stat">Kartu Belajar: <b>${ti + 1} / ${chosen.length}</b></span></div>
            <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" aria-live="polite">Kita kenalan dulu dengan hewan dan hurufnya, ya!</p></div>
            <div class="teach-card">
              <div class="teach-letter">${it.L}</div>
              <div class="teach-emoji" aria-hidden="true">${it.e}</div>
              <div class="teach-word">${it.L} itu ${it.w}</div>
              <button class="btn btn-coral" id="jNext">${ti + 1 >= chosen.length ? "Mulai Tebak Huruf!" : "Lanjut"}</button>
            </div>`;
          document.getElementById("jNext").addEventListener("click", () => {
            sfx.click(); ti++;
            if (ti < chosen.length) teach(); else startQuiz();
          });
        }
        function startQuiz() {
          const questions = chosen.map(it => {
            const others = shuffle(BANK.filter(x => x.L !== it.L)).slice(0, 2).map(x => x.L);
            return {
              kiko: "Huruf pertama nama hewan ini hilang. Huruf apa, ya?",
              visual: bigVisual(it.e) + '<div class="teach-word" style="text-align:center;margin-top:0">_ ' + it.w.slice(1) + "</div>",
              options: [it.L].concat(others).map(L => ({
                label: "Huruf " + L, html: '<span class="letter">' + L + "</span>", correct: L === it.L
              })),
              fact: "Betul! " + it.L + " itu " + it.w + ".",
              hint: "Belum tepat. Ingat kartu belajarnya: hewan ini namanya " + it.w + "."
            };
          });
          quizFlow({
            id: "jamawan", hud: "Soal", questions,
            optsStyle: "grid-template-columns:repeat(3,1fr);max-width:440px",
            emoji: "🔡", title: "JAMAWAN Selesai!",
            text: m => "Kamu melengkapi 6 nama hewan. Salah huruf " + m + " kali tidak apa-apa, huruf memang perlu sering dilatih!",
            mascot: "Huruf dan hewan, dua-duanya makin kamu kenal!",
            builder: BUILDERS.jamawan
          });
        }
        teach();
      };
