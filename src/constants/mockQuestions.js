/**
 * Mock questions for fallback when AI generation fails
 * These are high-quality sample questions with various representations
 */
export const MOCK_QUESTIONS = [
  {
    id: 1,
    stimulus: "Dalam studi meteorologi, durasi suatu peristiwa presipitasi (hujan) dapat dimodelkan berdasarkan volume air yang tersimpan.",
    representation: {
      type: "function",
      data: {
        function: "T = \\frac{V}{R}",
        variables: [
          { name: "V", desc: "Volume air ($m^3$)" }, 
          { name: "R", desc: "Laju presipitasi ($m^3$/menit)" }, 
          { name: "T", desc: "Durasi (menit)" }
        ]
      }
    },
    text: "Jika volume air $V=500\\ m^3$ dan laju presipitasi $R=50\\ m^3$/menit, berapakah durasi hujan ($T$)?",
    options: ["10 menit", "12.5 menit", "15 menit", "20 menit", "25 menit"],
    correctIndex: 0,
    explanation: "Substitusi: $T = \\frac{500}{50} = 10$ menit"
  },
  {
    id: 2,
    stimulus: "Fenomena kenaikan harga barang pokok memicu respons berantai dalam ekonomi rumah tangga.",
    representation: { type: "text", data: null },
    text: "Jika harga beras naik $20\\%$ sementara gaji tetap, tindakan manakah yang paling mencerminkan prinsip ekonomi rasional?",
    options: [
      "Menggunakan tabungan darurat", 
      "Mengurangi porsi makan drastis", 
      "Mencari barang substitusi (jagung/ubi)", 
      "Berutang untuk gaya hidup", 
      "Menunggu bantuan pemerintah"
    ],
    correctIndex: 2,
    explanation: "Substitusi adalah langkah rasional untuk memaksimalkan utilitas dengan anggaran terbatas."
  },
  {
    id: 3,
    stimulus: "Pola tidur manusia dipengaruhi oleh ritme sirkadian.",
    representation: { type: "text", data: null },
    text: "Manakah prediksi yang paling mungkin terjadi jika seseorang terus-menerus bekerja shift malam?",
    options: [
      "Adaptasi sempurna dalam 1 minggu", 
      "Risiko gangguan metabolisme meningkat", 
      "Ritme sirkadian hilang total", 
      "Kualitas tidur siang lebih baik", 
      "Tidak ada dampak signifikan"
    ],
    correctIndex: 1,
    explanation: "Bekerja melawan ritme sirkadian alami secara kronis meningkatkan risiko gangguan kesehatan."
  },
  {
    id: 4,
    stimulus: "Dalam logika matematika, implikasi $P \\rightarrow Q$ bernilai salah hanya jika $P$ benar dan $Q$ salah.",
    representation: { type: "text", data: null },
    text: "Jika pernyataan 'Semua siswa yang rajin belajar akan lulus ujian' bernilai SALAH, maka kesimpulan yang benar adalah...",
    options: [
      "Tidak ada siswa rajin yang lulus", 
      "Semua siswa malas akan lulus", 
      "Ada siswa yang rajin belajar tetapi tidak lulus", 
      "Ada siswa tidak rajin tetapi lulus", 
      "Semua siswa rajin tidak lulus"
    ],
    correctIndex: 2,
    explanation: "Implikasi salah hanya terjadi jika antecedent benar dan consequent salah."
  },
  {
    id: 5,
    stimulus: "Sistem persamaan linear dapat digunakan untuk memodelkan hubungan antara variabel ekonomi.",
    representation: {
      type: "system",
      data: {
        equations: [
          "2x + 3y = 100",
          "x + 2y = 65"
        ],
        variables: [
          { name: "x", desc: "Harga barang A" },
          { name: "y", desc: "Harga barang B" }
        ]
      }
    },
    text: "Jika x adalah harga barang A dan y adalah harga barang B, berapakah harga barang B?",
    options: ["15", "20", "25", "30", "35"],
    correctIndex: 2,
    explanation: "Dari sistem: x = 65 - 2y. Substitusi ke persamaan pertama: 2(65 - 2y) + 3y = 100 → 130 - 4y + 3y = 100 → y = 30"
  }
];

/**
 * Get random mock question
 * @returns {Object} Random question from MOCK_QUESTIONS
 */
export const getRandomMockQuestion = () => {
  const randomIndex = Math.floor(Math.random() * MOCK_QUESTIONS.length);
  return MOCK_QUESTIONS[randomIndex];
};

/**
 * Get multiple mock questions
 * @param {number} count - Number of questions to return
 * @returns {Array} Array of random mock questions
 */
export const getRandomMockQuestions = (count) => {
  const shuffled = [...MOCK_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, MOCK_QUESTIONS.length));
};
