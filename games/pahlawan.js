"use strict";

/* Portal Game Semua Umur: modul game "Jejak Pahlawan" (pahlawan).
   Dimuat oleh index.html lewat games/catalog.js dan mendaftar ke registry shell. */

      registerGame({ id: "pahlawan", name: "Jejak Pahlawan", icon: "🏅", art: "#ffd9a8", edu: true,
          desc: "Baca petunjuknya, lalu tebak nama pahlawannya: Soekarno, Kartini, Cut Nyak Dien, dan kawan-kawan. Ada fakta singkat di tiap soal.",
          cats: ["anak", "keluarga"], age: "7+ tahun", mins: "±3 menit" });

      /* Belajar 7: Jejak Pahlawan */
      BUILDERS.pahlawan = function () {
        const BANK = [
          { clue: "Beliau membacakan teks Proklamasi Kemerdekaan Indonesia pada 17 Agustus 1945.", a: "Soekarno", opts: ["Soekarno", "Sudirman", "Bung Tomo"], fact: "Soekarno adalah presiden pertama Republik Indonesia." },
          { clue: "Beliau menulis buku Habis Gelap Terbitlah Terang dan memperjuangkan pendidikan untuk perempuan.", a: "Kartini", opts: ["Kartini", "Cut Nyak Dien", "Soekarno"], fact: "Hari Kartini diperingati setiap tanggal 21 April." },
          { clue: "Pahlawan perempuan dari Aceh ini gigih berjuang melawan penjajah selama bertahun-tahun.", a: "Cut Nyak Dien", opts: ["Cut Nyak Dien", "Kartini", "Pattimura"], fact: "Cut Nyak Dien memimpin perjuangan rakyat Aceh dengan berani." },
          { clue: "Beliau memimpin Perang Jawa yang besar pada tahun 1825 sampai 1830.", a: "Diponegoro", opts: ["Diponegoro", "Tuanku Imam Bonjol", "Sudirman"], fact: "Nama lengkapnya adalah Pangeran Diponegoro dari Yogyakarta." },
          { clue: "Beliau dijuluki Kapitan Pattimura dan berasal dari Maluku.", a: "Pattimura", opts: ["Pattimura", "Bung Tomo", "Diponegoro"], fact: "Nama asli Pattimura adalah Thomas Matulessy." },
          { clue: "Suara beliau membakar semangat warga Surabaya lewat siaran radio.", a: "Bung Tomo", opts: ["Bung Tomo", "Soekarno", "Ki Hajar Dewantara"], fact: "Pertempuran Surabaya diperingati sebagai Hari Pahlawan setiap 10 November." },
          { clue: "Beliau adalah Panglima Besar TNI pertama yang tetap bergerilya memimpin pasukan walau sedang sakit.", a: "Sudirman", opts: ["Sudirman", "Diponegoro", "Pattimura"], fact: "Jenderal Sudirman memimpin perang gerilya dari atas tandu." },
          { clue: "Beliau memimpin Perang Padri di Sumatera Barat.", a: "Tuanku Imam Bonjol", opts: ["Tuanku Imam Bonjol", "Bung Tomo", "Cut Nyak Dien"], fact: "Perang Padri terjadi di daerah Minangkabau, Sumatera Barat." },
          { clue: "Beliau mendirikan sekolah Taman Siswa dan dijuluki Bapak Pendidikan Nasional.", a: "Ki Hajar Dewantara", opts: ["Ki Hajar Dewantara", "Kartini", "Sudirman"], fact: "Semboyan beliau yang terkenal adalah Tut Wuri Handayani." }
        ];
        const questions = shuffle(BANK).slice(0, 6).map(it => ({
          kiko: it.clue + " Siapakah beliau?",
          visual: "",
          options: it.opts.map(o => tOpt(o, o === it.a)),
          fact: it.fact,
          hint: "Belum tepat. Baca lagi petunjuknya pelan-pelan, ya!"
        }));
        quizFlow({
          id: "pahlawan", hud: "Soal", questions,
          optsStyle: "grid-template-columns:1fr;max-width:480px",
          emoji: "🏅", title: "Jejak Pahlawan Ditemukan!",
          text: m => "6 jejak pahlawan selesai dilacak. Salah tebak " + m + " kali, yang penting kita ingat jasa mereka!",
          mascot: "Mengenal pahlawan bikin kita makin cinta Indonesia!",
          builder: BUILDERS.pahlawan
        });
      };
