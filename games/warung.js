"use strict";

/* Portal Game Semua Umur: modul game "Belanja di Warung" (warung).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "warung",  name: "Belanja di Warung", icon: "🛒", art: "#c9f2e4", edu: true,
          desc: "Emak menitip daftar belanja: ambil barangnya di rak warung sampai jumlahnya pas, lalu bayar pakai uang kertas sampai tepat.",
          cats: ["anak"], age: "5+ tahun", mins: "±3 menit" });

      /* Belajar 11: Belanja di Warung */
      BUILDERS.warung = function () {
        const ITEMS = [
          { id: "telur", e: "🥚", n: "telur", cap: "Telur", price: 2000 },
          { id: "susu", e: "🥛", n: "susu", cap: "Susu", price: 5000 },
          { id: "roti", e: "🍞", n: "roti", cap: "Roti", price: 4000 },
          { id: "apel", e: "🍎", n: "apel", cap: "Apel", price: 3000 },
          { id: "permen", e: "🍬", n: "permen", cap: "Permen", price: 1000 }
        ];
        const rp = n => "Rp" + n.toLocaleString("id-ID");
        let round = 0, mistakes = 0;
        function startRound() {
          const picks = shuffle(ITEMS).slice(0, round === 0 ? 2 : 3);
          const need = {}, have = {};
          picks.forEach(it => { need[it.id] = 1 + Math.floor(Math.random() * 2); have[it.id] = 0; });
          const listText = picks.map(it => need[it.id] + " " + it.n).join(", ");
          stage.innerHTML = `
            <div class="hud"><span class="stat">Belanja: <b>${round + 1} / 2</b></span><span class="stat">Tahap: <b>Ambil Barang</b></span></div>
            <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" id="wrKiko" aria-live="polite">Kata Emak: tolong beli ${listText}, ya! Ketuk barang di rak sampai jumlahnya pas.</p></div>
            <div class="shelf" id="wrShelf"></div>
            <div class="basket" id="wrBasket"></div>`;
          const kiko = document.getElementById("wrKiko");
          const shelf = document.getElementById("wrShelf");
          const basket = document.getElementById("wrBasket");
          function renderBasket() {
            basket.innerHTML = '<div class="b-title">🧺 Keranjangmu (ketuk Keluarkan kalau kelebihan)</div>' + picks.map(it =>
              '<div class="b-row"><span>' + it.e + " " + it.cap + ": " + have[it.id] + " dari " + need[it.id] + "</span>" +
              (have[it.id] > 0 ? '<button class="b-minus" data-minus="' + it.id + '" aria-label="Keluarkan satu ' + it.n + ' dari keranjang">Keluarkan</button>' : "") +
              "</div>").join("");
            basket.querySelectorAll("[data-minus]").forEach(btn => btn.addEventListener("click", () => {
              have[btn.dataset.minus]--; sfx.click(); renderBasket();
            }));
          }
          ITEMS.forEach(it => {
            const b = document.createElement("button");
            b.className = "shelf-item";
            b.setAttribute("aria-label", "Ambil " + it.n + ", harga " + rp(it.price));
            b.innerHTML = '<span class="e" aria-hidden="true">' + it.e + '</span><span>' + it.cap + '</span><span class="p">' + rp(it.price) + "</span>";
            b.addEventListener("click", () => {
              if (!(it.id in need)) {
                mistakes++; sfx.flip(); gentleShake(b);
                kiko.textContent = it.cap + " tidak ada di daftar belanja Emak. Kita beli yang di daftar saja, ya!";
                return;
              }
              if (have[it.id] >= need[it.id]) {
                mistakes++; sfx.flip(); gentleShake(b);
                const kurang = picks.filter(p => have[p.id] < need[p.id]).map(p => p.n).join(" dan ");
                kiko.textContent = it.cap + " sudah cukup. Yang masih kurang: " + kurang + ".";
                return;
              }
              have[it.id]++; sfx.pop(); renderBasket();
              if (picks.every(p => have[p.id] === need[p.id])) {
                sfx.good();
                kiko.textContent = praiseWord() + " Semua barang sudah lengkap dan pas jumlahnya!";
                const total = picks.reduce((s, p) => s + need[p.id] * p.price, 0);
                setTimeout(() => stage2(total), 1100);
              } else {
                kiko.textContent = "Bagus, " + it.n + " masuk keranjang. Lanjutkan, ya!";
              }
            });
            shelf.appendChild(b);
          });
          renderBasket();
        }
        function stage2(total) {
          let paid = 0, done = false;
          stage.innerHTML = `
            <div class="hud"><span class="stat">Belanja: <b>${round + 1} / 2</b></span><span class="stat">Tahap: <b>Bayar</b></span></div>
            <div class="kiko-bar"><span class="kiko-face" aria-hidden="true">🦊</span><p class="kiko-text" id="wrKiko2" aria-live="polite">Total belanjanya ${rp(total)}. Ketuk uangnya sampai jumlahnya pas, ya!</p></div>
            <p class="paid-line">Uang yang kamu berikan: <span id="wrPaid">${rp(0)}</span> dari ${rp(total)}</p>
            <div class="money-row" id="wrMoney"></div>`;
          const kiko = document.getElementById("wrKiko2");
          const paidEl = document.getElementById("wrPaid");
          const moneyBox = document.getElementById("wrMoney");
          [[1000, "m1"], [2000, "m2"], [5000, "m3"]].forEach(([v, cls]) => {
            const b = document.createElement("button");
            b.className = "money-btn " + cls;
            b.textContent = rp(v);
            b.setAttribute("aria-label", "Bayar dengan uang " + rp(v));
            b.addEventListener("click", () => {
              if (done) return;
              paid += v; sfx.pop();
              paidEl.textContent = rp(paid);
              if (paid < total) {
                kiko.textContent = "Sudah " + rp(paid) + ". Kurang " + rp(total - paid) + " lagi, ya!";
              } else {
                done = true;
                const over = paid - total;
                sfx.good();
                kiko.textContent = over === 0
                  ? praiseWord() + " Uangmu pas sekali, tidak kurang tidak lebih!"
                  : "Uangmu " + rp(paid) + ", lebih " + rp(over) + ". Kelebihan " + rp(over) + " dikembalikan ke kamu, jadi tetap pas!";
                round++;
                setTimeout(() => {
                  if (round >= 2) {
                    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
                    awardStars("warung", stars);
                    mascotSay("Belanja titipan Emak beres. Kamu bisa diandalkan!");
                    winScreen("🛒", "Belanja di Warung Selesai!",
                      "Dua kali belanja berhasil: barangnya pas dan bayarnya tepat. Salah ambil " + mistakes + " kali, tidak apa-apa!", stars, BUILDERS.warung);
                  } else startRound();
                }, 1900);
              }
            });
            moneyBox.appendChild(b);
          });
        }
        startRound();
      };
