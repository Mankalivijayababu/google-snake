import { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, DIRECTION_MAP, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export const useSnake = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Use refs to avoid dependency cycles in the game loop and handle rapid key presses
  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);

  // Sync refs with state
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(Direction.UP);
    nextDirectionRef.current = Direction.UP;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  const togglePause = useCallback(() => {
    if (gameOver || !hasStarted) return;
    setIsPaused(prev => !prev);
  }, [gameOver, hasStarted]);

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) {
          resetGame();
        } else if (!hasStarted) {
          resetGame();
        } else {
          togglePause();
        }
        return;
      }

      if (isPaused || gameOver || !hasStarted) return;

      const currentDir = nextDirectionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== Direction.DOWN) nextDirectionRef.current = Direction.UP;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== Direction.UP) nextDirectionRef.current = Direction.DOWN;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== Direction.RIGHT) nextDirectionRef.current = Direction.LEFT;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== Direction.LEFT) nextDirectionRef.current = Direction.RIGHT;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver, hasStarted, resetGame, togglePause]);

  // Game Loop
  useEffect(() => {
    if (isPaused || gameOver || !hasStarted) return;

    const moveSnake = () => {
      // Read from refs to avoid side-effects inside state updater functions
      const currentSnake = snakeRef.current;
      const currentHead = currentSnake[0];
      const currentDir = nextDirectionRef.current;
      const currentFood = foodRef.current;
      
      // Update the actual direction state now that we are moving
      setDirection(currentDir);

      const moveDelta = DIRECTION_MAP[currentDir];
      const newHead = {
        x: currentHead.x + moveDelta.x,
        y: currentHead.y + moveDelta.y,
      };

      // Check Wall Collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      // Check Self Collision
      if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...currentSnake];

      // Check Food Collision
      if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
        setScore(s => {
          const newScore = s + 10;
          // Increase speed slightly every 50 points
          if (newScore % 50 === 0) {
            setSpeed(prevSpeed => Math.max(MIN_SPEED, prevSpeed - SPEED_INCREMENT * 5));
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      setSnake(newSnake);
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [isPaused, gameOver, hasStarted, speed]);

  return {
    snake,
    food,
    direction,
    score,
    gameOver,
    isPaused,
    hasStarted,
    resetGame,
    togglePause
  };
};
