import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Global audio element to persist across component unmounts/remounts
const globalAudio = new Audio();
globalAudio.loop = true;

const SeamlessAudioPlayer = ({ src, shouldPlay }) => {
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    const audio = globalAudio;

    // Only set src if it changed
    if (audio.src !== src) {
      audio.src = src;
      audio.load();
    }

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (shouldPlay && !isMuted) {
        audio.play().catch(() => {});
      }
    };

    const handleEnded = () => {
      // Loop is enabled, but just in case
      if (audio.loop) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    // If already loaded from previous render
    if (audio.readyState >= 2) {
      setIsLoaded(true);
    }

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  // Handle play/pause based on shouldPlay prop
  useEffect(() => {
    const audio = globalAudio;
    
    if (shouldPlay && !isMuted && audio.readyState >= 2) {
      audio.play().catch(() => {});
    } else if (!shouldPlay && !audio.paused) {
      audio.pause();
    }
  }, [shouldPlay, isMuted]);

  // Handle volume changes
  useEffect(() => {
    globalAudio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    if (newMuted) {
      globalAudio.pause();
    } else if (shouldPlay) {
      globalAudio.play().catch(() => {});
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-2 py-1.5 shadow-sm">
      <button
        onClick={toggleMute}
        className="text-slate-500 hover:text-slate-700 transition-colors p-1"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={isMuted ? 0 : volume}
        onChange={handleVolumeChange}
        className="w-16 h-1 bg-slate-200 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${(isMuted ? 0 : volume) * 100}%, #e2e8f0 ${(isMuted ? 0 : volume) * 100}%, #e2e8f0 100%)`
        }}
      />
    </div>
  );
};

export default SeamlessAudioPlayer;
