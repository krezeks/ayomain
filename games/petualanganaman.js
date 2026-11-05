"use strict";

/* Portal Game Semua Umur: modul game "Petualangan Aman" (petualanganaman).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "petualanganaman", name: "Petualangan Aman", icon: "🛡️", art: "#ffe0dc", edu: true,
          desc: "Kuis cermat keselamatan anak: menyeberang di zebra cross, helm sepeda, stopkontak, sampai makanan dari orang asing. Tiap jawaban tepat bernilai 100 poin!",
          cats: ["anak"], age: "5+ tahun", mins: "±3 menit" });

      /* Belajar 16: Petualangan Aman, mode Kuis Cermat. Safety questions for
         early elementary kids, 100 points per correct answer, instant feedback:
         "Jawabanmu tepat" when right, a gentle explanation naming the safe
         answer when not. Six questions per session from an original bank. */
      BUILDERS.petualanganaman = function () {
        const BANK = [
          { q: "Kamu mau menyeberang jalan. Apa yang paling aman kamu lakukan?",
            a: "Menyeberang di zebra cross sambil melihat ke kanan dan ke kiri",
            wrong: ["Berlari menyeberang supaya cepat sampai", "Menyeberang di mana saja yang paling dekat"],
            why: "Zebra cross memang tempat menyeberang, dan melihat kanan kiri membuatmu tahu kendaraan yang datang." },
          { q: "Ada orang yang tidak kamu kenal menawarkan permen enak. Apa yang kamu lakukan?",
            a: "Menolak dengan sopan, lalu memberitahu Ayah atau Ibu",
            wrong: ["Menerima permennya dan langsung memakannya", "Menerima permennya lalu ikut pergi dengan orang itu"],
            why: "Makanan dari orang yang tidak dikenal bisa berbahaya. Selalu beri tahu orangtuamu." },
          { q: "Di mana tempat bermain yang paling aman?",
            a: "Di halaman rumah atau taman, jauh dari jalan raya",
            wrong: ["Di pinggir jalan raya dekat kendaraan yang lewat", "Di tengah jalan yang kelihatannya sepi"],
            why: "Jalan raya adalah tempat kendaraan lewat. Bermain jauh dari jalan membuatmu aman." },
          { q: "Tanganmu masih basah. Bolehkah kamu menyentuh stopkontak?",
            a: "Tidak boleh. Keringkan tangan dulu sampai benar-benar kering",
            wrong: ["Boleh saja, asal menyentuhnya cepat-cepat", "Boleh kalau hanya memakai satu jari"],
            why: "Air bisa menghantarkan listrik, jadi menyentuh stopkontak dengan tangan basah sangat berbahaya." },
          { q: "Saat naik atau turun tangga, apa yang kamu lakukan supaya aman?",
            a: "Berpegangan pada pegangan tangga dan melangkah pelan-pelan",
            wrong: ["Berlari supaya cepat sampai", "Melompat dari satu anak tangga ke anak tangga berikutnya"],
            why: "Berpegangan membuatmu tidak mudah jatuh saat naik atau turun tangga." },
          { q: "Sebelum bersepeda, perlengkapan apa yang melindungi kepalamu?",
            a: "Helm", wrong: ["Topi", "Kacamata"],
            why: "Helm melindungi kepalamu kalau kamu terjatuh dari sepeda." },
          { q: "Di pinggir kolam renang, apa yang tidak boleh dilakukan?",
            a: "Berlari, karena lantai di pinggir kolam licin",
            wrong: ["Berjalan pelan-pelan", "Duduk menunggu giliran berenang"],
            why: "Lantai pinggir kolam basah dan licin. Berjalanlah pelan-pelan supaya tidak terpeleset." },
          { q: "Sebelum makan, apa yang harus kamu lakukan dulu?",
            a: "Mencuci tangan dengan sabun sampai bersih",
            wrong: ["Langsung makan saja", "Menonton televisi dulu"],
            why: "Tangan yang kotor membawa kuman. Cuci tangan pakai sabun sebelum makan, ya." },
          { q: "Kamu menunggu jemputan di pinggir jalan. Di mana kamu sebaiknya berdiri?",
            a: "Di belakang garis aman atau di atas trotoar",
            wrong: ["Di tepi jalan paling depan supaya cepat terlihat", "Di tengah jalan sambil melambaikan tangan"],
            why: "Berdiri di belakang garis aman atau di trotoar menjauhkanmu dari kendaraan yang lewat." },
          { q: "Kamu ingin bermain ke rumah teman. Apa yang kamu lakukan dulu?",
            a: "Memberitahu Ayah atau Ibu dan meminta izin",
            wrong: ["Pergi saja diam-diam", "Berangkat tanpa bilang kepada siapa pun"],
            why: "Orangtuamu perlu tahu kamu pergi ke mana, supaya mereka tidak cemas dan bisa menjemputmu." }
        ];
        const TOTAL = 6;
        const qs = shuffle(BANK).slice(0, TOTAL);
        let idx = 0, score = 0, correct = 0, busy = false;
        stage.innerHTML = `
          <div class="hud">
            <span class="stat">Soal: <b id="paNum">1 / ${TOTAL}</b></span>
            <span class="stat">Skor: <b id="paScore">0</b></span>
          </div>
          <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" id="paKiko" aria-live="polite">Petualangan aman dimulai! Pilih jawaban yang paling aman dan cermat, ya.</p></div>
          <div class="quiz-q" id="paQ"></div>
          <div class="quiz-opts" id="paOpts" style="grid-template-columns:1fr;max-width:560px;margin:0 auto"></div>
          <div class="safe-feed" id="paFeed" aria-live="polite"></div>`;
        const kiko = document.getElementById("paKiko");
        const feed = document.getElementById("paFeed");
        function next() {
          busy = false;
          const item = qs[idx];
          document.getElementById("paNum").textContent = (idx + 1) + " / " + TOTAL;
          document.getElementById("paQ").textContent = item.q;
          feed.textContent = "";
          const box = document.getElementById("paOpts");
          box.innerHTML = "";
          shuffle([item.a].concat(item.wrong)).forEach(text => {
            const b = document.createElement("button");
            b.className = "quiz-opt"; b.textContent = text;
            b.dataset.right = text === item.a ? "1" : "";
            b.addEventListener("click", () => answer(b, item));
            box.appendChild(b);
          });
        }
        function answer(btn, item) {
          if (busy) return;
          busy = true;
          const right = btn.dataset.right === "1";
          document.querySelectorAll("#paOpts .quiz-opt").forEach(b => {
            if (b.dataset.right === "1") b.classList.add("right");
          });
          if (right) {
            score += 100; correct++;
            sfx.good();
            feed.textContent = "Jawabanmu tepat! " + item.why;
            kiko.textContent = praiseWord() + " Kamu tahu cara menjaga diri.";
          } else {
            btn.classList.add("wrong");
            sfx.flip();
            feed.textContent = "Belum tepat, tidak apa-apa. Jawaban yang aman: " + item.a + ". " + item.why;
            kiko.textContent = "Yang penting sekarang kamu tahu jawaban amannya. Lanjut, yuk!";
          }
          document.getElementById("paScore").textContent = score;
          idx++;
          setTimeout(() => {
            if (!document.getElementById("paQ")) return; // player left the game
            if (idx >= TOTAL) {
              const stars = correct >= 5 ? 3 : correct >= 3 ? 2 : 1;
              awardStars("petualanganaman", stars);
              mascotSay(correct >= 3 ? "Kamu anak yang cermat dan tahu cara aman!" : "Menjaga diri itu penting. Kita latihan lagi, ya!");
              winScreen("🛡️", "Petualangan Aman Selesai!",
                "Kamu menjawab tepat " + correct + " dari " + TOTAL + " soal dan mengumpulkan " + score + " poin. Ingat selalu cara menjaga diri di jalan, di rumah, dan di mana pun kamu bermain.", stars, BUILDERS.petualanganaman);
            } else next();
          }, right ? 1800 : 2800);
        }
        next();
      };
