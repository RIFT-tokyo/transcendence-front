import { User } from '../../../api/generated';

export type GameStatus =
  | 'entrance'
  | 'friend_match'
  | 'watch_match'
  | 'host'
  | 'join'
  | 'waiting'
  | 'play'
  | 'watch'
  | 'end';

export interface GameContext {
  gameStatus: GameStatus;
  roomId: string;
  hostPlayer: User | null;
  guestPlayer: User | null;
  hostPoints: number;
  guestPoints: number;
}
