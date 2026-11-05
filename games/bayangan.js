"use strict";

/* Portal Game Semua Umur: modul game "Pasang Bayangan" (bayangan).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "bayangan", name: "Pasang Bayangan", icon: "🦋", art: "#e3dcff", act: true,
          desc: "Setiap benda punya bayangan sendiri. Temukan pasangan bayangan yang pas untuk kapal, bunga, kupu-kupu, dan rumah!",
          cats: ["anak"], age: "3+ tahun", mins: "Santai" });

      /* Aktivitas 3: Pasang Bayangan */
      BUILDERS.bayangan = function () {
        const ITEMS = [
          { e: "⛵", n: "kapal" }, { e: "🌸", n: "bunga" }, { e: "🦋", n: "kupu-kupu" }, { e: "🏠", n: "rumah" }
        ];
        let matched = 0, mistakes = 0, selected = null;
        stage.innerHTML = `
          <div class="hud"><span class="stat">Terpasang: <b id="bNum">0 / 4</b></span></div>
          <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" id="bKiko" aria-live="polite">Ketuk satu benda, lalu ketuk bayangannya!</p></div>
          <p class="row-label">Benda</p>
          <div class="shadow-row" id="bItems"></div>
          <p class="row-label">Bayangan</p>
          <div class="shadow-row" id="bSlots"></div>`;
        const kiko = document.getElementById("bKiko");
        const itemsBox = document.getElementById("bItems");
        const slotsBox = document.getElementById("bSlots");
        shuffle(ITEMS).forEach(item => {
          const b = document.createElement("button");
          b.className = "shadow-item"; b.dataset.n = item.n;
          b.setAttribute("aria-label", "Benda " + item.n);
          b.innerHTML = "<span aria-hidden=\"true\">" + item.e + "</span>";
          b.addEventListener("click", () => {
            if (b.classList.contains("matched")) return;
            itemsBox.querySelectorAll(".shadow-item").forEach(x => x.classList.remove("sel"));
            b.classList.add("sel");
            selected = b; sfx.click();
            kiko.textContent = "Kamu memilih " + item.n + ". Bayangan mana yang cocok?";
          });
          itemsBox.appendChild(b);
        });
        shuffle(ITEMS).forEach((item, i) => {
          const b = document.createElement("button");
          b.className = "shadow-slot"; b.dataset.n = item.n;
          b.setAttribute("aria-label", "Bayangan nomor " + (i + 1));
          b.innerHTML = '<span class="sil" aria-hidden="true">' + item.e + "</span>";
          b.addEventListener("click", () => {
            if (b.classList.contains("matched")) return;
            if (!selected) {
              gentleShake(b); sfx.flip();
              kiko.textContent = "Pilih bendanya dulu di baris atas, ya!";
              return;
            }
            if (b.dataset.n === selected.dataset.n) {
              const name = selected.dataset.n;
              [selected, b].forEach(el => {
                el.classList.add("matched"); el.classList.remove("sel");
                const badge = document.createElement("span");
                badge.className = "matched-badge"; badge.textContent = "✓"; badge.setAttribute("aria-hidden", "true");
                el.appendChild(badge);
              });
              selected = null;
              matched++; sfx.good();
              document.getElementById("bNum").textContent = matched + " / 4";
              if (matched === 4) {
                const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
                awardStars("bayangan", stars);
                mascotSay("Semua bayangan ketemu pasangannya!");
                setTimeout(() => winScreen("🦋", "Semua Bayangan Terpasang!",
                  `Keempat benda sudah berpasangan dengan bayangannya. Salah pasang ${mistakes} kali, tidak masalah!`, stars, BUILDERS.bayangan), 500);
              } else {
                kiko.textContent = praiseWord() + " Pasangan yang tepat! Cari pasangan berikutnya.";
              }
            } else {
              mistakes++; sfx.flip();
              gentleShake(b);
              kiko.textContent = "Itu bukan bayangan " + selected.dataset.n + ". Coba yang lain!";
            }
          });
          slotsBox.appendChild(b);
        });
      };
