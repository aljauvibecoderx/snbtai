/**
 * Sound effects utilities for the application
 * SNBT AI - Competition
 */

let audioContext = null;

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

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

export const playSuccessSound = () => {
  playBeep(523, 150);
  setTimeout(() => playBeep(659, 150), 100);
};

export const playErrorSound = () => {
  playBeep(200, 300);
};

export const playClickSound = () => {
  playBeep(800, 50);
};

export const playTimerTick = () => {
  playBeep(1000, 30);
};

export const playCompletionSound = () => {
  playBeep(523, 100);
  setTimeout(() => playBeep(659, 100), 100);
  setTimeout(() => playBeep(784, 200), 200);
};

export const setMuted = (muted) => {
  if (audioContext) {
    audioContext.destination.gain.value = muted ? 0 : 1;
  }
};

export default { playBeep, playSuccessSound, playErrorSound, playClickSound, playTimerTick, playCompletionSound, setMuted };
