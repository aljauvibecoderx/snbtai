/**
 * Quick Test Script untuk Learning Recommendation Engine
 * 
 * Jalankan di browser console untuk testing fungsi analisis
 */

// Mock data untuk testing
const mockAnswerHistory = [
  // PK - Aljabar: 4 benar, 6 salah (error rate 60%)
  { subtestName: 'Pengetahuan Kuantitatif', topicName: 'Aljabar', isCorrect: true },
  { subtestName: 'Pengetahuan Kuantitatif', topicName: 'Aljabar', isCorrect: false },
  { subtestName: 'Pengetahuan Kuantitatif', topicName: 'Aljabar', isCorrect: false },
  { subtestName: 'Pengetahuan Kuantitatif', topicName: 'Aljabar', isCorrect: true },
  { subtestName: 'Pengetahuan Kuantitatif', topicName: 'Aljabar', isCorrect: false },
  { subtestName: 'Pengetahuan Kuantitatif', topicName: 'Aljabar', isCorrect: true },
  { subtestName: 'Pengetahuan Kuantitatif', topicName: 'Aljabar', isCorrect: false },
  { subtestName: 'Pengetahuan Kuantitatif', topicName: 'Aljabar', isCorrect: false },
  { subtestName: 'Pengetahuan Kuantitatif', topicName: 'Aljabar', isCorrect: true },
  { subtestName: 'Pengetahuan Kuantitatif', topicName: 'Aljabar', isCorrect: false },
  
  // PK - Geometri: 12 benar, 3 salah (error rate 20%)
  ...Array(12).fill({ subtestName: 'Pengetahuan Kuantitatif', topicName: 'Geometri', isCorrect: true }),
  ...Array(3).fill({ subtestName: 'Pengetahuan Kuantitatif', topicName: 'Geometri', isCorrect: false }),
  
  // PU - Logika: 7 benar, 8 salah (error rate 53%)
  ...Array(7).fill({ subtestName: 'Penalaran Umum', topicName: 'Logika', isCorrect: true }),
  ...Array(8).fill({ subtestName: 'Penalaran Umum', topicName: 'Logika', isCorrect: false }),
  
  // LBI - Ejaan: 8 benar, 2 salah (error rate 20%)
  ...Array(8).fill({ subtestName: 'Literasi Bahasa Indonesia', topicName: 'Ejaan', isCorrect: true }),
  ...Array(2).fill({ subtestName: 'Literasi Bahasa Indonesia', topicName: 'Ejaan', isCorrect: false }),
];

// Fungsi analyzeLearningPerformance (copy dari learningRecommendationEngine.js)
function analyzeLearningPerformance(answerHistory) {
  if (!Array.isArray(answerHistory) || answerHistory.length === 0) {
    return {
      averageAccuracy: 0,
      totalPractice: 0,
      weakTopicsAnalysis: [],
      topicBreakdown: {}
    };
  }

  // STEP 1: Kelompokkan jawaban berdasarkan topik
  const topicStats = answerHistory.reduce((acc, answer) => {
    const topicKey = `${answer.subtestName}::${answer.topicName}`;
    
    if (!acc[topicKey]) {
      acc[topicKey] = {
        subtestName: answer.subtestName,
        topicName: answer.topicName,
        correct: 0,
        wrong: 0,
        total: 0
      };
    }
    
    acc[topicKey].total += 1;
    if (answer.isCorrect) {
      acc[topicKey].correct += 1;
    } else {
      acc[topicKey].wrong += 1;
    }
    
    return acc;
  }, {});

  // STEP 2: Hitung metrik per topik
  const topicMetrics = Object.values(topicStats).map(topic => {
    const accuracy = topic.total > 0 
      ? Math.round((topic.correct / topic.total) * 100) 
      : 0;
    const errorRate = topic.total > 0 
      ? Math.round((topic.wrong / topic.total) * 100) 
      : 0;
    
    return {
      ...topic,
      accuracy,
      errorRate
    };
  });

  // STEP 3: Rata-rata akurasi
  const totalAccuracy = topicMetrics.reduce((sum, topic) => sum + topic.accuracy, 0);
  const averageAccuracy = topicMetrics.length > 0 
    ? Math.round(totalAccuracy / topicMetrics.length) 
    : 0;

  // STEP 4: Total latihan
  const totalPractice = answerHistory.length;

  // STEP 5: Weak topics (error rate > 50%)
  const weakTopicsAnalysis = topicMetrics
    .filter(topic => topic.errorRate > 50)
    .sort((a, b) => b.errorRate - a.errorRate);

  return {
    averageAccuracy,
    totalPractice,
    weakTopicsAnalysis,
    topicBreakdown: topicMetrics
  };
}

// Jalankan test
console.log('🧪 Testing Learning Recommendation Engine\n');
console.log('='.repeat(60));

const result = analyzeLearningPerformance(mockAnswerHistory);

console.log('\n📊 HASIL ANALISIS:');
console.log('-'.repeat(60));
console.log(`1️⃣ Rata-rata Akurasi: ${result.averageAccuracy}%`);
console.log(`2️⃣ Total Latihan: ${result.totalPractice} soal`);
console.log(`3️⃣ Topik Lemah (Error Rate > 50%): ${result.weakTopicsAnalysis.length} topik`);

console.log('\n📉 DAFTAR TOPIK LEMAH (Sorted descending):');
console.log('-'.repeat(60));
result.weakTopicsAnalysis.forEach((topic, index) => {
  console.log(`${index + 1}. ${topic.topicName}`);
  console.log(`   Subtest: ${topic.subtestName}`);
  console.log(`   Error Rate: ${topic.errorRate}%`);
  console.log(`   Akurasi: ${topic.accuracy}%`);
  console.log(`   Benar: ${topic.correct}, Salah: ${topic.wrong}, Total: ${topic.total}`);
  console.log('');
});

console.log('\n📋 DETAIL SEMUA TOPIK:');
console.log('-'.repeat(60));
result.topicBreakdown.forEach(topic => {
  const status = topic.errorRate > 50 ? '⚠️' : topic.errorRate > 30 ? '🟡' : '✅';
  console.log(`${status} ${topic.topicName} (${topic.subtestName})`);
  console.log(`   Akurasi: ${topic.accuracy}% | Error: ${topic.errorRate}% (${topic.correct}/${topic.total})`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ TEST COMPLETED\n');

// Validasi hasil
console.log('🔍 VALIDASI:');
console.log('-'.repeat(60));
const validations = [
  { name: 'Total practice = 30', pass: result.totalPractice === 30 },
  { name: 'Weak topics count = 2', pass: result.weakTopicsAnalysis.length === 2 },
  { name: 'Average accuracy around 60%', pass: result.averageAccuracy >= 55 && result.averageAccuracy <= 65 },
  { name: 'Aljabar error rate > 50%', pass: result.weakTopicsAnalysis.some(t => t.topicName === 'Aljabar' && t.errorRate > 50) },
  { name: 'Logika error rate > 50%', pass: result.weakTopicsAnalysis.some(t => t.topicName === 'Logika' && t.errorRate > 50) }
];

validations.forEach((test, i) => {
  console.log(`${test.pass ? '✅' : '❌'} ${i + 1}. ${test.name}`);
});

console.log('='.repeat(60));
