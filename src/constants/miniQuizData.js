/**
 * Mini quiz data for quick practice sessions
 * Used in the loading quiz feature
 */
export const MINI_QUIZ_DATA = [
  { q: "2, 4, 8, 16, ...?", options: ["24", "30", "32", "64"], correctIndex: 2 },
  { q: "Ibukota masa depan Indonesia?", options: ["Jakarta", "Nusantara", "Surabaya", "Bandung"], correctIndex: 1 },
  { q: "Lawan kata 'Efisien'?", options: ["Hemat", "Boros", "Cepat", "Lambat"], correctIndex: 1 },
  { q: "7 × 8 = ...?", options: ["54", "56", "58", "64"], correctIndex: 1 },
  { q: "Campuran Biru + Kuning?", options: ["Hijau", "Ungu", "Oranye", "Merah"], correctIndex: 0 },
  { q: "Planet terdekat dengan Matahari?", options: ["Venus", "Mars", "Merkurius", "Bumi"], correctIndex: 2 },
  { q: "1 + 2 + 3 + 4 + 5 = ...?", options: ["12", "15", "18", "20"], correctIndex: 1 },
  { q: "Ibu kota Jepang?", options: ["Seoul", "Beijing", "Tokyo", "Bangkok"], correctIndex: 2 },
  { q: "Akar dari 144?", options: ["10", "11", "12", "14"], correctIndex: 2 },
  { q: "Sinonim 'Cerdas'?", options: ["Bodoh", "Pintar", "Malas", "Rajin"], correctIndex: 1 },
  { q: "50% dari 200?", options: ["50", "75", "100", "150"], correctIndex: 2 },
  { q: "Benua terbesar di dunia?", options: ["Afrika", "Amerika", "Asia", "Eropa"], correctIndex: 2 },
  { q: "3² + 4² = ...?", options: ["12", "25", "49", "64"], correctIndex: 1 },
  { q: "Lawan kata 'Gelap'?", options: ["Terang", "Suram", "Redup", "Buram"], correctIndex: 0 },
  { q: "Jumlah hari dalam 1 tahun kabisat?", options: ["364", "365", "366", "367"], correctIndex: 2 }
];

/**
 * Get random mini quiz question
 * @returns {Object} Random question from MINI_QUIZ_DATA
 */
export const getRandomMiniQuiz = () => {
  const randomIndex = Math.floor(Math.random() * MINI_QUIZ_DATA.length);
  return MINI_QUIZ_DATA[randomIndex];
};
