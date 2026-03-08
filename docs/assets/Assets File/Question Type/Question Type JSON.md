{
  "PM": {
    "nama_subtes": "Penerapan Matematika",
    "fokus_umum": "Penerapan matematika dalam konteks kehidupan nyata",
    "kategori": [
      {
        "kode": "PM_01",
        "nama": "Optimasi_Program_Linear",
        "konteks_umum": ["Produksi", "Bisnis", "Industri"],
        "tujuan_umum": [
          "Keuntungan maksimum",
          "Selisih keuntungan maksimum",
          "Kenaikan keuntungan maksimum"
        ],
        "kata_kunci_instruksi": [
          "Keuntungan maksimum",
          "Selisih keuntungan maksimum",
          "Kenaikan keuntungan maksimum per hari"
        ],
        "kata_kunci_batasan": [
          "tidak lebih dari",
          "paling banyak",
          "beroperasi tidak lebih dari"
        ],
        "struktur_matematis": {
          "fungsi_objektif": "ax + by",
          "constraint": [
            "p1x + p2y ≤ k1",
            "q1x + q2y ≤ k2"
          ]
        },
        "output": ["Nilai maksimum", "Selisih", "Perbandingan sebelum-sesudah"]
      },
      {
        "kode": "PM_02",
        "nama": "Deret_Aritmetika_Keuangan",
        "konteks_umum": ["Gaji", "Tabungan", "Pengeluaran"],
        "kata_kunci_pola": [
          "meningkat setiap bulan",
          "gaji pertama sebesar",
          "kenaikan tetap"
        ],
        "kata_kunci_instruksi": [
          "Jumlah hingga bulan ke-n",
          "Total selama setahun",
          "Gaji pada bulan ke-n"
        ],
        "struktur_matematis": {
          "suku_awal": "a",
          "beda": "b",
          "rumus_suku_ke_n": "Un = a + (n-1)b",
          "rumus_jumlah": "Sn = n/2(2a + (n-1)b)"
        },
        "output": ["Un", "Sn", "Persentase kenaikan"]
      },
      {
        "kode": "PM_03",
        "nama": "Campuran_Bahan_Aljabar",
        "konteks_umum": ["Pupuk", "Campuran zat", "Komposisi massa"],
        "kata_kunci_instruksi": [
          "fungsi yang tepat adalah",
          "persentase massa",
          "ditambahkan paling banyak"
        ],
        "kata_kunci_kondisi": [
          "tidak lebih dari",
          "perbandingan massa"
        ],
        "struktur_matematis": {
          "model": "persamaan linear atau pertidaksamaan",
          "rasio": "a:b"
        },
        "output": ["Model fungsi", "Nilai maksimum", "Persentase akhir"]
      },
      {
        "kode": "PM_04",
        "nama": "Logika_Bilangan_Permainan",
        "konteks_umum": ["Permainan angka", "Aturan khusus"],
        "kata_kunci_instruksi": [
          "Aturan permainan adalah",
          "Nilai yang mungkin",
          "Banyak nilai yang memenuhi"
        ],
        "struktur_matematis": {
          "aturan_custom": "S(n) atau fungsi digit",
          "deduksi_logis": true
        },
        "output": ["Nilai memenuhi", "Jumlah kemungkinan"]
      }
    ]
  },

  "PK": {
    "nama_subtes": "Pengetahuan Kuantitatif",
    "fokus_umum": "Analisis kuantitatif, logika matematis, dan komparasi nilai",
    "kategori": [
      {
        "kode": "PK_01",
        "nama": "Hubungan_Kuantitas",
        "format": "P_vs_Q",
        "instruksi_baku": "Berdasarkan informasi yang diberikan, manakah hubungan antara kuantitas P dan Q?",
        "opsi_jawaban": [
          "P > Q",
          "Q > P",
          "P = Q",
          "Tidak dapat ditentukan"
        ],
        "konteks_variatif": [
          "Pertidaksamaan",
          "Sistem persamaan",
          "Ekspresi aljabar",
          "Luas atau nilai numerik"
        ],
        "output": ["Perbandingan P dan Q"]
      },
      {
        "kode": "PK_02",
        "nama": "Kecukupan_Data",
        "format": "Data_Sufficiency",
        "instruksi_baku": "Putuskan apakah pernyataan (1) dan (2) cukup untuk menjawab pertanyaan.",
        "jenis_pertanyaan": [
          "Nilai pasti",
          "Ya/Tidak"
        ],
        "opsi_jawaban": [
          "A",
          "B",
          "C",
          "D",
          "E"
        ],
        "struktur_logika": {
          "evaluasi_pernyataan_1": true,
          "evaluasi_pernyataan_2": true,
          "evaluasi_kombinasi": true
        }
      },
      {
        "kode": "PK_03",
        "nama": "Multiple_True_False",
        "format": "Verifikasi_4_Pernyataan",
        "instruksi_baku": "Banyaknya pernyataan yang benar adalah...",
        "jumlah_pernyataan": 4,
        "konteks_umum": [
          "Fungsi",
          "Statistika",
          "Himpunan",
          "Grafik"
        ],
        "output": ["Jumlah pernyataan benar"]
      },
      {
        "kode": "PK_04",
        "nama": "Aljabar_dan_Bilangan",
        "konteks_umum": [
          "Modulus",
          "Digit terakhir",
          "Persamaan",
          "Komposisi fungsi"
        ],
        "kata_kunci": [
          "Sisa pembagian",
          "Digit terakhir",
          "Nilai x yang memenuhi"
        ],
        "output": ["Nilai variabel", "Himpunan solusi"]
      },
      {
        "kode": "PK_05",
        "nama": "Geometri_dan_Trigonometri",
        "konteks_umum": [
          "Luas",
          "Volume",
          "Sudut",
          "Keliling"
        ],
        "kata_kunci": [
          "Luas daerah yang diarsir",
          "Jarak titik ke garis",
          "Besar sudut"
        ],
        "output": ["Nilai panjang", "Luas", "Sudut"]
      },
      {
        "kode": "PK_06",
        "nama": "Statistika_dan_Peluang",
        "konteks_umum": [
          "Rata-rata",
          "Median",
          "Peluang",
          "Kombinatorika"
        ],
        "kata_kunci": [
          "Peluang terambilnya",
          "Banyaknya cara",
          "Simpangan baku"
        ],
        "output": ["Nilai statistik", "Probabilitas"]
      }
    ]
  }
}
