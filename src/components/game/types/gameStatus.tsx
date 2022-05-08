import { User } from '../../../api/generated';

export type GameStatus =
  | 'entrance'
  | 'friend_match'
  | 'host'
  | 'join'
  | 'waiting'
  | 'play'
  | 'end';

export interface GameContext {
  gameStatus: GameStatus;
  roomId: string;
  hostPlayer: User | null;
  guestPlayer: User | null;
  hostPoints: number;
  guestPoints: number;
}
