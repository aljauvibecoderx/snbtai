// IRT (Item Response Theory) Scoring Engine
// Based on 3-Parameter Logistic Model
// SNBT AI - Competition

export class IRTScoring {
  
  // Calculate probability of correct answer using 3PL model
  static probability(theta, a, b, c = 0.25) {
    const exponent = -a * (theta - b);
    return c + (1 - c) / (1 + Math.exp(exponent));
  }
  
  // Estimate theta (ability) using Maximum Likelihood Estimation
  static estimateTheta(responses, questions) {
    let theta = 0;
    const maxIterations = 20;
    const tolerance = 0.001;
    
    for (let iter = 0; iter < maxIterations; iter++) {
      let numerator = 0;
      let denominator = 0;
      
      responses.forEach((isCorrect, idx) => {
        const q = questions[idx];
        const a = q.irt?.discrimination || 1;
        const b = q.irt?.difficulty || 0;
        const c = q.irt?.guessing || 0.25;
        
        const p = this.probability(theta, a, b, c);
        const w = a * (p - c) / (1 - c);
        
        numerator += w * (isCorrect - p);
        denominator += w * w * p * (1 - p);
      });
      
      if (denominator === 0) break;
      
      const delta = numerator / denominator;
      theta += delta;
      
      if (Math.abs(delta) < tolerance) break;
    }
    
    return theta;
  }
  
  // Convert theta to scaled score (200-800, mean=500, SD=100)
  static thetaToScaledScore(theta) {
    const mean = 500;
    const sd = 100;
    const score = Math.round(mean + (theta * sd));
    return Math.max(200, Math.min(800, score));
  }
  
  // Calculate percentile rank
  static calculatePercentile(score, allScores) {
    if (allScores.length === 0) return 50;
    const sorted = allScores.sort((a, b) => a - b);
    const rank = sorted.filter(s => s < score).length;
    return Math.round((rank / sorted.length) * 100);
  }
  
  // Main scoring function
  static calculateIRTScore(userAnswers, questions) {
    const responses = questions.map((q, idx) => 
      userAnswers[idx] === q.correctIndex ? 1 : 0
    );
    
    const theta = this.estimateTheta(responses, questions);
    const irtScore = this.thetaToScaledScore(theta);
    const rawScore = responses.filter(r => r === 1).length;
    
    return {
      irtScore,
      rawScore,
      theta,
      totalQuestions: questions.length
    };
  }
  
  // Get interpretation based on IRT score
  static getInterpretation(score) {
    if (score >= 700) return { level: 'Exceptional', description: 'Top 5%', color: 'purple' };
    if (score >= 600) return { level: 'Excellent', description: 'Top 20%', color: 'indigo' };
    if (score >= 500) return { level: 'Good', description: 'Average', color: 'teal' };
    if (score >= 400) return { level: 'Fair', description: 'Below Average', color: 'amber' };
    return { level: 'Needs Improvement', description: 'Bottom 20%', color: 'rose' };
  }
}

// Auto-calibrate IRT parameters from historical data
export const calibrateQuestionIRT = (correctRate) => {
  if (correctRate === null || correctRate === undefined) {
    return { difficulty: 0, discrimination: 1, guessing: 0.25 };
  }
  
  const difficulty = correctRate > 0 && correctRate < 1
    ? -Math.log(correctRate / (1 - correctRate))
    : 0;
  
  const discrimination = Math.min(2, Math.max(0.5, 
    1 + (0.5 - Math.abs(correctRate - 0.5)) * 2
  ));
  
  return {
    difficulty: Math.max(-3, Math.min(3, difficulty)),
    discrimination,
    guessing: 0.25
  };
};

export default IRTScoring;
