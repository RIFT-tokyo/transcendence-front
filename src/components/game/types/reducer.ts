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

export type GameState = {
  gameStatus: GameStatus;
  roomId: string;
  hostPlayer: User | null;
  guestPlayer: User | null;
  hostPoints: number;
  guestPoints: number;
};

export type Actions =
  | { type: 'SET_GAME_STATUS'; payload: GameStatus }
  | { type: 'SET_ROOM_ID'; payload: string }
  | { type: 'SET_HOST_PLAYER'; payload: User | null }
  | { type: 'SET_GUEST_PLAYER'; payload: User | null }
  | { type: 'SET_POINTS'; payload: { hostPoints: number; guestPoints: number } }
  | { type: 'AUTO_MATCHING' }
  | { type: 'CREATE_ROOM'; payload: string }
  | { type: 'CLEAR_STATE' };

export const reducer = (state: GameState, action: Actions) => {
  switch (action.type) {
    case 'SET_GAME_STATUS':
      return {
        ...state,
        gameStatus: action.payload,
      };
    case 'SET_ROOM_ID':
      return {
        ...state,
        roomId: action.payload,
      };
    case 'SET_HOST_PLAYER':
      return {
        ...state,
        hostPlayer: action.payload,
      };
    case 'SET_GUEST_PLAYER':
      return {
        ...state,
        guestPlayer: action.payload,
      };
    case 'SET_POINTS':
     return {
        ...state,
        hostPoints: action.payload.hostPoints,
        guestPoints: action.payload.guestPoints,
      };
    case 'AUTO_MATCHING':
      return {
        ...state,
        gameStatus: 'waiting' as GameStatus,
        roomId: '',
      };
    case 'CREATE_ROOM':
      return {
        ...state,
        gameStatus: 'waiting' as GameStatus,
        roomId: action.payload,
      };
    case 'CLEAR_STATE':
      return {
        gameStatus: 'entrance' as GameStatus,
        roomId: '',
        hostPlayer: null,
        guestPlayer: null,
        hostPoints: 0,
        guestPoints: 0,
      }
    default:
      return state;
  }
};
