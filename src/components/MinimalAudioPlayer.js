import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const MinimalAudioPlayer = ({ src, autoPlay = true }) => {
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (autoPlay && !isMuted) {
        audio.play().catch(() => {});
      }
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    return () => audio.removeEventListener('loadeddata', handleLoadedData);
  }, [autoPlay, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-2 py-1.5 shadow-sm">
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
      />

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
          background: `linear-gradient(to right, #7c3aed 0%, #7c3aad ${(isMuted ? 0 : volume) * 100}%, #e2e8f0 ${(isMuted ? 0 : volume) * 100}%, #e2e8f0 100%)`
        }}
      />
    </div>
  );
};

export default MinimalAudioPlayer;
