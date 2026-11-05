"use strict";

/* Portal Game Semua Umur: modul game "Teka-Teki Nusantara" (nusantara).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "nusantara", name: "Teka-Teki Nusantara", icon: "🗺️", art: "#ffc7dd", edu: true,
          desc: "Kuis keliling Indonesia: ibu kota provinsi, tarian daerah, makanan khas, dan tempat terkenal, lengkap dengan fakta seru di tiap soal.",
          cats: ["anak", "keluarga"], age: "7+ tahun", mins: "±3 menit" });

      /* Belajar 6: Teka-Teki Nusantara */
      BUILDERS.nusantara = function () {
        const BANK = [
          { q: "Apa ibu kota Provinsi Bali?", a: "Denpasar", opts: ["Denpasar", "Mataram", "Kupang"], fact: "Denpasar adalah ibu kota Bali sejak tahun 1958." },
          { q: "Apa ibu kota Provinsi Jawa Barat?", a: "Bandung", opts: ["Bandung", "Semarang", "Surabaya"], fact: "Bandung dijuluki Kota Kembang karena banyak bunga dan taman." },
          { q: "Tari Kecak berasal dari daerah mana?", a: "Bali", opts: ["Bali", "Jawa Barat", "Sumatera Barat"], fact: "Penari Kecak duduk melingkar sambil bersuara cak, cak, cak." },
          { q: "Rendang berasal dari daerah mana?", a: "Sumatera Barat", opts: ["Sumatera Barat", "Jawa Tengah", "Bali"], fact: "Rendang dimasak lama sampai bumbunya meresap dan mengering." },
          { q: "Alat musik angklung berasal dari daerah mana?", a: "Jawa Barat", opts: ["Jawa Barat", "Sulawesi Selatan", "Papua"], fact: "Angklung terbuat dari bambu dan dimainkan dengan cara digoyangkan." },
          { q: "Candi Borobudur terletak di provinsi mana?", a: "Jawa Tengah", opts: ["Jawa Tengah", "Bali", "Jawa Barat"], fact: "Borobudur adalah candi Buddha terbesar di dunia." },
          { q: "Danau terbesar di Indonesia adalah...", a: "Danau Toba", opts: ["Danau Toba", "Danau Singkarak", "Danau Poso"], fact: "Di tengah Danau Toba ada pulau besar bernama Pulau Samosir." },
          { q: "Rumah Tongkonan berasal dari daerah mana?", a: "Sulawesi Selatan", opts: ["Sulawesi Selatan", "Sumatera Barat", "Bali"], fact: "Atap rumah Tongkonan melengkung seperti perahu." },
          { q: "Titik tertinggi di Indonesia adalah...", a: "Puncak Jaya", opts: ["Puncak Jaya", "Gunung Semeru", "Gunung Kerinci"], fact: "Puncak Jaya ada di Papua dan puncaknya tertutup salju." },
          { q: "Suku Asmat berasal dari daerah mana?", a: "Papua", opts: ["Papua", "Jawa Tengah", "Sulawesi Selatan"], fact: "Suku Asmat terkenal dengan ukiran kayunya yang indah." }
        ];
        const questions = shuffle(BANK).slice(0, 6).map(it => ({
          kiko: it.q,
          visual: "",
          options: it.opts.map(o => tOpt(o, o === it.a)),
          fact: it.fact,
          hint: "Belum tepat. Coba ingat lagi, jawabannya yang mana, ya?"
        }));
        quizFlow({
          id: "nusantara", hud: "Soal", questions,
          optsStyle: "grid-template-columns:1fr;max-width:480px",
          emoji: "🗺️", title: "Keliling Nusantara Selesai!",
          text: m => "6 soal tentang Indonesia selesai dijelajahi. Salah jawab " + m + " kali, tetap bangga jadi anak Indonesia!",
          mascot: "Indonesia itu luas dan kaya. Kamu makin mengenalnya!",
          builder: BUILDERS.nusantara
        });
      };
