import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal } from 'lucide-react';
import { PLAYLIST } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = PLAYLIST[currentTrackIndex];

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Playback failed:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Auto-play failed:", err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, currentTrack.url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Raw blocky visualizer
  const visualizerBars = Array.from({ length: 16 }).map((_, i) => {
    const height = isPlaying ? Math.random() * 100 : 5;
    return (
      <div
        key={i}
        className="w-2 bg-neon-magenta transition-all duration-75"
        style={{ height: `${height}%` }}
      />
    );
  });

  return (
    <div className="w-full border-2 border-neon-magenta bg-neon-black p-4 relative">
      
      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-neon-cyan -translate-x-1 -translate-y-1" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-neon-cyan translate-x-1 translate-y-1" />

      <audio ref={audioRef} preload="metadata" />

      <div className="flex flex-col md:flex-row items-center gap-4">
        
        {/* Track Info */}
        <div className="flex-1 flex items-center gap-4 w-full border border-neon-cyan/30 p-2 bg-neon-cyan/5">
          <div className="w-12 h-12 bg-neon-black border-2 border-neon-cyan flex items-center justify-center shrink-0">
            <Terminal className={`text-neon-cyan ${isPlaying ? 'animate-flicker' : ''}`} size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-neon-magenta text-sm mb-1">AUDIO_STREAM_ACTIVE</div>
            <h3 className="text-neon-cyan text-2xl truncate uppercase">
              {currentTrack.title}
            </h3>
            <p className="text-neon-cyan/60 text-lg truncate">
              SRC: {currentTrack.artist}
            </p>
          </div>
          
          {/* Visualizer */}
          <div className="hidden sm:flex h-12 items-end gap-1 w-40 shrink-0 border-b-2 border-neon-magenta px-1">
            {visualizerBars}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center w-full md:w-auto gap-2">
          <div className="flex items-center gap-4 bg-neon-black border border-neon-magenta p-2">
            <button 
              tabIndex={-1}
              onClick={(e) => {
                playPrev();
                e.currentTarget.blur();
              }}
              className="text-neon-cyan hover:text-neon-magenta hover:animate-glitch-shift focus:outline-none"
            >
              <SkipBack size={32} />
            </button>
            
            <button 
              tabIndex={-1}
              onClick={(e) => {
                togglePlayPause();
                e.currentTarget.blur();
              }}
              className="w-12 h-12 flex items-center justify-center bg-neon-cyan text-neon-black hover:bg-neon-magenta hover:text-neon-cyan transition-none focus:outline-none"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            
            <button 
              tabIndex={-1}
              onClick={(e) => {
                playNext();
                e.currentTarget.blur();
              }}
              className="text-neon-cyan hover:text-neon-magenta hover:animate-glitch-shift focus:outline-none"
            >
              <SkipForward size={32} />
            </button>
          </div>
        </div>

        {/* Volume Control */}
        <div className="hidden md:flex items-center gap-2 w-40 shrink-0 border border-neon-cyan p-2">
          <button 
            tabIndex={-1}
            onClick={(e) => {
              setIsMuted(!isMuted);
              e.currentTarget.blur();
            }}
            className="text-neon-magenta hover:text-neon-cyan focus:outline-none"
          >
            {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-full h-2 bg-neon-black border border-neon-magenta appearance-none cursor-pointer accent-neon-cyan"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 flex items-center gap-4 text-xl text-neon-cyan">
        <span className="w-16 text-right">{formatTime(audioRef.current?.currentTime || 0)}</span>
        <div className="flex-1 relative group h-4 border border-neon-cyan bg-neon-black">
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleProgressChange}
            className="w-full h-full appearance-none cursor-pointer absolute inset-0 z-20 opacity-0"
          />
          {/* Custom Progress Track */}
          <div className="w-full h-full overflow-hidden pointer-events-none">
            <div 
              className="h-full bg-neon-magenta transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="w-16">{currentTrack.duration}</span>
      </div>
    </div>
  );
};
