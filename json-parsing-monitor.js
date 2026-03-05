// JSON Parsing Error Monitoring & Analytics
// Add this to your App.js or create separate monitoring service

class JSONParsingMonitor {
  constructor() {
    this.stats = this.loadStats();
    this.sessionErrors = [];
  }

  loadStats() {
    const stored = localStorage.getItem('json_parsing_stats');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      totalAttempts: 0,
      successfulParses: 0,
      failedParses: 0,
      recoveredParses: 0,
      errorTypes: {},
      errorPatterns: {},
      lastReset: new Date().toISOString(),
      dailyStats: {}
    };
  }

  saveStats() {
    localStorage.setItem('json_parsing_stats', JSON.stringify(this.stats));
  }

  recordAttempt(success, error = null, recovered = false) {
    const today = new Date().toISOString().split('T')[0];
    
    // Initialize daily stats if needed
    if (!this.stats.dailyStats[today]) {
      this.stats.dailyStats[today] = {
        attempts: 0,
        success: 0,
        failed: 0,
        recovered: 0
      };
    }

    // Update stats
    this.stats.totalAttempts++;
    this.stats.dailyStats[today].attempts++;

    if (success) {
      this.stats.successfulParses++;
      this.stats.dailyStats[today].success++;
    } else {
      this.stats.failedParses++;
      this.stats.dailyStats[today].failed++;
      
      if (error) {
        // Track error type
        const errorType = error.name || 'Unknown';
        this.stats.errorTypes[errorType] = (this.stats.errorTypes[errorType] || 0) + 1;
        
        // Track error pattern
        const pattern = this.identifyErrorPattern(error.message);
        this.stats.errorPatterns[pattern] = (this.stats.errorPatterns[pattern] || 0) + 1;
        
        // Store session error
        this.sessionErrors.push({
          timestamp: new Date().toISOString(),
          type: errorType,
          pattern: pattern,
          message: error.message
        });
      }
    }

    if (recovered) {
      this.stats.recoveredParses++;
      this.stats.dailyStats[today].recovered++;
    }

    this.saveStats();
  }

  identifyErrorPattern(message) {
    if (message.includes('Unexpected token')) {
      if (message.includes('"')) return 'unescaped_quotes';
      if (message.includes('\\')) return 'backslash_issue';
      return 'unexpected_token';
    }
    if (message.includes('Bad escaped character')) return 'bad_escape';
    if (message.includes('Unexpected end')) return 'incomplete_json';
    if (message.includes('position')) return 'syntax_error';
    return 'unknown';
  }

  getErrorRate() {
    if (this.stats.totalAttempts === 0) return 0;
    return ((this.stats.failedParses / this.stats.totalAttempts) * 100).toFixed(2);
  }

  getRecoveryRate() {
    if (this.stats.failedParses === 0) return 0;
    return ((this.stats.recoveredParses / this.stats.failedParses) * 100).toFixed(2);
  }

  getSuccessRate() {
    if (this.stats.totalAttempts === 0) return 0;
    return ((this.stats.successfulParses / this.stats.totalAttempts) * 100).toFixed(2);
  }

  getDailyReport(date = null) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.stats.dailyStats[targetDate] || null;
  }

  getTopErrors(limit = 5) {
    return Object.entries(this.stats.errorPatterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([pattern, count]) => ({ pattern, count }));
  }

  generateReport() {
    const report = {
      summary: {
        totalAttempts: this.stats.totalAttempts,
        successRate: this.getSuccessRate() + '%',
        errorRate: this.getErrorRate() + '%',
        recoveryRate: this.getRecoveryRate() + '%'
      },
      topErrors: this.getTopErrors(),
      recentErrors: this.sessionErrors.slice(-10),
      dailyStats: this.stats.dailyStats
    };

    return report;
  }

  printReport() {
    const report = this.generateReport();
    
    console.log('═══════════════════════════════════════════');
    console.log('📊 JSON PARSING MONITORING REPORT');
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('📈 SUMMARY:');
    console.log(`   Total Attempts: ${report.summary.totalAttempts}`);
    console.log(`   Success Rate: ${report.summary.successRate}`);
    console.log(`   Error Rate: ${report.summary.errorRate}`);
    console.log(`   Recovery Rate: ${report.summary.recoveryRate}`);
    console.log('');
    console.log('🔥 TOP ERROR PATTERNS:');
    report.topErrors.forEach((error, i) => {
      console.log(`   ${i + 1}. ${error.pattern}: ${error.count} times`);
    });
    console.log('');
    console.log('🕐 RECENT ERRORS:');
    report.recentErrors.forEach((error, i) => {
      console.log(`   ${i + 1}. [${error.timestamp}] ${error.pattern}: ${error.message.substring(0, 50)}...`);
    });
    console.log('');
    console.log('═══════════════════════════════════════════');
  }

  reset() {
    this.stats = {
      totalAttempts: 0,
      successfulParses: 0,
      failedParses: 0,
      recoveredParses: 0,
      errorTypes: {},
      errorPatterns: {},
      lastReset: new Date().toISOString(),
      dailyStats: {}
    };
    this.sessionErrors = [];
    this.saveStats();
    console.log('✅ Monitoring stats reset');
  }

  exportData() {
    const data = {
      stats: this.stats,
      sessionErrors: this.sessionErrors,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `json-parsing-stats-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('✅ Stats exported');
  }
}

// Usage Example:
/*
// Initialize monitor
const monitor = new JSONParsingMonitor();

// In your generateQuestions function:
try {
  const parsed = JSON.parse(text);
  monitor.recordAttempt(true);
  return parsed;
} catch (parseError) {
  monitor.recordAttempt(false, parseError);
  
  // Try recovery
  try {
    const cleanText = cleanJSON(text);
    const retryParsed = JSON.parse(cleanText);
    monitor.recordAttempt(true, null, true);
    return retryParsed;
  } catch (retryError) {
    monitor.recordAttempt(false, retryError);
    return MOCK_QUESTIONS;
  }
}

// View report in console:
monitor.printReport();

// Export data:
monitor.exportData();

// Reset stats:
monitor.reset();
*/

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  window.JSONParsingMonitor = JSONParsingMonitor;
  console.log('📊 JSON Parsing Monitor loaded. Use: new JSONParsingMonitor()');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JSONParsingMonitor;
}

/* 
DASHBOARD METRICS TO TRACK:

1. Real-time Metrics:
   - Current error rate
   - Success rate today
   - Recovery rate
   - Active errors

2. Historical Trends:
   - Error rate over time
   - Most common error patterns
   - Peak error times
   - Recovery success trends

3. Alerts:
   - Error rate > 10%
   - Recovery rate < 80%
   - New error pattern detected
   - Sudden spike in errors

4. Actions:
   - Export error logs
   - Reset statistics
   - View detailed reports
   - Download analytics
*/
