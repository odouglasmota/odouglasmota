
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("User interaction required for audio"));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <audio 
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" 
        loop
      />
      <div className={`transition-all duration-300 flex items-center bg-zinc-900/80 backdrop-blur-md border border-yellow-500/30 rounded-full px-4 py-2 ${isPlaying ? 'opacity-100' : 'opacity-60'}`}>
        {isPlaying && (
          <div className="flex gap-1 mr-3">
            <div className="w-1 h-3 bg-yellow-500 animate-bounce"></div>
            <div className="w-1 h-4 bg-yellow-500 animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1 h-2 bg-yellow-500 animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
        <button 
          onClick={togglePlay}
          className="text-yellow-500 hover:text-yellow-400 transition-colors"
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
