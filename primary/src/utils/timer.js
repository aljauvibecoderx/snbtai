/**
 * Timer utilities for exam and quiz functionality
 * SNBT AI - Competition
 */

/**
 * Format seconds into MM:SS display format
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format seconds into HH:MM:SS display format
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 */
export const formatTimeWithHours = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return formatTime(seconds);
};

/**
 * Get remaining time in a human-readable format
 * @param {number} totalSeconds - Total time in seconds
 * @param {number} elapsedSeconds - Elapsed time in seconds
 * @returns {string} Remaining time string
 */
export const getRemainingTime = (totalSeconds, elapsedSeconds) => {
  const remaining = Math.max(0, totalSeconds - elapsedSeconds);
  return formatTime(remaining);
};

/**
 * Check if time is running out (less than 5 minutes)
 * @param {number} totalSeconds - Total time in seconds
 * @param {number} elapsedSeconds - Elapsed time in seconds
 * @returns {boolean} Whether time is running out
 */
export const isTimeRunningOut = (totalSeconds, elapsedSeconds) => {
  const remaining = totalSeconds - elapsedSeconds;
  return remaining > 0 && remaining <= 300;
};

/**
 * Calculate time percentage
 * @param {number} elapsedSeconds - Elapsed time in seconds
 * @param {number} totalSeconds - Total time in seconds
 * @returns {number} Percentage (0-100)
 */
export const getTimePercentage = (elapsedSeconds, totalSeconds) => {
  if (totalSeconds === 0) return 0;
  return Math.min(100, (elapsedSeconds / totalSeconds) * 100);
};

/**
 * Timer class for managing countdown timers
 */
export class CountdownTimer {
  constructor(duration, onTick, onComplete) {
    this.duration = duration;
    this.remaining = duration;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.intervalId = null;
    this.startTime = null;
  }

  start() {
    if (this.intervalId) return;
    
    this.startTime = Date.now();
    this.intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.remaining = Math.max(0, this.duration - elapsed);
      
      if (this.onTick) {
        this.onTick(this.remaining, elapsed);
      }
      
      if (this.remaining === 0) {
        this.stop();
        if (this.onComplete) {
          this.onComplete();
        }
      }
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  pause() {
    this.stop();
  }

  resume() {
    if (!this.intervalId && this.remaining > 0) {
      this.duration = this.remaining;
      this.start();
    }
  }

  reset() {
    this.stop();
    this.remaining = this.duration;
    this.startTime = null;
  }

  getFormattedTime() {
    return formatTime(this.remaining);
  }

  isRunning() {
    return this.intervalId !== null;
  }
}

export default { formatTime, formatTimeWithHours, getRemainingTime, isTimeRunningOut, getTimePercentage, CountdownTimer };
