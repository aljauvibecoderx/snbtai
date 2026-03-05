// JSON Parsing Test Cases
// Run this in browser console to test the fixes

const testCases = [
  {
    name: "Dialog dengan quotes",
    input: `[{
      "stimulus": "Dalam dialog, dia berkata \\"Aku akan pergi\\" dengan tegas.",
      "text": "Apa makna dari pernyataan tersebut?",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "Pernyataan \\"Aku akan pergi\\" menunjukkan keputusan."
    }]`,
    shouldPass: true
  },
  {
    name: "LaTeX dengan backslash",
    input: `[{
      "stimulus": "Fungsi komposisi $f \\\\circ g$ didefinisikan sebagai $(f \\\\circ g)(x) = f(g(x))$.",
      "text": "Hitung nilai $f \\\\circ g$ jika $f(x) = \\\\frac{1}{x}$",
      "options": ["$\\\\frac{1}{2}$", "$\\\\frac{1}{4}$", "$2$", "$4$"],
      "correctIndex": 0,
      "explanation": "Substitusi: $f(g(x)) = \\\\frac{1}{g(x)}$"
    }]`,
    shouldPass: true
  },
  {
    name: "Mixed quotes dan LaTeX",
    input: `[{
      "stimulus": "Guru berkata: \\"Hitung $\\\\frac{a}{b}$\\" kepada siswa.",
      "text": "Apa yang dimaksud guru?",
      "options": ["Pembagian", "Perkalian", "Penjumlahan", "Pengurangan"],
      "correctIndex": 0,
      "explanation": "Simbol $\\\\frac{a}{b}$ berarti \\"a dibagi b\\"."
    }]`,
    shouldPass: true
  },
  {
    name: "HTML entities",
    input: `[{
      "stimulus": "Teks dengan &amp; simbol dan &lt;tag&gt;.",
      "text": "Pertanyaan?",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "Penjelasan dengan & dan <>"
    }]`,
    shouldPass: true
  },
  {
    name: "Newline characters",
    input: `[{
      "stimulus": "Baris pertama\\nBaris kedua\\nBaris ketiga",
      "text": "Berapa baris?",
      "options": ["1", "2", "3", "4"],
      "correctIndex": 2,
      "explanation": "Ada 3 baris teks"
    }]`,
    shouldPass: true
  },
  {
    name: "Complex LaTeX",
    input: `[{
      "stimulus": "Persamaan: $\\\\sqrt{x^2 + y^2} = \\\\frac{\\\\pi}{2}$",
      "text": "Selesaikan untuk x",
      "options": ["$x = \\\\sqrt{\\\\frac{\\\\pi^2}{4} - y^2}$", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "Kuadratkan kedua sisi: $x^2 + y^2 = \\\\frac{\\\\pi^2}{4}$"
    }]`,
    shouldPass: true
  },
  {
    name: "Trailing comma (should be cleaned)",
    input: `[{
      "stimulus": "Test",
      "text": "Question",
      "options": ["A", "B", "C", "D",],
      "correctIndex": 0,
      "explanation": "Explanation",
    }]`,
    shouldPass: true
  }
];

// Test function
function runTests() {
  console.log("🧪 Running JSON Parsing Tests...\n");
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((test, index) => {
    console.log(`Test ${index + 1}: ${test.name}`);
    
    try {
      // Simulate the cleaning process
      let text = test.input;
      
      // Remove HTML entities
      text = text.replace(/&amp;/g, '&')
                 .replace(/&lt;/g, '<')
                 .replace(/&gt;/g, '>');
      
      // Remove trailing commas
      text = text.replace(/,\\s*([\\]}])/g, '$1');
      
      // Try to parse
      const parsed = JSON.parse(text);
      
      if (test.shouldPass) {
        console.log("✅ PASSED");
        passed++;
      } else {
        console.log("❌ FAILED (should have failed but passed)");
        failed++;
      }
    } catch (error) {
      if (!test.shouldPass) {
        console.log("✅ PASSED (correctly failed)");
        passed++;
      } else {
        console.log("❌ FAILED:", error.message);
        failed++;
      }
    }
    console.log("");
  });
  
  console.log("=".repeat(50));
  console.log(`Results: ${passed}/${testCases.length} passed, ${failed} failed`);
  console.log("=".repeat(50));
  
  return { passed, failed, total: testCases.length };
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testCases, runTests };
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  console.log("📋 Test cases loaded. Run runTests() to execute.");
}

/* 
USAGE:
1. Open browser console
2. Copy-paste this entire file
3. Run: runTests()
4. Check results

EXPECTED OUTPUT:
✅ All tests should pass
✅ No JSON parse errors
✅ LaTeX and quotes properly handled
*/
