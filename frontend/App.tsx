import React from 'react';
import { useSnake } from './hooks/useSnake';
import { SnakeBoard } from './components/SnakeBoard';
import { MusicPlayer } from './components/MusicPlayer';

const App: React.FC = () => {
  const {
    snake,
    food,
    score,
    gameOver,
    isPaused,
    hasStarted,
    resetGame,
    togglePause
  } = useSnake();

  return (
    <div className="min-h-screen bg-neon-black text-neon-cyan flex flex-col relative z-10">
      
      {/* Header */}
      <header className="p-4 border-b-2 border-neon-magenta flex justify-between items-end bg-neon-black/90 backdrop-blur-sm">
        <div>
          <h1 
            className="text-4xl md:text-6xl font-bold tracking-widest uppercase glitch-text" 
            data-text="SYS.TERMINAL"
          >
            SYS.TERMINAL
          </h1>
          <p className="text-neon-magenta text-xl mt-1 tracking-widest animate-flicker">
            // PROTOCOL: SNAKE_AUDIO_LINK
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-neon-cyan/50 text-lg">NODE: ACTIVE</p>
          <p className="text-neon-magenta/50 text-lg">UPLINK: ESTABLISHED</p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-8 overflow-y-auto">
        
        {/* Game Section */}
        <div className="w-full max-w-2xl flex-1 flex items-center justify-center">
          <SnakeBoard 
            snake={snake}
            food={food}
            score={score}
            gameOver={gameOver}
            isPaused={isPaused}
            hasStarted={hasStarted}
            onStart={resetGame}
            onPause={togglePause}
          />
        </div>

        {/* Music Player Section */}
        <div className="w-full max-w-3xl mt-auto">
          <MusicPlayer />
        </div>

      </main>
      
      {/* Footer */}
      <footer className="p-2 border-t border-neon-cyan/30 text-center text-neon-cyan/50 text-sm">
        <span className="animate-pulse">_</span> AWAITING_INPUT
      </footer>
    </div>
  );
};

export default App;
