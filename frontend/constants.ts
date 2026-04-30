import { Track, Point, Direction } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 120;
export const SPEED_INCREMENT = 3;
export const MIN_SPEED = 40;

export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const DIRECTION_MAP: Record<Direction, Point> = {
  [Direction.UP]: { x: 0, y: -1 },
  [Direction.DOWN]: { x: 0, y: 1 },
  [Direction.LEFT]: { x: -1, y: 0 },
  [Direction.RIGHT]: { x: 1, y: 0 },
};

export const PLAYLIST: Track[] = [
  {
    id: 'trk-001',
    title: 'SEQ_01: NEURAL_DECAY',
    artist: 'SYS.GEN_AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  {
    id: 'trk-002',
    title: 'SEQ_02: DATA_CORRUPTION',
    artist: 'SYS.GEN_AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  {
    id: 'trk-003',
    title: 'SEQ_03: VOID_PULSE',
    artist: 'SYS.GEN_AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  }
];
