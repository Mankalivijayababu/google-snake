import React from 'react';
import { Point } from '../types';
import { GRID_SIZE } from '../constants';
import { Play, RotateCcw, Pause, AlertTriangle } from 'lucide-react';

interface SnakeBoardProps {
  snake: Point[];
  food: Point;
  score: number;
  gameOver: boolean;
  isPaused: boolean;
  hasStarted: boolean;
  onStart: () => void;
  onPause: () => void;
}

export const SnakeBoard: React.FC<SnakeBoardProps> = ({
  snake,
  food,
  score,
  gameOver,
  isPaused,
  hasStarted,
  onStart,
  onPause
}) => {
  const grid = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => 0));

  return (
    <div className="flex flex-col items-center justify-center w-full">
      
      {/* Status Bar */}
      <div className="flex justify-between items-center w-full max-w-[500px] mb-2 px-2 py-1 border-2 border-neon-cyan bg-neon-black text-2xl">
        <div className="flex items-center gap-2">
          <span className="text-neon-magenta">YIELD:</span>
          <span className="text-neon-cyan">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex gap-4">
           <button 
            tabIndex={-1}
            onClick={(e) => {
              if (hasStarted && !gameOver) onPause();
              else onStart();
              e.currentTarget.blur();
            }}
            className="text-neon-cyan hover:text-neon-magenta hover:animate-glitch-shift transition-none focus:outline-none"
            title={!hasStarted ? "EXECUTE" : isPaused ? "RESUME" : "HALT"}
          >
            {!hasStarted || gameOver ? <Play size={28} /> : isPaused ? <Play size={28} /> : <Pause size={28} />}
          </button>
          <button 
            tabIndex={-1}
            onClick={(e) => {
              onStart();
              e.currentTarget.blur();
            }}
            className="text-neon-cyan hover:text-neon-magenta hover:animate-glitch-shift transition-none focus:outline-none"
            title="REBOOT"
          >
            <RotateCcw size={28} />
          </button>
        </div>
      </div>

      {/* Game Board Container */}
      <div className={`relative aspect-square w-full max-w-[500px] bg-neon-black border-4 ${gameOver ? 'border-neon-magenta animate-flicker' : 'border-neon-cyan'} shadow-[0_0_15px_#0ff_inset]`}>
        
        {/* Grid Background Pattern (Raw) */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #0ff 1px, transparent 1px), linear-gradient(to bottom, #0ff 1px, transparent 1px)`,
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* The Grid */}
        <div 
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {grid.map((row, y) =>
            row.map((_, x) => {
              const isSnakeHead = snake[0].x === x && snake[0].y === y;
              const isSnakeBody = snake.some((segment, index) => index !== 0 && segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;

              return (
                <div key={`${x}-${y}`} className="w-full h-full flex items-center justify-center">
                  {isSnakeHead && (
                    <div className="w-full h-full bg-neon-cyan border border-neon-black z-20" />
                  )}
                  {isSnakeBody && (
                    <div className="w-full h-full bg-neon-cyan/70 border border-neon-black z-10" />
                  )}
                  {isFood && (
                    <div className="w-full h-full bg-neon-magenta animate-pulse-fast z-10" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-neon-black/80 flex flex-col items-center justify-center z-30 border-4 border-neon-cyan m-4">
            <h2 className="text-5xl text-neon-cyan mb-4 glitch-text" data-text="INIT_SEQ">INIT_SEQ</h2>
            <p className="text-neon-magenta text-2xl text-center px-4 mb-6">
              INPUT: [W,A,S,D] OR [ARROWS]<br/>
              EXEC: [SPACE]
            </p>
            <button 
              tabIndex={-1}
              onClick={(e) => {
                onStart();
                e.currentTarget.blur();
              }}
              className="px-6 py-2 bg-neon-cyan text-neon-black text-3xl hover:bg-neon-magenta hover:text-neon-cyan transition-none uppercase"
            >
              START_PROCESS
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-neon-magenta/20 flex flex-col items-center justify-center z-30 border-4 border-neon-magenta m-4 backdrop-blur-sm">
            <AlertTriangle size={64} className="text-neon-magenta mb-2 animate-flicker" />
            <h2 className="text-6xl text-neon-magenta mb-2 glitch-text" data-text="FATAL_ERR">FATAL_ERR</h2>
            <p className="text-3xl text-neon-cyan mb-8 bg-neon-black px-4 py-1 border border-neon-cyan">
              FINAL_YIELD: {score}
            </p>
            <button 
              tabIndex={-1}
              onClick={(e) => {
                onStart();
                e.currentTarget.blur();
              }}
              className="px-6 py-2 bg-neon-magenta text-neon-black text-3xl hover:bg-neon-cyan hover:text-neon-black transition-none uppercase flex items-center gap-2"
            >
              <RotateCcw size={24} /> REBOOT_SYS
            </button>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-neon-black/60 flex items-center justify-center z-30">
            <div className="border-y-4 border-neon-cyan w-full text-center py-4 bg-neon-black">
              <h2 className="text-6xl text-neon-cyan tracking-widest animate-pulse">SYS.HALTED</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
