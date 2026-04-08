import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

const AudioPlayer = ({ src, autoPlay = false, showControls = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef(null);
  const previousVolumeRef = useRef(0.3);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (autoPlay) {
        audio.play().catch(err => {
          console.log('Auto-play prevented:', err);
        });
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    const handleVolumeChange = () => {
      const currentVolume = audio.volume;
      setVolume(currentVolume);
      setIsMuted(currentVolume === 0);
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('volumechange', handleVolumeChange);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [autoPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.log('Play failed:', err);
      });
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    previousVolumeRef.current = newVolume;
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = previousVolumeRef.current;
      setVolume(previousVolumeRef.current);
      setIsMuted(false);
    } else {
      previousVolumeRef.current = volume;
      audio.volume = 0;
      setVolume(0);
      setIsMuted(true);
    }
  };

  if (!showControls) {
    return (
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
      />
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
      />

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          disabled={!isLoaded}
          className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isLoaded ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={16} />
          ) : (
            <Play size={16} />
          )}
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={toggleMute}
            className="text-slate-600 hover:text-slate-800 transition-colors"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            style={{
              background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${volume * 100}%, #e2e8f0 ${volume * 100}%, #e2e8f0 100%)`
            }}
          />
          
          <span className="text-xs text-slate-600 font-medium min-w-[3ch] text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Status */}
      {!isLoaded && (
        <div className="mt-2 text-xs text-slate-500 text-center">
          Loading soundtrack...
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
