/**
 * Sound effects utilities for the application
 * Provides functions for playing various UI sounds
 */

// Audio context for sound effects
let audioContext = null;

/**
 * Initialize audio context
 */
const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Play a simple beep sound
 * @param {number} frequency - Frequency in Hz (default: 440)
 * @param {number} duration - Duration in milliseconds (default: 200)
 */
export const playBeep = (frequency = 440, duration = 200) => {
  try {
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  } catch (error) {
    console.log('Audio playback not supported');
  }
};

/**
 * Play success sound
 */
export const playSuccessSound = () => {
  playBeep(523, 150); // C5 note
  setTimeout(() => playBeep(659, 150), 100); // E5 note
};

/**
 * Play error sound
 */
export const playErrorSound = () => {
  playBeep(200, 300); // Low frequency
};

/**
 * Play click sound
 */
export const playClickSound = () => {
  playBeep(800, 50); // High frequency, short duration
};

/**
 * Play timer tick sound
 */
export const playTimerTick = () => {
  playBeep(1000, 30); // Very high frequency, very short
};

/**
 * Play completion sound
 */
export const playCompletionSound = () => {
  playBeep(523, 100); // C5
  setTimeout(() => playBeep(659, 100), 100); // E5
  setTimeout(() => playBeep(784, 200), 200); // G5
};

/**
 * Mute/unmute all sounds
 * @param {boolean} muted - Whether to mute sounds
 */
export const setMuted = (muted) => {
  if (audioContext) {
    audioContext.destination.gain.value = muted ? 0 : 1;
  }
};
